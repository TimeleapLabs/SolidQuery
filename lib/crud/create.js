import { toCamel } from "../common.js";

/**
 * Generates Solidity functions for adding records to the schema's structures.
 * @param {Object} schema - The schema object to parse.
 * @return {string} Solidity functions for adding records, each function
 * on a new line.
 */
export const getAddFunctions = (schema) => {
  const functions = [];
  for (const [structName, { id, fields }] of Object.entries(schema)) {
    const indexes = [];
    for (const [fieldName, { indexed }] of Object.entries(fields)) {
      if (indexed) {
        const indexFunctionName = toCamel(
          "add",
          structName,
          fieldName,
          "index",
          "for",
          id.name
        );
        indexes.push(`${indexFunctionName}(${id.name}, value);`);
      }
    }
    const functionName = toCamel("add", structName);
    const eventFields = Object.keys(fields).map((field) => `value.${field}`);
    const counterName = toCamel(structName, "counter");
    if (id.auto) {
      const body = [
        `uint256 ${id.name} = ${counterName}++;`,
        `${structName}s[${id.name}] = value;`,
        `${indexes.join("\n")}`,
        `emit ${structName}Created(${id.name}, ${eventFields.join(", ")});`,
        `return ${id.name};`,
      ]
        .filter(Boolean)
        .join("\n");
      functions.push(`
        /**
         * @dev Adds a new ${structName} record and updates relevant indexes.
         * @notice Emits a ${structName}Added event on success.
         * @param value The new record to add.
         * @return The ID of the newly added record.
         */
        function ${functionName}(${structName} calldata value) external onlyOwner returns (uint256) {
          ${body}
        }
      `);
    } else {
      const idType = id.type;
      const idName = id.name;
      const body = [
        `${structName}s[${idName}] = value;`,
        `${indexes.join("\n")}`,
        `emit ${structName}Created(${idName}, ${eventFields.join(", ")});`,
      ]
        .filter(Boolean)
        .join("\n");
      functions.push(`
        /**
         * @dev Adds a new ${structName} record and updates relevant indexes.
         * @notice Emits a ${structName}Added event on success.
         * @param ${idName} The ${idName} of the record to add.
         * @param value The new record to add.
         */
        function ${functionName}(${idType} ${idName}, ${structName} calldata value) external onlyOwner {
          ${body}
        }
      `);
    }
  }
  return functions.join("\n");
};
