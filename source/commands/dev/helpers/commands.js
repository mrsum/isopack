
/**
 * [description]
 * @param  {Object} params     [description]
 * @param  {Object} interfaces [description]
 * @return {[type]}            [description]
 */
module.exports = (params = {}, interfaces = {}) => {

  const { debug } = interfaces

  process.stdin.resume();
  process.stdin.setEncoding('utf8');
  process.stdin.on('data', command => {

    switch (command.split('\n')[0]) {
      case 'cpu':
        debug.log('info', { 'cpu usage': process.cpuUsage() })
      break

      case 'up':
        debug.log('info', { 'uptime': process.uptime() })
      break

      case 'info':
        debug.log('info', { 'uptime': process.uptime(), 'cpu usage': process.cpuUsage() })
      break

      case 'q':
        process.exit(0)
      break
    }
  });

  process.stdin.on('end', function() {
    // console.log(11)
    // processLine(lingeringLine);
  });

}
