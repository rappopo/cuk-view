'use strict'

module.exports = function (cuk, nunjucks, env) {
  const { _, helper } = cuk.pkg.core.lib

  const action = opt => {
    const disabled = _.get(cuk.pkg.view, 'cfg.disabled.component', [])
    const name = `${opt.pkg.id}:${opt.key}`
    if (disabled.indexOf(name) > -1) {
      helper('core:trace')('|  |  |- Disabled => %s', name)
      return
    }
    const names = _.snakeCase(opt.key).split('_')
    const skin = _.first(names)
    const newName = _.camelCase(_.drop(names).join('_'))

    _.set(opt.pkg, `cuks.view.component.${skin}.${newName}`, opt.file)
    helper('core:trace')('|  |  |- Enabled => %s', name)
  }

  helper('core:trace')('|  |- Loading component...')
  helper('core:bootDeep')({ pkgId: 'view', name: 'component', action: action, ext: '.js, .njk' })
}
