import { toCamel, parseFieldType } from "../common.js";

/**
 * Generates Solidity functions for updating records in the schema's structures.
 * @param {Object} schema - The schema object to parse.
 * @return {string} Solidity functions for updating records, each function
 * on a new line.
 */
export const getUpdateFunctions = (schema) => {
  const functions = [];
  for (const [structName, details] of Object.entries(schema)) {
    const indexes = [];
    for (const [fieldName, fieldType] of Object.entries(details)) {
      const { indexed } = parseFieldType(fieldType);
      if (indexed) {
        const deleteIndexFunction = toCamel("delete", structName, fieldName);
        indexes.push(`${deleteIndexFunction}IndexForId(id);`);
        const addIndexFunction = toCamel("add", structName, fieldName);
        indexes.push(`${addIndexFunction}IndexForId(id, value);`);
      }
    }
    const functionName = toCamel("update", structName);
    const fields = Object.keys(details).map((field) => `value.${field}`);
    functions.push(`
      /**
       * @dev Updates a ${structName} record by its ID.
       * @notice Emits a ${structName}Updated event on success.
       * @param id The ID of the record to update.
       * @param value The new data to update the record with.
       */
      function ${functionName}(uint256 id, ${structName} calldata value) external onlyOwner {
        ${indexes.join("\n")}
        ${structName}s[id] = value;
        emit ${structName}Updated(id, ${fields.join(", ")});
      }
    `);
  }
  return functions.join("\n");
};
