const childProcess = require('child_process')

let worker = null

module.exports = events => events.on('done', ({ side, filename, config }) => {
  const { path, env, environments } = config;

  switch(side) {
    case 'server':
      worker && worker.kill('SIGINT')
      worker = false

      worker = childProcess.execFile('node',
        [
          '--inspect',
          filename
        ],
        {
          env: Object.assign({
            BROWSER: false,
            NODE_ENV: env || {},
            NODE_PATH: `${path}/node_modules`
          }, process.env, environments),
        },
        (error, stdout, stderr) => {
          stderr && events.emit('error', { side: 'server', message: stderr });
          stdout && events.emit('message', { type: 'log', message: stdout });
        }
      )
      .on('error', error => events.emit('error', { side: 'server', message: error.stack }))
    break;
  }

})
