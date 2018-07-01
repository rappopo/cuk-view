'use strict'

module.exports = function(cuk) {
  const { _, helper, globby, path, fs } = cuk.lib
  const globl = {}

  const action = opt => {
    const disabled = _.get(cuk.pkg.view, 'cfg.common.disabled.global', [])
    let pkgId = opt.pkg.id
    if (pkgId === 'app') pkgId = ''
    const name = pkgId + _.upperFirst(_.camelCase(opt.key))
    if (disabled.indexOf(name) > -1) {
      helper('core:bootTrace')('%B Disabled %K %s', null, null, name)
      return
    }
    globl[name] = require(opt.file)(cuk)
    helper('core:bootTrace')('%B Enabled %K %s', null, null, name)
  }

  helper('core:bootFlat')({
    pkgId: 'view',
    name: 'global',
    action: action,
    createAppDir: true,
    createContainer: false
  })
  return globl
}