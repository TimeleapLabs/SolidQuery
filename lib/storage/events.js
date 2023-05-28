import { parseFieldType } from "../common.js";
import { getIdField } from "../helpers/id.js";

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
      const { type, id } = parseFieldType(fieldType);
      if (!id) {
        inner.push(`${type} ${fieldName}`);
      }
    }
    const id = getIdField(structName, details);
    events.push(`
      event ${structName}Created(${id.type} ${id.name}, ${inner.join(", ")});
      event ${structName}Updated(${id.type} ${id.name}, ${inner.join(", ")});
      event ${structName}Deleted(${id.type} ${id.name});\n`);
  }
  return events.join("\n");
};
