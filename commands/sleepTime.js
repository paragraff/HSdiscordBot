const yargs = require('yargs')

module.exports = {
  name: 'bedtime',
  description: 'Set preferable bed time',
  execute(message, args) {
    const argsString = args.join(' ')

    let timePeriod
    try {
      timePeriod = recognizeTimePeriod(argsString)
    } catch (e) {
      message.channel.send(
        `I can\'t understand this format: ${e.message}. Pls use formats like 23 - 6:30 or 11pm - 6:30am`
      )
    }

    try {
      saveSleepTime(message.user, timePeriod)
      message.channel.send('Sleep time set');
    } catch (e) {
      message.channel.send('Can\'t save your sleep time');
    }

    // check is timezone set
    /*if (getTimezone(message.user) === undefined) {
      message.channel.send('FIY you did not set up your timezone. Rick could be confused when you are sleeping.')
    }*/


  }
};

function recognizeTimePeriod(periodString) {
  const argsTimeParsingRegexp = /(\d{1,2}(?::\d{1,2})?)\s?([ap]m)?\s?-\s?(\d{1,2}(?::\d{1,2})?)\s?([ap]m)?/i
  const [
    match,
    rawStartTime,
    partOfDayStart,
    rawEndTime,
    partOfDayEnd
  ] = periodString.match(argsTimeParsingRegexp)

  if (rawStartTime === undefined || rawEndTime === undefined) {
    throw new Error('Start or end sleeping time aren\'t specified')
  }

  return {
    startTime: transformTo24hFormat(rawStartTime, partOfDayStart),
    endTime: transformTo24hFormat(rawEndTime, partOfDayEnd)
  }
}

function transformTo24hFormat(time, partOfDay) {
  const timeParsingRegexp = /(\d{1,2}):?(\d{1,2})?/i
  return time
}

function saveSleepTime(user, timePeriod) {
  // save stub
}