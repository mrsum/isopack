const webpack = require('webpack')
const DevServer = require('webpack-dev-server')
const ProgressPlugin = require('webpack/lib/ProgressPlugin')
const ManifestPlugin = require('webpack-assets-manifest')
const ExtractTextPlugin = require('extract-text-webpack-plugin')


webpack.ManifestPlugin = ManifestPlugin
webpack.ExtractTextPlugin = ExtractTextPlugin

const compiler = config => {

  const { environments, output, client, path, env } = config

  // get webpack config
  const webpackConfig = require(`${path}/${client.webpack}`)(
    webpack,
    config
  )

  const compiler = webpack(webpackConfig)

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
    // check errors
    if (statistic.hasErrors()) {
      errors.map(error => stacktrace.push(error))
    }

    // check warnings
    if (statistic.hasWarnings()) {
      warnings.map(warning => stacktrace.push(warning))
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

  server.listen(environments.CLIENT_PORT || 8090, 'localhost')

}

// Execute compiller on message recived
process.on('message', config => compiler(config))
