const webpack = require('webpack')
const ProgressPlugin = require('webpack/lib/ProgressPlugin')
const ManifestPlugin = require('webpack-assets-manifest')
const ExtractTextPlugin = require('extract-text-webpack-plugin')

webpack.ManifestPlugin = ManifestPlugin
webpack.ExtractTextPlugin = ExtractTextPlugin

const compiler = config => {

  // get config
  const { environments, output, server, path, env } = config
  const webpackConfig = require(`${path}/${server.webpack}`)(
    webpack,
    config
  )

  const compiler = webpack(webpackConfig)

  compiler.apply(
    new ProgressPlugin((percentage, msg) =>
      process.send(
        {
          side: 'server',
          type: 'progress',
          percentage,
          msg
        }
      )
    )
  )

  compiler.watch({ poll: true }, (err, statistic) => {
    // get info from statistic
    const { errors, warnings, hash, time, assets } = statistic.toJson()

    // define stacktrice error array
    let stacktrace = []

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
        side: 'server',
        type: 'error',
        message: stacktrace[0]
      })
    }
  })

  compiler.plugin('done', function(compilation) {
    const { assets } = compilation.toJson();
    const filename = `${webpackConfig.output.path}/${assets[0].name}`;
    process.send({
      side: 'server',
      type: 'done',
      filename: filename,
      config: config,
    })
  })

}


// Execute compiller on message recived
process.on('message', config => compiler(config));
