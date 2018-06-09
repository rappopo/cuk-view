'use strict'

module.exports = function(cuk) {
  const { path } = cuk.lib
  return Promise.resolve({
    id: 'view',
    tag: 'boot',
    level: 15
  })
}