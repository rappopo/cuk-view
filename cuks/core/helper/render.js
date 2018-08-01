'use string'

module.exports = function(cuk) {
  const { _, helper } = cuk.pkg.core.lib
  const pkg = cuk.pkg.view
  const { app } = cuk.pkg.http.lib

  return (ctx, env) => {
    return async (view, context) => {
      try {
        view = helper('view:resolveRoute')(view, ctx) + '.njk'
        let body = await env.render(view, context)
        ctx.type = ctx.type || 'text/html'
        ctx.body = body
        return
      } catch (e) {
        pkg.trace('Render error: %s', e.message)
        let body = await env.render('view:/server_error')
        ctx.type = ctx.type || 'text/html'
        ctx.body = body
        app.emit('error', e, ctx)
      }
    }
  }
}