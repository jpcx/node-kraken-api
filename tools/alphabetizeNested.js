const { extract, set } = require('deep-props')

/**
 * Alphabetizes a nested object.
 *
 * @module  Tools/AlphabetizeNested
 * @param   {Object} object - Object to alphabetize.
 * @returns {Object} Alphabetized object.
 */
module.exports = object => {
  const extracted = extract(object)
  const maxDepth = extract(object).reduce(
    (max, v) => v.path.length > max ? v.path.length : max, 0
  )
  for (let i = 0; i < maxDepth; i++) {
    extracted.sort((a, b) => {
      if (a.path[i] > b.path[i]) return 1
      if (a.path[i] < b.path[i]) return -1
      return 0
    })
  }
  return extracted.reduce(
    (newObj, info) => set(newObj, info.path, info.value), {}
  )
}
