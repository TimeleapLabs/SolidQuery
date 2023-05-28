/**
 * Generates and returns Solidity storage declarations for each type in the
 * schema.
 * @param {Object} schema - The schema object where each key represents a
 * storage type.
 * @return {string} Solidity storage declarations for each type, each on a new
 * line.
 */
export const getStorages = (schema) => {
  const storages = [];
  for (const [storageType, { id }] of Object.entries(schema)) {
    storages.push(`mapping(${id.type} => ${storageType}) ${storageType}s;`);
  }
  return storages.join("\n");
};
