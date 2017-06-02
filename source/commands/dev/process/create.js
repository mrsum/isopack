// Depends
const cluster = require('cluster')

/**
 * @param  {Object}   envs [description]
 * @param  {Function} cb   [description]
 * @return {[type]}        [description]
 */
module.exports = (events, { path, env, environments }) => {
  return new Promise((resolve, reject) => {

    // merge ENV from .isopack.yml
    const processEnvironments = Object.assign(
      { BROWSER: false },
      { NODE_ENV: env || {}, NODE_PATH: `${path}/node_modules` }, 
      environments || {}
    )

    // create new one process
    let worker = cluster
      .fork(processEnvironments)
      .on('online', () => resolve(worker))

    // find worker and subscribe handler
    cluster
      .workers[worker.id]
      .on('message', data => events.emit('message', data))

  })

}
