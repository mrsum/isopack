// Depends
const colors = require('colors')

/**
 * System message handler
 * @param  {[type]} events [description]
 * @return {[type]}        [description]
 */
module.exports = events => events.on('error', error => {
  process.stdout.write(`\n${colors.red('[ERROR]:')} ${error}`)
})
