'use strict'

module.exports = function (cuk) {
  const { _, helper } = cuk.pkg.core.lib
  const filter = {
    split: (str, sep) => {
      return str.split(sep)
    },
    push: (arr, val) => {
      arr.push(val)
      return arr
    },
    indexOf: (arr, val) => {
      return arr.indexOf(val)
    }
  }

  const action = opt => {
    const disabled = _.get(cuk.pkg.view, 'cfg.disabled.filter', [])
    const name = _.camelCase(`${opt.pkg.id}:${opt.key}`)
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
