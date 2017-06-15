// Depends
const colors = require('colors')
const stream = process.stdout

/**
 * System message handler
 * @param  {[type]} events [description]
 * @return {[type]}        [description]
 */
module.exports = events => events.on('error', error => {
  stream.write(`${colors.red('[ERROR]:')} ${error}`)
})
