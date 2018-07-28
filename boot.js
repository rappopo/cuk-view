'use strict'

module.exports = function(cuk){
  const pkgId = 'view'
  const { _, fs, path, helper, debug } = cuk.pkg.core.lib
  const { app } = cuk.pkg.http.lib
  const pkg = cuk.pkg[pkgId]
  const loadNunjucks = require('./lib/load_nunjuks')(cuk)

  const cuksDir = path.join(cuk.dir.app, 'cuks', pkgId),
    jsonFile = path.join(cuksDir, 'global.json')
  fs.ensureDirSync(path.join(cuksDir, 'template'))
  if (!fs.existsSync(jsonFile))
    try {
      fs.writeFileSync(jsonFile, '{}')
    } catch(e) {}

  return new Promise((resolve, reject) => {
    const glb = require('./lib/make_global')(cuk)
    const filter = require('./lib/make_filter')(cuk)
    const mw = loadNunjucks({
      opts: pkg.cfg.options,
      filter: filter,
      global: glb,
      extension: {}
    })
    app.use(mw)
    resolve(true)
  })

}