'use strict'

module.exports = function(cuk){
  const pkgId = 'view'
  const { _, fs, path, helper, debug } = cuk.lib
  const { app } = cuk.pkg.http.lib
  const pkg = cuk.pkg[pkgId]
  const loadNunjucks = require('./lib/load_nunjuks')(cuk)

  pkg.trace('Initializing...')
  const cuksDir = path.join(cuk.dir.root, 'cuks', pkgId),
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
      _.forOwn(result, (v, k) => {
        if (_.isEmpty(v)) return
        let pid = k === 'root' ? '' : k,
          keys = []
        _.forOwn(v, (v1, k1) => {
          let name = _.camelCase(`${pid}:${k1}`)
          keys.push(name)
          glb[name] = v1
        })
        pkg.trace('Global » %s', keys.join(', '))
      })
      const filter = require('./lib/make_filter')(cuk, pkg.trace)
      app.use(loadNunjucks({
        opts: pkg.cfg.options,
        filter: filter,
        global: global,
        extension: {},
        ext: '.html'
      }))
      resolve(true)
    })
    .catch(reject)
  })

}