'use strict'

module.exports = function(cuk) {
  const { _, helper, path, fs } = cuk.pkg.core.lib

  const resolveName = (names, pkg) => {
    let name
    if (names.length === 3)
      name = path.join(pkg.dir, 'cuks', 'view', 'template', names[2], names[1])
    else
      name = path.join(pkg.dir, 'cuks', 'view', 'template', names[1])
    const ext = path.extname(name)
    if (_.isEmpty(ext)) name += '.njk'
    return name
  }

  return name => {
    // Handle only view name that has ":", otherwise let the default resolver do the job
    if (name.indexOf(':') > -1) {
      let names = name.split(':')
      if (names[1].substr(0, 1) !== '/')
        names[1] = '/' + names[1]
      let pkg = helper('core:pkg')(names[0])
      name = resolveName(names, pkg)
      // View file doesn't exists? Let's assume that it belongs to the default view
      if (!fs.existsSync(name)) {
        name = resolveName(names, cuk.pkg.view)
      }
    }

    return name
  }
}