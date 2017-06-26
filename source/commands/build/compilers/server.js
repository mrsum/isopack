const util = require('util')
const MemoryFS = require('memory-fs')
const ProgressPlugin = require('webpack/lib/ProgressPlugin')

module.exports = ({ webpack, events, config }) => {
  
  const { environments, output, server, path, env } = config

  // get webpack config
  const webpackConfig = require(`${path}/${server.webpack}`)(
    webpack,
    config
  )

  let compiler = webpack(webpackConfig)

  // apply progress plugin
  compiler.apply(
    new ProgressPlugin(
      (percentage, msg) => events.emit('progress', {
        percentage, msg, type: 'server'
      })
    )
  )

  compiler.run((err, stat) => {

    const { errors, warnings, hash, time, assets } = stat.toJson()

    if (err) {
      process.stdout.write(
        util.inspect(err, { showHidden: true, depth: 10, colors: true })
      )
    }

    const files = assets.map(asset => `${asset.name} (${asset.size})`)

    events.emit('status', {
      type: 'server',
      msg: files.join('\n')
    })

  })
}
