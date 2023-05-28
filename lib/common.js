import camelCase from "camelcase";

/**
 * Converts an array of strings into a camel-cased string.
 * @param {string[]} arr - Array of strings to be converted.
 * @return {string} The camel-cased result string.
 */
export const toCamel = (...arr) => camelCase(arr.join("-"));

/**
 * Parses a field type into an object with the type and whether it's indexed.
 * @param {(string|Object)} type - The field type to be parsed. If a string, it
 * will be split and analyzed.
 * @return {Object} An object containing the type as a string and a boolean
 * indicating whether it's indexed.
 */
export const parseFieldType = (fieldType) => {
  if (typeof fieldType === "string") {
    const [type, ...properties] = fieldType.split(" ");
    return {
      type,
      ...Object.fromEntries(properties.map((property) => [property, true])),
    };
  }
  return fieldType;
};

const arrayDataTypes = ["string"];

/**
 * Appends `calldata` to a data-type whenever required
 * @param {string} type - Data type.
 * @return {string} Data type with `calldata` prepended.
 */
export const toCallData = (type) =>
  arrayDataTypes.includes(type) ? `${type} calldata` : type;

/**
 * Appends `memory` to a data-type whenever required
 * @param {string} type - Data type.
 * @return {string} Data type with `memory` prepended.
 */
export const toMemory = (type) =>
  arrayDataTypes.includes(type) ? `${type} memory` : type;
