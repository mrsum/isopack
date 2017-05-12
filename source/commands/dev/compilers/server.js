const util          = require('util')
const colors        = require('colors')
const cluster       = require('cluster')
const webpack       = require('webpack')
const MemoryFS      = require('memory-fs')

/**
 * @param  {[type]} config [description]
 * @return {[type]}        [description]
 */
module.exports = (config, params, interfaces) => {

  // get helpers interfaces
  const { debug, worker } = interfaces

  // create memory fs instance
  let mfs = new MemoryFS()
  let compiler = webpack(config)

  let workers = {
    main: false,  // current working process
    temp: false   // temporary process
  };

  workers.main = worker(params || {}, () => {
    debug.log(`Stated`)
  })

  // change filesystem to memory-fs
  compiler.outputFileSystem = mfs

  // run compiler in watch mode
  compiler.watch({ poll: true }, (err, statistic) => {
    const { errors, warnings, hash, time, assets } = statistic.toJson()

    let stacktrace = []

    debug.log(
      `Build ${colors.green(hash)} done ${colors.green(time / 1000)}(sec)`
    )
  
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
        process.stderr.write(colors.red(note) + '\n')
      })
    }

    assets.map(asset => {
      if (mfs.statSync(`${config.output.path}/${asset.name}`).isFile()) {

        let sourceCode = statistic.compilation.assets[asset.name].source()

        if (workers.temp) {
          debug.log(
            `kill worker PID# ${workers.main.id}`
          )
          workers.main.kill('SIGTERM');
          workers.main.disconnect();
          workers.main = false;
          workers.main = workers.temp;
        }

        if (workers.main && workers.main.isConnected()) {
          // send source code to main worker
          workers.main.send({ name: asset.name, sourceCode }, () => {

            // and create temporary worker 
            workers.temp = worker(params || {}, () => {
              console.log(1122)
            });

          });
        }
      }
    })

  })
}
