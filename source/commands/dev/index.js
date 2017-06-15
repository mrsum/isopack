// depends
const cluster = require('cluster')
const ManifestPlugin = require('webpack-assets-manifest')
const ExtractTextPlugin = require('extract-text-webpack-plugin')

// define webpack
let webpack = require('webpack')

// add new plugins
webpack.ManifestPlugin = ManifestPlugin
webpack.ExtractTextPlugin = ExtractTextPlugin

/**
 * @param  {object} events
 * @param  {object} config
 * @return {void}
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
