'use strict'

module.exports = function(cuk) {
  const { _, helper, globby, path, fs } = cuk.pkg.core.lib
  const filter = {}

  const action = opt => {
    const disabled = _.get(cuk.pkg.view, 'cfg.common.disabled.filter', [])
    let pkgId = opt.pkg.id
    if (pkgId === 'app') pkgId = ''
    const name = _.camelCase(`${pkgId}:${opt.key}`)
    if (disabled.indexOf(name) > -1) {
      helper('core:trace')('|  |  |- Disabled => %s', name)
      return
    }
    filter[name] = require(opt.file)(cuk)
    helper('core:trace')('|  |  |- Enabled => %s', name)
  }

  helper('core:trace')('|  |- Loading filters...')
  helper('core:bootDeep')({ pkgId: 'view', name: 'filter', action: action, createContainer: false })
  return filter
}