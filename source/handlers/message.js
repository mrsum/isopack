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
module.exports = events => events.on('message', ({ type, data }) => {
  let template = []

  switch (typeof data) {

    case 'string': 
      template.push(data)
    break

    case 'function': 
      template.push(data.toString())
    break

    case 'object':
      Object.keys(data).map(item => {
        let body = util.inspect(
          data[item], { showHidden: true, depth: 10, colors: true }
        )

        template.push(body + ', ')
      })
    break

    default: 
      template = `#ERROR > Can't parsing argument`
  }

  stream.write('  ' + colors[schema[type]](`[${type.toUpperCase()}]: `))
  template.forEach((item, key) => {
    stream.write(item)
  })
  
  stream.write('\n')
})
