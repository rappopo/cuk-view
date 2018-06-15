'use strict'

module.exports = function(cuk) {
  const { _, helper, globby, path, fs } = cuk.lib
  const filter = {}

  const action = opt => {
    const disabled = _.get(cuk.pkg.view, 'cfg.common.disabled.filter', [])
    let pkgId = opt.pkg.id
    if (pkgId === 'app') pkgId = ''
    const name = _.camelCase(`${pkgId}:${opt.key}`)
    if (disabled.indexOf(name) > -1) {
      helper('core:bootTrace')('%B Disabled %K %s', null, null, name)
      return
    }
    filter[name] = opt.value
    helper('core:bootTrace')('%B Enabled %K %s', null, null, name)
  }

  helper('core:bootDeep')({ pkgId: 'view', name: 'filter', action: action, createContainer: false })
  return filter
}