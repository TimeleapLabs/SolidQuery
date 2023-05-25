import { format } from "prettier";
import parserSolidity from "prettier-plugin-solidity";

import {
  getStructs,
  getStorages,
  getIndexes,
  getEvents,
} from "./storage/all.js";
import {
  getDeleteIndexFunctions,
  getAddIndexFunctions,
} from "./helpers/all.js";
import {
  getAddFunctions,
  getDeleteFunctions,
  getUpdateFunctions,
  getFindFunctions,
  getGetFunctions,
} from "./crud/all.js";

/**
 * Generates a complete Solidity contract with CRUD operations for a given schema.
 * @param {Object} schema - The schema object to parse.
 * @return {string} Formatted Solidity contract.
 */
export const generate = (schema) => {
  // Data layer
  const structs = getStructs(schema);
  const events = getEvents(schema);
  const storages = getStorages(schema);
  const indexes = getIndexes(schema);
  // CRUD helpers
  const deleteIndexFunctions = getDeleteIndexFunctions(schema);
  const addIndexFunctions = getAddIndexFunctions(schema);
  // CRUD functions
  const addFunctions = getAddFunctions(schema);
  const deleteFunctions = getDeleteFunctions(schema);
  const updateFunctions = getUpdateFunctions(schema);
  const findFunctions = getFindFunctions(schema);
  const getFunctions = getGetFunctions(schema);

  const contract = `\
//SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/utils/Context.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract Storage is Context, Ownable {
  ${structs}

  ${events}

  ${storages}

  ${indexes}

  /**
   * Removes a specific id from an array stored in the contract's storage.
   *
   * @param index The storage array from which to remove the id.
   * @param id The id to remove from the array.
   */
  function popFromIndex(uint256[] storage index, uint256 id) internal {
    uint256 length = index.length;
    for (uint256 i = 0; i < length; i++) {
      if (id == index[i]) {
        index[i] = index[length - 1];
        index.pop();
        break;
      }
    }
  }

  ${deleteIndexFunctions}
  ${addIndexFunctions}
  ${addFunctions}
  ${deleteFunctions}
  ${updateFunctions}
  ${findFunctions}
  ${getFunctions}
}
`;

  const formatted = format(contract, {
    parser: "solidity-parse",
    plugins: [parserSolidity],
    tabWidth: 2,
  });

  return formatted;
};
