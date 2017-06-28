// Depends
const cluster = require('cluster')
const ProgressPlugin = require('webpack/lib/ProgressPlugin')
const createWorker = require('../process/create')
const MemoryFS = require('memory-fs')

module.exports = ({ webpack, config }) => {

  const { environments, output, server, path, env } = config

  // get webpack config
  const webpackConfig = require(`${path}/${server.webpack}`)(
    webpack,
    config
  )

  let compiler = webpack(webpackConfig)

  let fs = new MemoryFS()
  // change filesystem to memory-fs
  compiler.outputFileSystem = fs

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
        side: 'server',
        type: 'error',
        note: stacktrace[0]
      })
    }

    assets.map(asset => {

      const filename = `${webpackConfig.output.path}/${asset.name}`
      if (fs.statSync(filename).isFile()) {
        let code = statistic.compilation.assets[asset.name].source()
        process.send({
          side: 'server',
          type: 'build',
          file: filename,
          code,
          config
        })
      }
    })
  })
}
