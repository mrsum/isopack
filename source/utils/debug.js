const util = require('util')
const colors = require('colors')
const { Logger, transports } = require('winston')

const pad = s => (s < 10) ? '0' + s : s;

const loggerColors = {
  info: 'yellow',
  error: 'red',
  warn: 'magenta'
}

module.exports = new Logger({
  transports: [
    new (transports.Console)({

      timestamp: () => {
        const date = new Date();
        return `${pad(date.getDate())}/${pad(date.getMonth()+1)}/${date.getFullYear()} ${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`
      },

      formatter: options => {
        let message = [colors[loggerColors[options.level]](`  [${options.level.toUpperCase()}] ${options.timestamp()}`)]

        // create human log
        if (options.meta && Object.keys(options.meta).length) {
          Object.keys(options.meta).forEach(item => {

            switch (typeof options.meta[item]) {
              case 'string': message.push(`    #${item} > ` + options.meta[item]); break;
              case 'function': message.push(`    #${item} > ` + options.meta[item].toString()); break;
              default:
                message.push(`    #${item} > ` + util.inspect(
                  options.meta[item], { showHidden: true, depth: 5, colors: true })
                )
            }
          })
        }
        return message.join('\n')
      }

    })
  ]

});
