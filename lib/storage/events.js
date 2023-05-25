import { parseFieldType } from "../common.js";

/**
 * Generates and returns Solidity event declarations for each struct in the
 * schema.
 * @param {Object} schema - The schema object where each key-value pair
 * represents a struct name and its details.
 * @return {string} Solidity event declarations for each struct, each on a new
 * line.
 */
export const getEvents = (schema) => {
  const events = [];
  for (const [structName, details] of Object.entries(schema)) {
    const inner = [];
    for (const [fieldName, fieldType] of Object.entries(details)) {
      const { type } = parseFieldType(fieldType);
      inner.push(`${type} ${fieldName}`);
    }
    events.push(`
      event ${structName}Created(uint256 id, ${inner.join(", ")});
      event ${structName}Updated(uint256 id, ${inner.join(", ")});
      event ${structName}Deleted(uint256 id);\n`);
  }
  return events.join("\n");
};
