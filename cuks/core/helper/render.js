'use string'

module.exports = function(cuk) {
  const { helper } = cuk.pkg.core.lib
  const pkg = cuk.pkg.view

  return (ctx, env) => {
    return async (view, context) => {
      try {
        context = helper('core:merge')(ctx.state, context)
        view = helper('view:resolveRoute')(view, ctx._matchedRouteName) + '.html'
        const body = await env.render(view, context)
        ctx.type = ctx.type || 'text/html'
        ctx.body = body
        return
      } catch (e) {
        pkg.trace('Render error: %', e.message)
      }
    }
  }
}