// require the library 
const stream = process.stdout
const colors = require('colors')
const Multiprogress = require('multi-progress')
const multi = new Multiprogress(process.stdout)

// local variables
const bars = {}
const format = type => colors.green('['+type.toUpperCase()+']') + ': [:bar] :percent'

/**
 * @param  {[type]} name [description]
 * @param  {[type]} size [description]
 * @return {[type]}      [description]
 */
const createBar = (type, width = 40) => {

  const instance = multi.newBar(format(type), {
    complete: '=',
    incomplete: ' ',
    width: width,
    total: 100,
  })

  bars[type] = {
    instance: instance,
    value: 0,
  }
}

/**
 * @param  {[type]} events [description]
 * @return {[type]}        [description]
 */
module.exports = events => events.on('progress', ({ percentage, msg, type, side }) => {

  const percents = Math.round(percentage * 100, 10)

  // create new one bar
  if (percentage === 0 && !bars[side]) {
    createBar(side)
  }

  // if bar was created
  if(percentage === 0 && bars[side].instance) {
    bars[side].value = 0
    bars[side].instance.update(0)
  }

  // any cases
  if (bars[side]) {
    bars[side].instance.tick(percents - bars[side].value)
    bars[side].value = percents
  }

  // done
  if (percentage === 100) {
    bars[side].instance.terminate()
  }
})
