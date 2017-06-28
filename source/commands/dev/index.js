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

  const { server, client } = config

  if (cluster.isMaster) {

    // if server part of config is isset
    if (server) {
      // create process for server webpack
      cluster
        .fork({ __name: 'webpack-server' })
        .on('message', message =>
          events.emit(message.type, message)
        )
    }

    // if server part of config is isset
    if (client) {
      // create process for client webpack
      cluster
        .fork({ __name: 'webpack-client' })  
        .on('message', message =>
          events.emit(message.type, message)
        )
    }

  } else {
    const { __name } = process.env
    switch(__name) {

      case 'webpack-client':
        require('./compilers/client')({ webpack, config })
      break

      case 'webpack-server':
        require('./compilers/server')({ webpack, config })
      break

      case 'server-worker':
        require('./handlers/worker')()
      break

    }
  }

}
