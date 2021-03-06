const util = require('util')
const MemoryFS = require('memory-fs')
const ProgressPlugin = require('webpack/lib/ProgressPlugin')

module.exports = ({ webpack, config }) => {
  
  const { environments, output, client, path, env } = config

  // get webpack config
  const webpackConfig = require(`${path}/${client.webpack}`)(
    webpack,
    config
  )

  // webpack compiler instance
  let compiler = webpack(webpackConfig)

  // apply progress plugin
  compiler.apply(
    new ProgressPlugin((percentage, msg) =>
      process.send(
        {
          side: 'client',
          type: 'progress',
          percentage,
          msg
        }
      )
    )
  )

  compiler.run((err, stat) => {

    const { errors, warnings, hash, time, assets } = stat.toJson()

    if (err) {
      process.stdout.write(
        util.inspect(err, { showHidden: true, depth: 10, colors: true })
      )
    }

    process.exit(0)
  })

}
