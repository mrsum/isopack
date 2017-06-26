
/**
 * Send message to master process
 * @return {[type]} [description]
 */
let sendMessage = function (){
  if (process.connected) {
    process.send({
      type: this.type ? this.type : 'log',
      // will return as array
      data: Object.keys(arguments).map(item => arguments[item])
    });
  }
};

/**
 * Worker handler
 * @param  {[type]} params     [description]
 * @param  {[type]} interfaces [description]
 * @return {[type]}            [description]
 */
module.exports = () => {

  // error handling subscribe
  ['exit', 'error', 'warning', 'unhandledRejection', 'rejectionHandled', 'uncaughtException']
    .forEach(type => {
      process.on(type, data => {
        sendMessage.bind({ type: 'error' })(data)
      })
    })

  process.on('message', ({ name, sourceCode }) => {
    try {
      // depends
      let vm = require('vm');
      let console = {};

      // prepare new script context for execution
      let script = new vm.Script(sourceCode, {
        timeout: 200,
        filename: name,
        lineOffset: 5,
        columnOffset: 5,
        displayErrors: true
      });

      // override console context
      ['log', 'dir', 'warn', 'info', 'error']
        .forEach(type => console[type] = sendMessage.bind({ type }));

      // override stdout functions
      process.stdout.write = sendMessage.bind({ type: 'log' });

      // override stderr functions
      process.stderr.write = sendMessage.bind({ type: 'error' });

      // run source code into new context
      script.runInNewContext({
        __dirname, __filename,
        module, console, global, 
        require, process, 
        setTimeout, setInterval,
        Error, Buffer
      });

    } catch (err) {
      console.error(err)
    }

  })
}
