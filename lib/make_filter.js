'use strict'

module.exports = function(cuk, trace) {
  const { _, helper, globby, path, fs } = cuk.lib
  const filter = {}

  const action = opt => {
    let pkgId = opt.pkg.id
    if (pkgId === 'root') pkgId = ''
    const name = _.camelCase(`${pkgId}:${opt.key}`)
    filter[name] = opt.value
    trace('Filter » Serve -> %s', name)
  }

  helper('core:bootDeep')({ pkgId: 'view', name: 'filter', action: action, createContainer: false })
  return filter
}