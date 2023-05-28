import { toCamel } from "../common.js";

/**
 * Generates Solidity functions for deleting records from the schema's
 * structures.
 * @param {Object} schema - The schema object to parse.
 * @return {string} Solidity functions for deleting records, each function
 * on a new line.
 */
export const getDeleteFunctions = (schema) => {
  const functions = [];
  for (const [structName, { id, fields }] of Object.entries(schema)) {
    const indexes = [];
    for (const [fieldName, { indexed }] of Object.entries(fields)) {
      if (indexed) {
        const indexFunctionName = toCamel(
          "delete",
          structName,
          fieldName,
          "index",
          "for",
          id.name
        );
        indexes.push(`${indexFunctionName}(${id.name});`);
      }
    }
    const functionName = toCamel("delete", structName);
    const body = [
      `${indexes.join("\n")}`,
      `delete ${structName}s[${id.name}];`,
      `emit ${structName}Deleted(${id.name});`,
    ]
      .filter(Boolean)
      .join("\n");
    functions.push(`
      /**
       * @dev Deletes a ${structName} record by its ID and updates relevant indexes.
       * @notice Emits a ${structName}Deleted event on success.
       * @param ${id.name} The ID of the record to delete.
       */
      function ${functionName}(${id.type} ${id.name}) external onlyOwner {
        ${body}
      }
    `);
  }
  return functions.join("\n");
};
