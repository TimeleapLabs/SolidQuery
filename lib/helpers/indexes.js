import { toCamel, parseFieldType } from "../common.js";
import { getIdField } from "./id.js";

/**
 * Generates Solidity functions for deleting indexed fields from the schema.
 * @param {Object} schema - The schema object to parse.
 * @return {string} Solidity functions for deleting indexed fields,
 * each function on a new line.
 */
export const getDeleteIndexFunctions = (schema) => {
  const functions = [];
  for (const [structName, details] of Object.entries(schema)) {
    const id = getIdField(structName, details);
    for (const [fieldName, fieldType] of Object.entries(details)) {
      const { indexed } = parseFieldType(fieldType);
      if (indexed) {
        const indexName = toCamel(structName, fieldName);
        const functionName = toCamel(
          "delete",
          structName,
          fieldName,
          "index",
          "for",
          id.name
        );
        functions.push(`
          /**
           * @dev Removes an ID from the ${indexName} index for a given ${structName} record.
           * @param ${id.name} The ${id.name} of the record to remove from the index.
           */
          function ${functionName}(${id.type} ${id.name}) internal {
            uint256[] storage index = ${indexName}Index[${structName}s[${id.name}].${fieldName}];
            popFromIndex(index, ${id.name});
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
    const id = getIdField(structName, details);
    for (const [fieldName, fieldType] of Object.entries(details)) {
      const { indexed } = parseFieldType(fieldType);
      if (indexed) {
        const indexName = toCamel(structName, fieldName);
        const functionName = toCamel(
          "add",
          structName,
          fieldName,
          "index",
          "for",
          id.name
        );
        functions.push(`
          /**
           * @dev Adds a new ID to the ${indexName} index for a given ${structName} record.
           * @param ${id.name} The ${id.name} of the record to add.
           * @param value The ${structName} record to add.
           */
          function ${functionName}(${id.type} ${id.name}, ${structName} memory value) internal {
            ${indexName}Index[value.${fieldName}].push(${id.name});
          }
        `);
      }
    }
  }
  return functions.join("\n");
};
