'use strict'

module.exports = function(cuk) {
  const { _, helper, globby, path, fs, config } = cuk.pkg.core.lib

  const globl = {
    helper: helper,
    config: config,
    _: cuk.pkg.core.lib._,
    ternary: (cond, a, b) => {
      return cond ? a : b
    }
  }

  const action = opt => {
    let pkgId = opt.pkg.id
    const name = pkgId + _.upperFirst(_.camelCase(opt.key))
    globl[name] = require(opt.file)(cuk)
  }

  helper('core:trace')('|  |- Loading globals...')
  helper('core:bootFlat')({
    pkgId: 'view',
    name: 'global',
    action: action,
    createAppDir: true,
    createContainer: false
  })
  _.forOwn(globl, (v, name) => {
    const disabled = _.get(cuk.pkg.view, 'cfg.common.disabled.global', [])
    if (disabled.indexOf(name) > -1) {
      helper('core:trace')('|  |  |- Disabled => %s', name)
      delete globl[name]
      return
    }
    helper('core:trace')('|  |  |- Enabled => %s', name)
  })
  return globl
}