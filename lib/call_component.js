'use strict'

module.exports = function(cuk, nunjucks, env) {
  const { _, helper, path, fs } = cuk.pkg.core.lib

  return (ctx) => {
    const skin = ctx.state.site.skin
    return function(name, params) {
      const names = name.split(':')
      if (names.length === 1) names.unshift(skin)
      if (!cuk.pkg[names[0]]) return
      const objPath = `${[names[0]]}.cuks.view.component.${skin}.${names[1]}`
      let item = _.get(cuk.pkg, objPath)
      if (!item) return
      if (_.isString(item)) {
        if (path.extname(item) === '.js') {
          item = require(item)(cuk)
          _.set(cuk.pkg, objPath, item)
        } else {
          const content = fs.readFileSync(item, 'utf8')
          item = new nunjucks.Template(content, env)
          _.set(cuk.pkg, objPath, item)
        }
      }
      if (_.isFunction(item)) return item(params, ctx)
      const content = item.render({ params: params })
      return content
    }
  }
}