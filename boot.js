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
    helper('core:bootConfig')(pkgId, 'global')
    .then(result => {
      let glb = {}
      helper('core:bootTrace')('%A Loading globals...', null)
      _.forOwn(result, (v, k) => {
        if (_.isEmpty(v)) return
        let pid = k === 'app' ? '' : k,
          keys = []
        _.forOwn(v, (v1, k1) => {
          let name = _.camelCase(`${pid}:${k1}`)
          keys.push(name)
          glb[name] = v1
        })
        helper('core:bootTrace')('%k Enable %K %s', null, null, keys.join(', '))
      })
      const glbExt = require('./lib/make_global')(cuk)
      glb = helper('core:merge')(glb, glbExt)

      helper('core:bootTrace')('%A Loading filters...', null)
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
    .catch(reject)
  })

}