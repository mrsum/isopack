
const EventEmmiter = require('events')
const Commands = {
  development: require('./commands/dev'),
  production: require('./commands/build'),
}

const eventHandlers = [
  require('./handlers/error'),
  require('./handlers/status'),
  require('./handlers/message'),
  require('./handlers/progress'),
]

module.exports = ({ config, version, args, path }) => {

  const { main, server, client } = config

  // prepare aliases paths
  Object.keys(main.alias).forEach(key => {
    main.alias[key] = `${path}/${main.alias[key]}`
  })

  // 
  const shortEnv = args[args.length -1] || 'build'

  // 
  const env = shortEnv === 'dev'
    ? 'development'
    : 'production'

  // 
  const optionsByEnv = Object.assign(
    { env, path },
    config[env] || {},
    main || {}
  )

  // 
  try {
    let events = new EventEmmiter()
    // register handlers
    eventHandlers.forEach(handler => handler(events))

    // start command
    Commands[env](events, optionsByEnv)

  } catch (err) {
    throw new Error(err)
  }
}
