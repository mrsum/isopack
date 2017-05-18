const cluster = require('cluster')

/**
 * @param  {Object}   envs [description]
 * @param  {Function} cb   [description]
 * @return {[type]}        [description]
 */
module.exports = (events, { path, env, environments }) => {
  return new Promise((resolve, reject) => {

    const processEnvironments = Object.assign(
      {},
      { NODE_ENV: env || {}, NODE_PATH: `${path}/node_modules` }, 
      environments || {}
    )

    let worker = cluster
      .fork(processEnvironments)
      .on('online', () => resolve(worker))

    // find worker and subscribe handler
    cluster
      .workers[worker.id]
      .on('message', data => events.emit('message', data))

  })

}
