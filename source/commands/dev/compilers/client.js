
const DevServer = require('webpack-dev-server');
const ProgressPlugin = require('webpack/lib/ProgressPlugin')

/**
 * Client compiller
 * @param  {[type]} options.webpack [description]
 * @param  {[type]} options.events  [description]
 * @param  {[type]} options.config  [description]
 * @return {[type]}                 [description]
 */
module.exports = ({ webpack, config }) => {
  // 
  const { environments, output, client, path, env } = config

  // get webpack config
  const webpackConfig = require(`${path}/${client.webpack}`)(
    webpack,
    config
  )

  const compiler = webpack(webpackConfig);

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

  // create new dev server
  let server = new DevServer(compiler, {
    contentBase: webpackConfig.output.publicPath || path,
    inline: true,
    quiet: true,
    hot: false,
    headers: {
      'Access-Control-Allow-Origin': '*'
    }
  })

  compiler.plugin('done', statistic => {

    // get info from statistic
    const { errors, warnings, hash, time, assets } = statistic.toJson()

    // define stacktrice error array
    let stacktrace = []

    // check errors
    if (statistic.hasErrors()) {
      stacktrace.push(
        errors.map(error => error)
      )
    }

    // check warnings
    if (statistic.hasWarnings()) {
      stacktrace.push(
        warnings.map(warning => warning)
      )
    }

    // if stacktrace isn't empty show errors
    if (stacktrace.length > 0) {
      return process.send({
        side: 'client',
        type: 'error',
        note: stacktrace[0]
      })
    }

    process.send({
      side: 'client',
      type: 'status',
      msg: assets.map(asset => asset.name).join('\n')
    })

  })

  server.listen(environments.CLIENT_PORT || 8090, 'localhost');
}
