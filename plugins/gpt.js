const { Module } = require('../lib/plugins');
const askAi = require('../lib/whatai');

Module({
  command: 'gpt',
  package: 'AI',
  description: 'Ask AI with model auto-detection'
})(async (message, match) => {
  if (!match) return await message.send('_prompt required_');
  const sent = await message.send('*HoL up a sec...*');
  let reply = await askAi(match);
  await message.send(reply, { edit: sent.key });
});
