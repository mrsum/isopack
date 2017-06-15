
const MemoryFS = require('memory-fs')
const ProgressPlugin = require('webpack/lib/ProgressPlugin')

module.exports = ({ webpack, events, config }) => {
  
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
    new ProgressPlugin(
      (percentage, msg) => events.emit('progress', {
        percentage, msg, type: 'client'
      })
    )
  )

  compiler.run((err, stat) => {

  })

}
