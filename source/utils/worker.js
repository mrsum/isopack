const debug = require('./debug')
const cluster = require('cluster')

/**
 * @param  {Object}   envs [description]
 * @param  {Function} cb   [description]
 * @return {[type]}        [description]
 */
module.exports = (params = {}, cb) => {
  const { path, env, config } = params

  let worker = cluster.fork(
    Object.assign(
      {}, 
      { NODE_ENV: env || {}, NODE_PATH: `${path}/node_modules` }, 
      config.development.environment || {}
    )
  ).on('online', cb)

  cluster.workers[worker.id].on('message', msg => {
    debug.log(msg.type, msg.data)
  })

  return worker
}
