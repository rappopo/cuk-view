'use strict'

const nunjucks = require('nunjucks')
const util = require('util')

module.exports = function(cuk) {
  const { getParameterNames } = cuk.pkg.core.lib
  const TemplateLoader = require('./load_template')(cuk)
  const pkgId = 'view'
  const pkg = cuk.pkg[pkgId]
  const { _, helper, path, fs } = cuk.pkg.core.lib

  return (options) => {
    let dirs = []
    helper('core:trace')('|  |- Loading template folders...')
    _.each(helper('core:pkgs')(p => {
      return p.cfg.common.skinName && ['app'].indexOf(p.id) === -1
    }), p => {
      let dir = path.join(p.dir, 'cuks', 'view', 'template')
      if (fs.existsSync(dir)) {
        helper('core:trace')('|  |  |- Enabled => %s', helper('core:makeRelDir')(dir, null, 'ADIR:.'))
        dirs.push(dir)
      }
    })
    const appTpl = path.join(cuk.dir.app, 'cuks', 'view', 'template')
    dirs.unshift(appTpl)
    helper('core:trace')('|  |  |- Enabled => %s', helper('core:makeRelDir')(appTpl, null, 'ADIR:.'))

    const loader = new TemplateLoader(dirs, {
      noCache: true,
      watch: process.env.NODE_ENV !== 'production'
    })
    const env = new nunjucks.Environment(loader, options.opts)

    env.render = util.promisify(env.render)
    env.renderString = util.promisify(env.renderString)
    const extra = ['filter', 'global', 'extension']

    const hasCtx = fn => {
      if (!_.isFunction(fn)) return false
      let params = getParameterNames(fn)
      return params.length === 1 && params[0] === 'ctx'
    }

    _.each(extra, item => {
      _.forOwn(options[item], (v, k) => {
        if ((!_.isFunction(v)) || (!hasCtx(v))) {
          env[`add${_.upperFirst(item)}`](k, v)
        }
      })
    })
    pkg.lib.nunjucksEnv = env
    helper('core:trace')('|  |- Loading environment...')

    return async (ctx, next) => {
      _.each(extra, item => {
        _.forOwn(options[item], (v, k) => {
          if (hasCtx(v)) {
            env[`add${_.upperFirst(item)}`](k, v(ctx))
          }
        })
      })
      ctx.render = helper('view:render')(ctx, env)
      ctx.renderString = helper('view:renderString')(ctx, env)
      await next()
    }
  }
}