// Depends
const colors = require('colors')
const stream = process.stdout

/**
 * [description]
 * @param  {[type]} events [description]
 * @return {[type]}        [description]
 */
module.exports = events => events.on('progress', ({ percentage, msg, type }) => {
  let percents = Math.round(percentage * 100, 10)
  if (stream.isTTY && percentage < 1) {
    stream.cursorTo(0)
    stream.write(`${colors.green(type)} ${msg} (${percents}%)`)
    stream.clearLine(1)
  } else if (percentage === 1) {
    stream.cursorTo(0)
    stream.clearLine(0)
  }
})
