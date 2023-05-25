import { toCamel, toCallData, parseFieldType } from "../common.js";

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
          function ${functionName}(${calldataType} value) external view returns (uint256[] memory) {
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
  for (const [structName] of Object.entries(schema)) {
    const functionName = toCamel("get", `${structName}s`, "by", "Id");
    functions.push(`
      /**
       * @dev Retrieves an array of ${structName} records by their IDs.
       * @param ids An array of record IDs to retrieve.
       * @return An array of the retrieved records.
       */
      function ${functionName}(uint256[] calldata ids) external view returns (${structName}[] memory) {
        uint256 length = ids.length;
        ${structName}[] memory result = new ${structName}[](length);
        for (uint256 index = 0; index < length; index++) {
          result[index] = ${structName}s[ids[index]];
        }
        return result;
      }
    `);
  }
  return functions.join("\n");
};
