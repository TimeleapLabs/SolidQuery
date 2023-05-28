import { getIdField } from "../helpers/id.js";
import { toCamel } from "../common.js";

/**
 * Generates and returns Solidity storage declarations for each type in the
 * schema.
 * @param {Object} schema - The schema object where each key represents a
 * storage type.
 * @return {string} Solidity storage declarations for each type, each on a new
 * line.
 */
export const getStorages = (schema) => {
  const storages = [];
  for (const [storageType, details] of Object.entries(schema)) {
    const { type } = getIdField(storageType, details);
    storages.push(`mapping(${type} => ${storageType}) ${storageType}s;`);
  }
  return storages.join("\n");
};
