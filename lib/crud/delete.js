import { toCamel, parseFieldType } from "../common.js";

/**
 * Generates Solidity functions for deleting records from the schema's
 * structures.
 * @param {Object} schema - The schema object to parse.
 * @return {string} Solidity functions for deleting records, each function
 * on a new line.
 */
export const getDeleteFunctions = (schema) => {
  const functions = [];
  for (const [structName, details] of Object.entries(schema)) {
    const indexes = [];
    for (const [fieldName, fieldType] of Object.entries(details)) {
      const { indexed } = parseFieldType(fieldType);
      if (indexed) {
        const indexFunctionName = toCamel("delete", structName, fieldName);
        indexes.push(`${indexFunctionName}IndexForId(id);`);
      }
    }
    const functionName = toCamel("delete", structName);
    functions.push(`
      /**
       * @dev Deletes a ${structName} record by its ID and updates relevant indexes.
       * @notice Emits a ${structName}Deleted event on success.
       * @param id The ID of the record to delete.
       */
      function ${functionName}(uint256 id) external onlyOwner {
        ${indexes.join("\n")}
        delete ${structName}s[id];
        emit ${structName}Deleted(id);
      }
    `);
  }
  return functions.join("\n");
};
