// Depends
const colors = require('colors')
const ProgressPlugin = require('webpack/lib/ProgressPlugin')

module.exports = compiler => {
  let stream = process.stdout

  compiler.apply(new ProgressPlugin((percentage, msg) => {
    let percents = Math.round(percentage * 100, 10)
    if (stream.isTTY && percentage < 1) {
      stream.cursorTo(0)
      stream.write(`${colors.green('[SERVER]:')} ${msg} (${percents}%)`)
      stream.clearLine(1)
    } else if (percentage === 1) {
      stream.cursorTo(0)
      stream.clearLine(0)
    }
  }))
}
