const extract = require('deep-props.extract')
const set = require('deep-props.set')

module.exports = object => extract(object).sort((a, b) => {
  if (a.path[a.path.length - 1] < b.path[b.path.length - 1]) return -1
  if (a.path[a.path.length - 1] > b.path[b.path.length - 1]) return 1
  return 0
}).sort((a, b) => {
  if (a.path.length < b.path.length) return -1
  if (a.path.length > b.path.length) return 1
  return 0
}).reduce((newObj, info) => set(newObj, info.path, info.value), {})
