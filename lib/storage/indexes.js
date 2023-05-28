import { toCamel } from "../common.js";

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
  for (const [structName, { id, fields }] of Object.entries(schema)) {
    for (const [fieldName, { type, indexed }] of Object.entries(fields)) {
      const indexName = toCamel(structName, fieldName);
      if (indexed) {
        indexes.push(`mapping(${type} => ${id.type}[]) ${indexName}Index;`);
      }
    }
  }
  return indexes.join("\n");
};
