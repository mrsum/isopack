

const DevServer = require('webpack-dev-server');
const ProgressPlugin = require('webpack/lib/ProgressPlugin')

/**
 * Client compiller
 * @param  {[type]} options.webpack [description]
 * @param  {[type]} options.events  [description]
 * @param  {[type]} options.config  [description]
 * @return {[type]}                 [description]
 */
module.exports = ({ webpack, events, config }) => {
  // 
  const { environments, output, client, path, env } = config

  // get webpack config
  const webpackConfig = require(`${path}/${client.webpack}`)(
    webpack,
    config
  )

  // create compiler
  const compiler = webpack(webpackConfig);

  // apply progress plugin
  compiler.apply(
    new ProgressPlugin(
      (percentage, msg) => events.emit('progress', {
        percentage, msg, type: '[CLIENT]:'
      })
    )
  )

  // create new dev server
  let server = new DevServer(compiler, {
    contentBase: '/',
    inline: true,
    quiet: true
  })

  compiler.plugin('done', stats => {
    let statistic = stats.toJson()

    // console.log(statistic)

    // console.log(statistic)
  })

  server.listen('8090', 'localhost');
}
