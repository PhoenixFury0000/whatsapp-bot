const {Module} = require('../lib/plugins');
const moment = require('moment-timezone');

Module({
  command: 'timezone',
  package: 'time',
  description: 'Get time info of a timezone'
})(async (message, match) => {
  if (!match) return message.send('usage: .timezone <continent/city>');
  if (!moment.tz.zone(match)) return message.send('(e.g. `Africa/Johannesburg`)');
  let time = moment.tz(match);
  let txt = `*Timezone: ${match}*\n`
  + `Date: ${time.format('YYYY-MM-DD')}\n`
  + `Time: ${time.format('HH:mm:ss')}\n`
  + `UTC Offset: ${time.format('Z')}`;
  message.send(txt);
});
