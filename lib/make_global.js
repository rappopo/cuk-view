'use strict'

module.exports = function(cuk) {
  const { _, helper, globby, path, fs } = cuk.pkg.core.lib
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
    const item = require(opt.file)(cuk)
    globl[name] = _.isPlainObject(item) ? item : { handler: item }
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