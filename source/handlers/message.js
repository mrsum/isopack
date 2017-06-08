// Depends
const util = require('util')
const colors = require('colors')
const stream = process.stdout.isTTY

const schema = {
  log: 'yellow',
  dir: 'yellow',
  warn: 'cyan',
  error: 'red',
}

const pad = s => (s < 10) 
  ? '0' + s
  : s;

const loggerColors = {
  info: 'yellow',
  error: 'red',
  warn: 'magenta'
}

const now = date => {
  return `${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`
}

/**
 * System message handler
 * @param  {[type]} events [description]
 * @return {[type]}        [description]
 */
module.exports = events => events.on('message', ({ type, data }) => {
  let template = []

  switch (typeof data) {

    case 'string': 
      template.push(data)
    break

    case 'object':
      Object.keys(data).map(item => {
        let body = util.inspect(
          data[item], { showHidden: true, depth: 10, colors: true }
        )

        template.push(`    #${item} > ${body}`)
      })
    break

    default: 
      template = `    #ERROR > Can't parsing argument`
  }

  if (stream.isTTY) {
    stream.cursorTo(0)
    stream.clearLine(0)
    stream.clearLine(1)
    stream.clearLine(2)
  }

  process.stdout.write(colors[schema[type]](`  [${type.toUpperCase()}]: \n`))
  process.stdout.write(template.join('\n'))
})
