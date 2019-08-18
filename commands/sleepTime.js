const yargs = require('yargs')

class WrongFormatError extends Error {}

module.exports = {
  name: 'bedtime',
  description: 'Set preferable bed time',
  execute(message, args) {
    const argsString = args.join(' ')

    let timePeriod
    try {
      timePeriod = recognizeTimePeriod(argsString)
      saveSleepTime(message.author, timePeriod)
      message.channel.send('Sleep time set');
    } catch (e) {
      if (e instanceof WrongFormatError) {
        message.channel.send(
          `I can\'t understand this format: ${e.message}. Pls use formats like 23 - 6:30 or 11pm - 6:30am`
        )
      } else {
        message.channel.send('Can\'t save your sleep time ¯\\_(ツ)_/¯ ');
      }
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
    throw new WrongFormatError('Start or end sleeping time aren\'t specified')
  }

  return {
    start: transformTo24hFormat(rawStartTime, partOfDayStart),
    end: transformTo24hFormat(rawEndTime, partOfDayEnd)
  }
}

function transformTo24hFormat(timeString, partOfDay) {
  const timeParsingRegexp = /(\d{1,2}):?(\d{1,2})?/i
  const [all, hours, minutes] = timeString.match(timeParsingRegexp)

  if (hours === undefined)
    throw new WrongFormatError('hours specified in wrong format')

  if (parseInt(hours, 10) > 24)
    throw new WrongFormatError('there is only 24 hours on a day on Earth. Where are you from? O_o')

  if (minutes !== undefined && parseInt(minutes, 10) > 59)
    throw new WrongFormatError('there is only 60 minutes in hour')

  let time = ''
  if (parseInt(hours, 10) === 12 && partOfDay === 'am') {
    time += '00'
  } else if (parseInt(hours, 10) >= 12 || partOfDay === undefined || partOfDay === 'am') {
    time += hours
  } else {
    time += parseInt(hours, 10) + 12
  }

  time += ':'
  if (minutes !== undefined) {
    time += minutes
  } else {
    time += '00'
  }




  return time
}

function saveSleepTime(user, timePeriod) {
  // save stub
  console.log(`I'll save this sleep time. ${timePeriod.start} - ${timePeriod.end} for ${user.username}`);
}