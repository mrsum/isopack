// Depends
const vm = require('vm')

// Types
const consoleTypes = [
  'log', 'dir', 'warn',
  'info', 'error', 'trace'
]

const errorTypes = [
  'exit', 'error', 'warning',
  'unhandledRejection', 'rejectionHandled', 'uncaughtException'
]

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

  var console = {}

  // override console context
  consoleTypes
    .map(type =>
      console[type] = sendMessage.bind({ type })
    )

  // error handling subscribe
  errorTypes
    .forEach(type => {
      process.on(type, data => {
        sendMessage.bind({ type: 'error' })(data)
      })
    })

  // get message with source code
  process.on('message', ({ file, code }) => {
    try {
      // prepare new script context for execution
      let script = new vm.Script(code, {
        timeout: 0,
        filename: file,
        lineOffset: 5,
        columnOffset: 5,
        displayErrors: true
      });
      
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
      console.error(err.message, err.stack)
    }
  })
}
