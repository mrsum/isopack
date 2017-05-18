
const MemoryFS = require('memory-fs')
const ProgressPlugin = require('webpack/lib/ProgressPlugin')
const createWorker = require('../process/create')

module.exports = ({ webpack, events, config }) => {
  
  const { environments, output, server, path, env } = config

  // get webpack config
  const webpackConfig = require(`${path}/${server.webpack}`)(
    webpack,
    config
  )

  let workers = {
    main: false,
    temp: false
  }

  let mfs = new MemoryFS()
  let compiler = webpack(webpackConfig)

  // change filesystem to memory-fs
  compiler.outputFileSystem = mfs

  // apply progress plugin
  compiler.apply(
    new ProgressPlugin(
      (percentage, msg) => events.emit('progress', {
        percentage, msg, type: '[SERVER]:'
      })
    )
  )

  // create main worker
  createWorker(events, config || {})
    .then( worker => workers.main = worker)

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
      return stacktrace.map(note => {
        events.emit('error', note)
      })
    }

    assets.map(asset => {
      if (mfs.statSync(`${webpackConfig.output.path}/${asset.name}`).isFile()) {
        let sourceCode = statistic.compilation.assets[asset.name].source()

        events.emit('status', {
          type: 'server',
          msg: `${asset.name}`
        })

        // process swap magic
        if (workers.temp) {
          workers.main.kill('SIGTERM')
          workers.main.disconnect()
          workers.main = false
          workers.main = workers.temp
        }

        if (workers.main && workers.main.isConnected()) {
          // send source code to main worker
          workers.main.send({ name: asset.name, sourceCode }, () => {
            // and create temporary worker after compiling
            createWorker(events, config || {})
              .then(worker => workers.temp = worker)
          })
        }
      }

    })
  })
}
