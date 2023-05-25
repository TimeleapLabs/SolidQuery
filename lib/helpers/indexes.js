import { toCamel, parseFieldType } from "../common.js";

/**
 * Generates Solidity functions for deleting indexed fields from the schema.
 * @param {Object} schema - The schema object to parse.
 * @return {string} Solidity functions for deleting indexed fields,
 * each function on a new line.
 */
export const getDeleteIndexFunctions = (schema) => {
  const functions = [];
  for (const [structName, details] of Object.entries(schema)) {
    for (const [fieldName, fieldType] of Object.entries(details)) {
      const { indexed } = parseFieldType(fieldType);
      if (indexed) {
        const indexName = toCamel(structName, fieldName);
        const functionName = toCamel("delete", structName, fieldName);
        functions.push(`
          /**
           * @dev Removes an ID from the ${indexName} index for a given ${structName} record.
           * @param id The ID of the record to remove from the index.
           */
          function ${functionName}IndexForId(uint256 id) internal {
            uint256[] storage index = ${indexName}Index[${structName}s[id].${fieldName}];
            popFromIndex(index, id);
          }
        `);
      }
    }
  }
  return functions.join("\n");
};

/**
 * Generates Solidity functions for adding indexed fields to the schema.
 * @param {Object} schema - The schema object to parse.
 * @return {string} Solidity functions for adding indexed fields,
 * each function on a new line.
 */
export const getAddIndexFunctions = (schema) => {
  const functions = [];
  for (const [structName, details] of Object.entries(schema)) {
    for (const [fieldName, fieldType] of Object.entries(details)) {
      const { indexed } = parseFieldType(fieldType);
      if (indexed) {
        const indexName = toCamel(structName, fieldName);
        const functionName = toCamel("add", structName, fieldName);
        functions.push(`
          /**
           * @dev Adds a new ID to the ${indexName} index for a given ${structName} record.
           * @param id The ID of the record to add.
           * @param value The ${structName} record to add.
           */
          function ${functionName}IndexForId(uint256 id, ${structName} calldata value) internal {
            ${indexName}Index[value.${fieldName}].push(id);
          }
        `);
      }
    }
  }
  return functions.join("\n");
};
