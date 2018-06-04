'use strict'

module.exports = function(cuk) {
  const pkgId = 'view',
    pkg = cuk.pkg[pkgId]
  const { _, helper, fs, path } = cuk.lib
  const nunjucks = require('nunjucks')

  return nunjucks.Loader.extend({
    init: function(searchPaths, options) {
      options = options || {}
      this.pathsToNames = {}
      this.noCache = !!options.noCache

      if (searchPaths) {
        searchPaths = _.isArray(searchPaths) ? searchPaths : [searchPaths]
        this.searchPaths = searchPaths.map(path.normalize)
      } else {
        this.searchPaths = ['.']
      }

      if (options.watch) {
        let chokidar = require('chokidar')
        let paths = this.searchPaths.filter((p) => {
          return fs.existsSync(p)
        })
        let watcher = chokidar.watch(paths)
        watcher.on('all', (event, fullname) => {
          fullname = path.resolve(fullname)
          if (event === 'change' && fullname in this.pathsToNames) {
            this.emit('update', this.pathsToNames[fullname])
          }
        })
        watcher.on('error', (error) => {
          pkg.trace('Watcher » %s', error)
        })
      }
    },

    getSource: function(name) {
      let fullpath = null
      let paths = _.map(this.searchPaths, _.clone)


      name = helper('view:resolveTpl')(name)
      // todo: skin handling
      if (path.isAbsolute(name))
        fullpath = name
      else
        _.each(paths, (_p, i) => {
          let basePath = path.resolve(_p)
          let p = path.resolve(paths[i], name)

          // Only allow the current directory and anything
          // underneath it to be searched

          if (p.indexOf(basePath) === 0) {
            if (this.i18n) {
              let pLocalized = p.replace('.html', '.' + this.i18n.getLocale() + '.html')
              if (fs.existsSync(pLocalized)) {
                fullpath = pLocalized
              } else if (fs.existsSync(p)) {
                fullpath = p
              }
            } else if (fs.existsSync(p)) {
              fullpath = p
            }
          }
        })

      if(!fullpath) {
        return null
      }

      this.pathsToNames[fullpath] = name

      return {
        src: fs.readFileSync(fullpath, 'utf-8'),
        path: fullpath,
        noCache: this.noCache
      }
    }
  })
}
