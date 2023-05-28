import { parseFieldType } from "../common.js";

/**
 * Generates and returns Solidity struct declarations for each struct in the
 * schema.
 * @param {Object} schema - The schema object where each key-value pair
 * represents a struct name and its details.
 * @return {string} Solidity struct declarations for each struct, each on a new
 * line.
 */
export const getStructs = (schema) => {
  const structs = [];
  for (const [structName, details] of Object.entries(schema)) {
    const inner = [];
    for (const [fieldName, fieldType] of Object.entries(details)) {
      const { type, id } = parseFieldType(fieldType);
      if (!id) {
        inner.push(`${type} ${fieldName}`);
      }
    }
    structs.push(`struct ${structName} { ${inner.join("; ")}; }\n`);
  }
  return structs.join("\n");
};
