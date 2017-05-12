const util = require('util');
const colors = require('colors')

const inspect = msg => {

  let message;

  switch (typeof msg) {

    case 'string':
      message = msg
    break

    default:
      message = util.inspect(msg, {
        depth: 5,
        showHidden: true,
        colors: true
      })
  }

  return message
}

module.exports = {

  log: msg => process.stdout.write(
    colors.green(
      `\nISOPACK.log: \n${inspect(msg)}`
    )
  ),

  error: msg => process.stderr.write(
    colors.red(
      `\nISOPACK.error: \n${inspect(msg)}`
    )
  )

}
