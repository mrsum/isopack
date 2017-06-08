
const cluster = require('cluster')
const ManifestPlugin = require('webpack-assets-manifest')
const ExtractTextPlugin = require("extract-text-webpack-plugin")

let webpack = require('webpack')

// add new plugins
webpack.ManifestPlugin = ManifestPlugin
webpack.ExtractTextPlugin = ExtractTextPlugin

/**
 * @param  {[type]} events [description]
 * @param  {[type]} config [description]
 * @return {[type]}        [description]
 */
module.exports = (events, config) => {
  // check cluster
  if (cluster.isMaster) {
    const { server, client } = config

    if (client) {
      require('./compilers/client')({
        webpack,
        events,
        config
      })
    }

    if (server) {
      require('./compilers/server')({
        webpack,
        events,
        config
      })
    }

  } else {
    require('./handlers/worker')()
  }
}
