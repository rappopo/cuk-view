'use strict'

module.exports = function(cuk, trace) {
  const { _, helper, globby, path, fs } = cuk.lib
  const globl = {}

  const action = opt => {
    let pkgId = opt.pkg.id
    if (pkgId === 'root') pkgId = ''
    const name = _.camelCase(`${pkgId}:${opt.key}`)
    globl[name] = opt.value
    trace('Global » Serve -> %s', name)
  }

  helper('core:bootFlat')({
    pkgId: 'view',
    name: 'global',
    action: action,
    createRootDir: true,
    createContainer: false
  })
  return globl
}