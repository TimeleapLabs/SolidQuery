/**
 * Generates Solidity functions for popping an id from an index.
 * @param {Object} schema - The schema object to parse.
 * @return {string} Solidity functions for adding indexed fields,
 * each function on a new line.
 */
export const getPopFunctions = (schema) => {
  const functions = [];
  const addedTypes = [];
  for (const { id } of Object.values(schema)) {
    if (!addedTypes.includes(id.type)) {
      functions.push(`
        /**
         * @dev Removes a specific id from an array stored in the contract's storage.
         * @param index The storage array from which to remove the id.
         * @param id The id to remove from the array.
         */
          function popFromIndex(${id.type}[] storage index, ${id.type} id) internal {
            uint256 length = index.length;
            for (uint256 i = 0; i < length; i++) {
              if (id == index[i]) {
                index[i] = index[length - 1];
                index.pop();
                break;
              }
            }
          }
      `);
      addedTypes.push(id.type);
    }
  }
  return functions.join("\n");
};
