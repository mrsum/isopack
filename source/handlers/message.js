// Depends
const util = require('util')
const colors = require('colors')
const stream = process.stdout

const loggerColors = {
  info: 'yellow',
  error: 'red',
  warn: 'magenta'
}

const schema = {
  log: 'yellow',
  dir: 'yellow',
  info: 'yellow',
  warn: 'cyan',
  error: 'red',
}

/**
 * System message handler
 * @param  {[type]} events [description]
 * @return {[type]}        [description]
 */
module.exports = events => events.on('message', ({ type = 'log', data = []}) => {

  let template = []

  data.map(message => {
    switch(Object.prototype.toString.call(message)) {

      case '[object Array]':
      case '[object Number]':
      case '[object Boolean]':
        template.push(util.inspect(message) + ', ')
      break

      case '[object String]':
        template.push(message + ', ')
      break

      case '[object Object]':
        template.push(
          util.inspect(message, { showHidden: true, depth: 10, colors: true }) + ', '
        )
      break
      default:
        template.push('NOF' + ', ')

    }
  })

  stream.write('  ' + colors[schema[type]](`[${type.toUpperCase()}]: `))
  template.forEach((item, key) => stream.write(item))
  stream.write('\n')
})
