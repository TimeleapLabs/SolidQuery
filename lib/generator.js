import { format } from "prettier";
import parserSolidity from "prettier-plugin-solidity";

import {
  getStructs,
  getStorages,
  getIndexes,
  getEvents,
  getCounters,
} from "./storage/all.js";

import {
  getDeleteIndexFunctions,
  getAddIndexFunctions,
  getPopFunctions,
} from "./helpers/all.js";

import {
  getAddFunctions,
  getDeleteFunctions,
  getUpdateFunctions,
  getFieldSetFunctions,
  getFindFunctions,
  getGetFunctions,
  getFieldGetFunctions,
} from "./crud/all.js";

/**
 * Generates a complete Solidity contract with CRUD operations for a given schema.
 * @param {Object} schema - The schema object to parse.
 * @return {string} Formatted Solidity contract.
 */
export const generate = (schema) => {
  // Data layer
  const counters = getCounters(schema);
  const structs = getStructs(schema);
  const events = getEvents(schema);
  const storages = getStorages(schema);
  const indexes = getIndexes(schema);
  // CRUD helpers
  const popFunctions = getPopFunctions(schema);
  const deleteIndexFunctions = getDeleteIndexFunctions(schema);
  const addIndexFunctions = getAddIndexFunctions(schema);
  // CRUD functions
  const addFunctions = getAddFunctions(schema);
  const deleteFunctions = getDeleteFunctions(schema);
  const updateFunctions = getUpdateFunctions(schema);
  const setFieldFunctions = getFieldSetFunctions(schema);
  const findFunctions = getFindFunctions(schema);
  const getFunctions = getGetFunctions(schema);
  const getFieldFunctions = getFieldGetFunctions(schema);

  const contract = `\
//SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/utils/Context.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract Storage is Context, Ownable {
  ${structs}

  ${counters}

  ${events}

  ${storages}

  ${indexes}

  ${popFunctions}
  ${deleteIndexFunctions}
  ${addIndexFunctions}
  ${addFunctions}
  ${deleteFunctions}
  ${updateFunctions}
  ${setFieldFunctions}
  ${findFunctions}
  ${getFunctions}
  ${getFieldFunctions}
}
`;

  const formatted = format(contract, {
    parser: "solidity-parse",
    plugins: [parserSolidity],
    tabWidth: 2,
  });

  return formatted;
};
