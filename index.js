/**
 * Convert an array-like object into an `Array`.
 * If `collection` is already an `Array`, then will return a clone of `collection`.
 *
 * @param {Array | Mixed} collection An `Array` or array-like object to convert e.g. `arguments` or `NodeList`
 * @return {Array} Naive conversion of `collection` to a new `Array`.
 * @api private
 */

module.exports = function toArray(collection) {
  if (Array.isArray(collection)) return collection.slice()
  var arr = []
  if (!collection || !collection.length) return arr
  for (var i = 0; i < collection.length; i++) {
    if (collection.hasOwnProperty(i) || i in collection) {
      arr.push(collection[i])
    }
  }
  return arr
}
