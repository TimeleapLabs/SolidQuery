import { toCamel, toCallData, toMemory, parseFieldType } from "../common.js";
import { getIdField } from "../helpers/id.js";

/**
 * Generates Solidity functions for finding records in the schema's
 * structures by indexed fields.
 * @param {Object} schema - The schema object to parse.
 * @return {string} Solidity functions for finding records, each function
 * on a new line.
 */
export const getFindFunctions = (schema) => {
  const functions = [];
  for (const [structName, details] of Object.entries(schema)) {
    const id = getIdField(structName, details);
    for (const [fieldName, fieldType] of Object.entries(details)) {
      const { type, indexed } = parseFieldType(fieldType);
      if (indexed) {
        const functionName = toCamel("find", structName, "by", fieldName);
        const indexName = toCamel(structName, fieldName);
        const calldataType = toCallData(type);
        functions.push(`
          /**
           * @dev Finds IDs of ${structName} records by a specific ${fieldName}.
           * @param value The ${fieldName} value to search by.
           * @return An array of matching record IDs.
           */
          function ${functionName}(${calldataType} value) external view returns (${id.type}[] memory) {
            return ${indexName}Index[value];
          }
        `);
      }
    }
  }
  return functions.join("\n");
};

/**
 * Generates Solidity functions for retrieving multiple records from the
 * schema's structures by their IDs.
 * @param {Object} schema - The schema object to parse.
 * @return {string} Solidity functions for getting records, each function
 * on a new line.
 */
export const getGetFunctions = (schema) => {
  const functions = [];
  for (const [structName, details] of Object.entries(schema)) {
    const id = getIdField(structName, details);
    const functionName = toCamel("get", `${structName}s`, "by", id.name);
    functions.push(`
      /**
       * @dev Retrieves an array of ${structName} records by their IDs.
       * @param ${id.name}List An array of record IDs to retrieve.
       * @return An array of the retrieved records.
       */
      function ${functionName}(${id.type}[] calldata ${id.name}List) external view returns (${structName}[] memory) {
        uint256 length = ${id.name}List.length;
        ${structName}[] memory result = new ${structName}[](length);
        for (uint256 index = 0; index < length; index++) {
          result[index] = ${structName}s[${id.name}List[index]];
        }
        return result;
      }
    `);
  }
  return functions.join("\n");
};

/**
 * Generates Solidity functions for retrieving a specific field of a specific
 * record by its ID.
 * @param {Object} schema - The schema object to parse.
 * @return {string} Solidity functions for getting records, each function
 * on a new line.
 */
export const getFieldGetFunctions = (schema) => {
  const functions = [];
  for (const [structName, details] of Object.entries(schema)) {
    const id = getIdField(structName, details);
    for (const [fieldName, fieldType] of Object.entries(details)) {
      const { type, get } = parseFieldType(fieldType);
      if (get) {
        const functionName = toCamel(
          "get",
          structName,
          fieldName,
          "by",
          id.name
        );
        const returnType = toMemory(type);
        functions.push(`
          /**
           * @dev Retrieves the ${fieldName} of a ${structName} record by its ID.
           * @param ${id.name} ${id.name} of the record to retrieve.
           * @return The ${fieldName} of the ${structName}
           */
          function ${functionName}(${id.type} ${id.name}) external view returns (${returnType}) {
            return ${structName}s[${id.name}].${fieldName};
          }
        `);
      }
    }
  }
  return functions.join("\n");
};
