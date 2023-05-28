import { getIdField } from "../helpers/id.js";
import { toCamel } from "../common.js";

/**
 * Generates and returns Solidity counter declarations for each type in the
 * schema.
 * @param {Object} schema - The schema object where each key represents a
 * storage type.
 * @return {string} Solidity counter declarations for each type, each on a new
 * line.
 */
export const getCounters = (schema) => {
  const counters = [];
  for (const [storageType, details] of Object.entries(schema)) {
    const { type, auto } = getIdField(storageType, details);
    if (type === "uint256" && auto) {
      const counterName = toCamel(storageType, "counter");
      counters.push(`uint256 private ${counterName} = 0;`);
    }
  }
  return counters.join("\n");
};
