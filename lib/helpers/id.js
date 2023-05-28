import { parseFieldType } from "../common.js";

/**
 * Get the Solidity type and name to use for the IDs of a record type.
 * @param {Object} name - The name of the record.
 * @param {Object} recordSchema - The schema of the record.
 * @return {string} Solidity type for record IDs.
 */
export const getIdField = (name, recordSchema) => {
  const idTypes = [];
  for (const [name, fieldType] of Object.entries(recordSchema)) {
    const { type, id, set, get, indexed } = parseFieldType(fieldType);
    if (id) {
      if (set) {
        error(`${name}:: ID field can't have the "set" modifier`);
      } else if (get) {
        error(`${name}:: ID field can't have the "get" modifier`);
      } else if (indexed) {
        error(`${name}:: ID field can't have the "indexed" modifier`);
      }
      idTypes.push({ type, name });
    }
  }
  if (idTypes.length > 1) {
    error(`${name}:: Cannot define more than one ID field`);
  }
  return idTypes[0] || { type: "uint256", name: "Id", auto: true };
};
