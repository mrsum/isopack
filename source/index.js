// Commands
const dev = require('./commands/dev')
const build = require('./commands/build')

// 
const interfaces = {
  debug: require('./utils/debug'),
  worker: require('./utils/worker')
}

/**
 * @param  {[type]} params [description]
 * @return {[type]}        [description]
 */
module.exports = params => {
  const { args } = params;

  switch(args[ args.length - 1 ]) {

    case 'dev':
      dev(
        Object.assign({}, { env: 'development' }, params),
        interfaces
      )
    break

    case 'build':
      build(
        Object.assign({}, { env: 'production' }, params),
        interfaces
      )
    break

    default:
      interfaces.debug.log('error', {
        message: `No any task for ${args[ args.length - 1 ]} command`
      })
  }
}
