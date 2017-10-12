const fs = require('fs')
const childProcess = require('child_process')

/**
 * @param  {object} events
 * @param  {object} config
 * @return {void}
 */
module.exports = (events, config) => {

  const { server, client, path, environments, env} = config

  if (server) {
    // create child process for webpack server compiler
    const serverCompiller = childProcess.fork(
      __dirname + '/compilers/server',
      [],
      {}
    )

    // send config to worker
    serverCompiller.send(config);

    // listen messages
    serverCompiller.on('message', message => events.emit(message.type, message))
  }

  if (client) {
    const clientCompiller = childProcess.fork(
      __dirname + '/compilers/client',
      [],
      {}
    )

    // send config to worker
    clientCompiller.send(config);

    // listen messages
    clientCompiller.on('message', message => events.emit(message.type, message))
  }

}
