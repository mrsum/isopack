const cluster = require('cluster')

/**
 * @param  {Object}   envs [description]
 * @param  {Function} cb   [description]
 * @return {[type]}        [description]
 */
module.exports = (params = {}, cb) => {
  const { path, env, config } = params


  // console.log(config.development.environment)
  let worker = cluster.fork(
    Object.assign({}, { NODE_ENV: env, NODE_PATH: `${path}/node_modules` }, config.development.environment || {})
  ).on('online', cb)

  cluster.workers[worker.id].on('message', msg => {
    console.log(msg)
  })

  return worker
}
