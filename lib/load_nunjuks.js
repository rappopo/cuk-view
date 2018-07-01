'use strict'

const nunjucks = require('nunjucks')
const util = require('util')

module.exports = function(cuk) {
  const TemplateLoader = require('./load_template')(cuk)
  const pkgId = 'view'
  const pkg = cuk.pkg[pkgId]
  const { _, helper, path, fs } = cuk.lib

  return (options) => {
    let dirs = []
    helper('core:bootTrace')('%A Loading template folders...', null)
    _.each(helper('core:pkgs')(p => {
      return p.cfg.common.skinName && ['app'].indexOf(p.id) === -1
    }), p => {
      let dir = path.join(p.dir, 'cuks', 'view', 'template')
      if (fs.existsSync(dir)) {
        helper('core:bootTrace')('%B Enabled %K %s', null, null, helper('core:makeRelDir')(dir, null, 'ADIR:.'))
        dirs.push(dir)
      }
    })
    const appTpl = path.join(cuk.dir.app, 'cuks', 'view', 'template')
    dirs.unshift(appTpl)
    helper('core:bootTrace')('%B Enabled %K %s', null, null, helper('core:makeRelDir')(appTpl, null, 'ADIR:.'))

    const loader = new TemplateLoader(dirs, {
      noCache: true,
      watch: process.env.NODE_ENV !== 'production'
    })
    const env = new nunjucks.Environment(loader, options.opts)

    env.render = util.promisify(env.render)
    env.renderString = util.promisify(env.renderString)
    _.each(['filter', 'global', 'extension'], item => {
      _.forOwn(options[item], (v, k) => {
        env[`add${_.upperFirst(item)}`](k, v)
      })
    })
    pkg.lib.nunjucksEnv = env
    helper('core:bootTrace')('%A Loading environment...', null)

    return async (ctx, next) => {
      ctx.render = helper('view:render')(ctx, env)
      ctx.renderString = helper('view:renderString')(ctx, env)
      await next()
    }
  }
}