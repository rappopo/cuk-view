'use strict'

module.exports = function(cuk) {
  const { helper } = cuk.pkg.core.lib

  return (view, routeName) => {
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
}