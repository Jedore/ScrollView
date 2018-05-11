/* 
 * deepCopy
 */
const deepCopy = function(obj) {
  if (obj instanceof Object) {
    let newObj = obj.constructor === Array ? [] : {}
    for (let i in obj) {
      newObj[i] = deepCopy(obj[i])
    }
    return newObj
  } else {
    return obj
  }
  }

module.exports = {
  deepCopy: deepCopy,
}
