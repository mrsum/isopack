
const webpack   = require('webpack')
const cluster   = require('cluster')

const Compilers = {
  server: require('./compilers/server'),
  client: require('./compilers/client')
}

/**
 * Params
 * @param  {Object} params [description]
 * @return {[type]}        [description]
 */
module.exports = (params = {}, interfaces = {}) => {
  if (cluster.isMaster) {
    const { config, path, env } = params; 

    if (config[env]) {

      const globalConfig = Object.assign(
        { env, path },
        config.global, 
        config[env] || {}
      );

      if (globalConfig.server && globalConfig.server.webpack) {

        Compilers.server(
          require(`${path}/${globalConfig.server.webpack}`)(
            webpack, globalConfig
          ),
          params,
          interfaces
        )

      }

    }

  } else require('./handlers/worker')(params, interfaces)
  
}
