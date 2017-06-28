// Depends
const cluster = require('cluster')
const createWorker = require('../commands/dev/process/create')

let workers = { main: false, temp: false }

module.exports = events => events.on('build', ({ side, file, code, config }) => {

  switch(side) {
    case 'server':

      if (workers.temp) {
        workers.main.kill('SIGTERM')
        workers.main.disconnect()
        workers.main = false
        workers.main = workers.temp
      }

      createWorker(events, config || {})
        .then(worker => {
          workers.main = worker
          worker.send({ code, file}, () => {
            createWorker(events, config || {})
              .then(worker => workers.temp = worker)
          })
        })
    break
  }

})
