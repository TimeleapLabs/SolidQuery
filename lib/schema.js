import { getIdField } from "./helpers/id.js";
import { parseFieldType } from "./common.js";
import { error } from "./helpers/console.js";

import chalk from "chalk";

/**
 * Parses and validates a SolidQuery YAML schema
 * @param {Object} schema The schema to parse
 */
export const parseSchema = (schema) => {
  const parsed = {};
  for (const [structName, definition] of Object.entries(schema)) {
    try {
      const id = getIdField(definition);
      if (!id.type) {
        error(`${chalk.bold(structName)}: The "ID" field doesn't have a type!`);
      }
      const fieldEntries = Object.entries(definition)
        .map(([name, type]) => [name, parseFieldType(type)])
        .filter(([_, details]) => !details.id);
      for (const [name, { type }] of fieldEntries) {
        if (!type) {
          error(
            `${chalk.bold(
              structName
            )}: The "${name}" field doesn't have a type!`
          );
        }
      }
      const fields = Object.fromEntries(fieldEntries);
      parsed[structName] = { id, fields };
    } catch (err) {
      error(`${chalk.bold(structName)}: ${err.message}`);
    }
  }
  return parsed;
};
