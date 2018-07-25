'use string'

module.exports = function(cuk) {
  const { _, helper } = cuk.pkg.core.lib
  const pkg = cuk.pkg.view

  return (ctx, env) => {
    return async (view, context) => {
      try {
        _.each(['state', 'session'], v => {
          if (_.get(pkg, 'cfg.common.contextMerge.' + v))
            context = helper('core:merge')(ctx[v], context)
        })
        view = helper('view:resolveRoute')(view, ctx) + '.njk'
        const body = await env.render(view, context)
        ctx.type = ctx.type || 'text/html'
        ctx.body = body
        return
      } catch (e) {
        pkg.trace('Render error: %s', e.message)
      }
    }
  }
}