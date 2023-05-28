import { parseFieldType } from "../common.js";

/**
 * Get the Solidity type and name to use for the IDs of a record type.
 * @param {Object} recordSchema - The schema of the record.
 * @return {string} Solidity type for record IDs.
 */
export const getIdField = (recordSchema) => {
  const idTypes = [];
  for (const [name, fieldType] of Object.entries(recordSchema)) {
    const { type, id, set, get, indexed, auto } = parseFieldType(fieldType);
    if (id) {
      if (set) {
        throw new Error(`ID field can't have the "set" modifier`);
      } else if (get) {
        throw new Error(`ID field can't have the "get" modifier`);
      } else if (indexed) {
        throw new Error(`ID field can't have the "indexed" modifier`);
      }
      if (auto && !type.startsWith("uint")) {
        throw new Error(`The "auto" modifier is only valid for uint* IDs`);
      }
      idTypes.push({ type, name, auto });
    }
  }
  if (idTypes.length > 1) {
    throw new Error("More than one ID field is defined");
  }
  return idTypes[0] || { type: "uint256", name: "Id", auto: true };
};
