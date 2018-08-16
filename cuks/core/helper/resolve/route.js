'use strict'

module.exports = function (cuk) {
  const { _, helper } = cuk.pkg.core.lib

  return (view, ctx) => {
    if (!ctx._matchedRouteName) return 'view:/not_found'
    let route = _.find(ctx.router.stack, { name: ctx._matchedRouteName })
    if (!route) throw helper('core:makeError')('Invalid route')
    let views = view.split(':')
    if (views.length === 0) throw helper('core:makeError')('Template path empty')
    if (views.length === 1) {
      views.unshift(ctx.router.pkgId)
    }
    if (views[1].substr(0, 1) !== '/') views[1] = '/' + views[1]
    return views.join(':')
  }
}