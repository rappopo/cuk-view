'use string'

module.exports = function(cuk) {
  const { _, helper } = cuk.pkg.core.lib
  const pkg = cuk.pkg.view

  return (ctx, env) => {
    return async (text, context) => {
      try {
        let result = await env.renderString(text, context)
        return result
      } catch (e) {
        pkg.trace('Render string error: %s', e.message)
      }
    }
  }
}