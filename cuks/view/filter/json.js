'use strict'

module.exports = function(cuk) {
  return obj => {
    return JSON.stringify(obj, null, 2)
  }
}