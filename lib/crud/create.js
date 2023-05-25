import { toCamel, parseFieldType } from "../common.js";

/**
 * Generates Solidity functions for adding records to the schema's structures.
 * @param {Object} schema - The schema object to parse.
 * @return {string} Solidity functions for adding records, each function
 * on a new line.
 */
export const getAddFunctions = (schema) => {
  const functions = [];
  for (const [structName, details] of Object.entries(schema)) {
    const indexes = [];
    for (const [fieldName, fieldType] of Object.entries(details)) {
      const { indexed } = parseFieldType(fieldType);
      if (indexed) {
        const indexFunctionName = toCamel("add", structName, fieldName);
        indexes.push(`${indexFunctionName}IndexForId(id, value);`);
      }
    }
    const functionName = toCamel("add", structName);
    const fields = Object.keys(details).map((field) => `value.${field}`);
    functions.push(`
      /**
       * @dev Adds a new ${structName} record and updates relevant indexes.
       * @notice Emits a ${structName}Added event on success.
       * @param value The new record to add.
       * @return The ID of the newly added record.
       */
      function ${functionName}(${structName} calldata value) external onlyOwner returns (uint256) {
        uint256 id = ${structName}s.length;
        ${structName}s.push(value);
        ${indexes.join("\n")}
        emit ${structName}Created(id, ${fields.join(", ")});
        return id;
      }
    `);
  }
  return functions.join("\n");
};
