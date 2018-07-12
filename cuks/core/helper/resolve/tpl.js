'use strict'

module.exports = function(cuk) {
  const { _, helper, path } = cuk.pkg.core.lib

  return name => {
    if (name.indexOf(':') > -1) {
      let names = name.split(':')
      if (names[1].substr(0, 1) !== '/')
        names[1] = '/' + names[1]
      let pkg = helper('core:pkg')(names[0])
      if (names.length === 3)
        name = path.join(pkg.dir, 'cuks', 'view', 'template', names[2], names[1])
      else
        name = path.join(pkg.dir, 'cuks', 'view', 'template', names[1])
    }
    return name
  }
}