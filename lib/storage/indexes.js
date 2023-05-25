import { toCamel, parseFieldType } from "../common.js";

/**
 * Extracts and returns indexed fields from the schema as Solidity mapping
 * statements.
 * @param {Object} schema - The schema object where each key-value pair
 * represents a structure name and its details.
 * @return {string} Solidity mapping statements for indexed fields, each on a
 * new line.
 */
export const getIndexes = (schema) => {
  const indexes = [];
  for (const [structName, details] of Object.entries(schema)) {
    for (const [fieldName, fieldType] of Object.entries(details)) {
      const { type, indexed } = parseFieldType(fieldType);
      const indexName = toCamel(structName, fieldName);
      if (indexed) {
        indexes.push(`mapping(${type} => uint256[]) ${indexName}Index;`);
      }
    }
  }
  return indexes.join("\n");
};
