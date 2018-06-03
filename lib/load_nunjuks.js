'use strict'

const nunjucks = require('nunjucks')
const util = require('util')

module.exports = function(cuk) {
  const pkgId = 'view'
  const pkg = cuk.pkg[pkgId]
  const { _, helper } = cuk.lib

  return (options) => {
    const env = nunjucks.configure(options.views, options.opts)
    env.render = util.promisify(env.render)
    env.renderString = util.promisify(env.renderString)
    _.each(['filter', 'global', 'extension'], item => {
      _.forOwn(options[item], (v, k) => {
        env[`add${_.upperFirst(item)}`](k, v)
      })
    })
    pkg.lib.nunjucksEnv = env
    pkg.trace('Environment » loaded')

    return async (ctx, next) => {
      ctx.render = async (view, context) => {
        try {
          context = helper('core:merge')(ctx.state, context)
          view += settings.ext
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