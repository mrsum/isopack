// Depends
const colors = require('colors')

const schema = {
  info: 'yellow',
  warn: 'cyan',
  error: 'red'
}

/**
 * System message handler
 * @param  {[type]} events [description]
 * @return {[type]}        [description]
 */
module.exports = events => events.on('status', ({ type, msg }) => {
  process.stdout.write(`\n${colors.green('[' + type.toUpperCase() + ']:')} ${msg}\n`)
})
