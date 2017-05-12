
const webpack   = require('webpack')
const cluster   = require('cluster')

const Compilers = {
  server: require('./compilers/server'),
  client: require('./compilers/client')
}

/**
 * Params
 * @param  {Object} params [description]
 * @return {[type]}        [description]
 */
module.exports = (params = {}, interfaces = {}) => {
  if (cluster.isMaster) {
    const { config, path, env } = params; 

    if (config[env]) {

      const globalConfig = Object.assign(
        { env, path },
        config.global, 
        config[env] || {}
      );

      if (globalConfig.server && globalConfig.server.webpack) {

        Compilers.server(
          require(`${path}/${globalConfig.server.webpack}`)(
            webpack, globalConfig
          ),
          params,
          interfaces
        )

      }

    }

  } else {

    let sendMessage = function() {
      let message = {
        type: this.type ? this.type : 'log',
        data: arguments
      };

      if (process.connected) {
        process.send(message);
      }
    };

    // error handling subscribe
    ['exit', 'error', 'warning', 'unhandledRejection', 'rejectionHandled', 'uncaughtException']
      .forEach(type => {
        process.on(type, data => {
          sendMessage.bind({ type: 'error' })(data);
        });
      });


    process.on('message', function({ name, sourceCode }) {

      try {
        // depends
        let vm = require('vm');
        let console = {};
        let logger = {};

        // prepare new script context for execution
        let script = new vm.Script(sourceCode, {
          timeout: 300,
          filename: name,
          lineOffset: 1,
          columnOffset: 1,
          displayErrors: true
        });

        // override console context
        ['log', 'dir', 'warn', 'info', 'error']
          .forEach(type => {
            console[type] = sendMessage.bind({ type });
          });

        // override stdout functions
        process.stdout.write = sendMessage.bind({ type: 'log' });

        // override stderr functions
        process.stderr.write = sendMessage.bind({ type: 'error' });

        // Run source code into new context
        script.runInNewContext({
          module, console, global, require, logger,
          process, __dirname, __filename,
          setTimeout, setInterval, Error, Buffer
        });

      } catch (err) {
        console.log(err)
      }

    })



  }
  
}
