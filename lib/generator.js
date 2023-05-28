import { format } from "prettier";
import parserSolidity from "prettier-plugin-solidity";

import { parseSchema } from "./schema.js";

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
  const parsed = parseSchema(schema);
  // Data layer
  const counters = getCounters(parsed);
  const structs = getStructs(parsed);
  const events = getEvents(parsed);
  const storages = getStorages(parsed);
  const indexes = getIndexes(parsed);
  // CRUD helpers
  const popFunctions = getPopFunctions(parsed);
  const deleteIndexFunctions = getDeleteIndexFunctions(parsed);
  const addIndexFunctions = getAddIndexFunctions(parsed);
  // CRUD functions
  const addFunctions = getAddFunctions(parsed);
  const deleteFunctions = getDeleteFunctions(parsed);
  const updateFunctions = getUpdateFunctions(parsed);
  const setFieldFunctions = getFieldSetFunctions(parsed);
  const findFunctions = getFindFunctions(parsed);
  const getFunctions = getGetFunctions(parsed);
  const getFieldFunctions = getFieldGetFunctions(parsed);

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
