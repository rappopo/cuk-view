'use strict'

module.exports = function(cuk) {
  const { _, helper, path } = cuk.lib

  return name => {
    if (name.indexOf(':') > -1) {
      let names = name.split(':')
      if (names[1].substr(0, 1) !== '/')
        names[1] = '/' + names[1]
      let pkg = helper('core:pkg')(names[0])
      name = path.join(pkg.dir, 'cuks', 'view', 'template', names[1])
    }
    return name
  }
}