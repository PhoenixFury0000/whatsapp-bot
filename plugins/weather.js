const axios = require('axios');
const { Module } = require('../lib/plugins');

Module({
  command: 'weather',
  package: 'info',
  description: 'Get detailed current weather',
})(async (message, match) => {
  const city = (match || message.quoted?.text || '').trim();
  if (!city) return await message.send('_city name required_');
  const { data } = await axios.get(`https://wttr.in/${city}?0T`);
  await message.send('```\n' + data + '\n```');
});
