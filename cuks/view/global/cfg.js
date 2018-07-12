'use strict'

module.exports = function(cuk) {
  const { helper } = cuk.pkg.core.lib

  return pkgId => {
    const pkg = helper('core:pkg')(pkgId)
    return pkg.cfg
  }
}