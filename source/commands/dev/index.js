
const cluster = require('cluster')
const webpack = require('webpack')

module.exports = (events, config) => {
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
