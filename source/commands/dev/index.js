
const cluster = require('cluster')
const webpack = require('webpack')

/**
 * @param  {[type]} events [description]
 * @param  {[type]} config [description]
 * @return {[type]}        [description]
 */
module.exports = (events, config) => {
  // check cluster
  if (cluster.isMaster) {
    const { server, client } = config

    if (server) {
      require('./compilers/server')({
        webpack,
        events,
        config
      })
    }

    if (client) {
      require('./compilers/client')({
        webpack,
        events,
        config
      })
    }

  } else {
    require('./handlers/worker')()
  }
}
