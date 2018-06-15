'use strict'

const nunjucks = require('nunjucks')
const util = require('util')

module.exports = function(cuk) {
  const TemplateLoader = require('./load_template')(cuk)
  const pkgId = 'view'
  const pkg = cuk.pkg[pkgId]
  const { _, helper, path, fs } = cuk.lib

  const resolver = (view, routeName) => {
    if (!routeName) return 'view:/not_found'
    const routeNames = routeName.split(':')
    let views = view.split(':')
    if (routeNames.length !== 3) throw helper('core:makeError')('Invalid route')
    if (views.length === 0) throw helper('core:makeError')('Template path empty')
    if (views.length === 1) {
      views.push(views[0])
      views[0] = routeNames[1]
    }
    if (views[1].substr(0, 1) !== '/') views[1] = '/' + views[1]
    return views.join(':')
  }

  return (options) => {
    let dirs = []
    helper('core:bootTrace')('%A Loading template folders...', null)
    _.each(helper('core:pkgs')(p => {
      return p.tag.indexOf('skin') === -1 && ['app'].indexOf(p.id) === -1
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
      ctx.render = async (view, context) => {
        try {
          context = helper('core:merge')(ctx.state, context)
          view = resolver(view, ctx._matchedRouteName) + options.ext
          const body = await env.render(view, context)
          ctx.type = ctx.type || 'text/html'
          ctx.body = body
          return
        } catch (e) {
          pkg.trace('Render error: %', e.message)
        }
      }
      ctx.renderString = async (string, context) => {
        try {
          context = helper('core:merge')(ctx.state, context)
          return await env.renderString(string, context)
        } catch (e) {
          pkg.trace('Render string error: %', e.message)
        }
      }
      await next()
    }
  }
}