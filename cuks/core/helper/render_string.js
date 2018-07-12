'use string'

module.exports = function(cuk) {
  const { helper } = cuk.pkg.core.lib
  const pkg = cuk.pkg.view

  return (ctx, env) => {
    return async (view, context) => {
      try {
        context = helper('core:merge')(ctx.state, context)
        let result = await env.renderString(string, context)
        return result
      } catch (e) {
        pkg.trace('Render string error: %', e.message)
      }
    }
  }
}