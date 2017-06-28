// Depends
const colors = require('colors')
const stream = process.stdout

// Schema
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
module.exports = events => events.on('status', ({ side, msg }) => {
  stream.cursorTo(0)
  stream.clearLine(0)
  stream.write(`${colors.green('[' + side.toUpperCase() + ']:')} \n${msg}\n`)
})
