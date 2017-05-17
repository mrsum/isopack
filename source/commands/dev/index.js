// Depends
const webpack = require('webpack')
const cluster = require('cluster')

const Compilers = {
  server: require('./compilers/server'),
  client: require('./compilers/client')
}

const helpers = require('./helpers/commands')

/**
 * Params
 * @param  {Object} params [description]
 * @return {[type]}        [description]
 */
module.exports = (params = {}, interfaces = {}) => {
  if (cluster.isMaster) {

    const { debug } = interfaces;
    const { config, path, env } = params; 
    
    if (config[env]) {

      const globalConfig = Object.assign(
        { env, path },
        config.global, 
        config[env] || {}
      );

      // set and parse aliases
      Object.keys(globalConfig.alias || {}).forEach(key => {
        globalConfig.alias[key] = `${path}/${globalConfig.alias[key]}`
      })

      helpers(params, interfaces)

      if (globalConfig.server && globalConfig.server.webpack) {

        Compilers.server(
          require(`${path}/${globalConfig.server.webpack}`)(
            webpack, globalConfig
          ),
          params,
          interfaces
        )

      }

      // if (globalConfig.client && globalConfig.client.webpack) {
      //   Compilers.client(
      //     require(`${path}/${globalConfig.client.webpack}`)(
      //       webpack, globalConfig
      //     ),
      //     params,
      //     interfaces
      //   )
      // }

    }

  } else require('./handlers/worker')(params, interfaces)
  
}
