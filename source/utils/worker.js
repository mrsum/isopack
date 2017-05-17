const debug = require('./debug')
const cluster = require('cluster')

/**
 * @param  {Object}   envs [description]
 * @param  {Function} cb   [description]
 * @return {[type]}        [description]
 */
module.exports = (params = {}) => {
  const { path, env, config } = params

  return new Promise((resolve, reject) => {
    let worker = cluster.fork(
      Object.assign(
        {}, 
        { NODE_ENV: env || {}, NODE_PATH: `${path}/node_modules` }, 
        config.development.environment || {}
      )
    ).on('online', () => resolve(worker))

    cluster.workers[worker.id].on('message', ({ type, data }) => {
      debug.log(type, data)
    })
  })
}
