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

    if (server) {
      cluster
        .fork({ __name: 'webpack-server' })
        .on('message', message =>
          events.emit(message.type, message)
        )
    }

    if (client) {
      cluster
        .fork({ __name: 'webpack-client' })  
        .on('message', message =>
          events.emit(message.type, message)
        )
    }

  } else {

    switch(process.env.__name) {

      case 'webpack-client':
        require('./compilers/client')({ webpack, config })
      break

      case 'webpack-server':
        require('./compilers/server')({ webpack, config })
      break

    }
  }
}
