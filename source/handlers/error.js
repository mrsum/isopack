// Depends
const colors = require('colors')
const stream = process.stdout

/**
 * System message handler
 * @param  {[type]} events [description]
 * @return {[type]}        [description]
 */
module.exports = events => events.on('error', error => {

  const { note, side } = error

  stream.write('\n')
  stream.write(colors.red(`[${side.toUpperCase()}]:`) + note)
  stream.write('\n')
})
