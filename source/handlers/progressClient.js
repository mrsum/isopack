
module.exports = events => events.on('client.progress', message => {
  console.log(message, 'client.progress')
})
