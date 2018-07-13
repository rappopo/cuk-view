'use strict'

const nunjucks = require('nunjucks')
const util = require('util')

module.exports = function(cuk) {
  const TemplateLoader = require('./load_template')(cuk)
  const pkgId = 'view'
  const pkg = cuk.pkg[pkgId]
  const { _, helper, path, fs } = cuk.pkg.core.lib

  return (options) => {
    let dirs = []
    helper('core:bootTrace')('|  |- Loading template folders...')
    _.each(helper('core:pkgs')(p => {
      return p.cfg.common.skinName && ['app'].indexOf(p.id) === -1
    }), p => {
      let dir = path.join(p.dir, 'cuks', 'view', 'template')
      if (fs.existsSync(dir)) {
        helper('core:bootTrace')('|  |  |- Enabled => %s', helper('core:makeRelDir')(dir, null, 'ADIR:.'))
        dirs.push(dir)
      }
    })
    const appTpl = path.join(cuk.dir.app, 'cuks', 'view', 'template')
    dirs.unshift(appTpl)
    helper('core:bootTrace')('|  |  |- Enabled => %s', helper('core:makeRelDir')(appTpl, null, 'ADIR:.'))

    const loader = new TemplateLoader(dirs, {
      noCache: true,
      watch: process.env.NODE_ENV !== 'production'
    })
    const env = new nunjucks.Environment(loader, options.opts)

    env.render = util.promisify(env.render)
    env.renderString = util.promisify(env.renderString)
    const extra = ['filter', 'global', 'extension']

    _.each(extra, item => {
      _.forOwn(options[item], (v, k) => {
        if (!v._hasCtx) env[`add${_.upperFirst(item)}`](k, v.handler)
      })
    })
    pkg.lib.nunjucksEnv = env
    helper('core:bootTrace')('|  |- Loading environment...')

    return async (ctx, next) => {
      _.each(extra, item => {
        _.forOwn(options[item], (v, k) => {
          if (v._hasCtx) env[`add${_.upperFirst(item)}`](k, v.handler(ctx))
        })
      })
      ctx.render = helper('view:render')(ctx, env)
      ctx.renderString = helper('view:renderString')(ctx, env)
      await next()
    }
  }
}