const { Module } = require('../lib/plugins');
const fetch = require('node-fetch');
const { Sequelize, DataTypes } = require('sequelize');
const sequelize = new Sequelize({dialect: 'sqlite',storage: './autoreact.sqlite',logging: false});
const AutoReact = sequelize.define('AutoReact', {chat: { type: DataTypes.STRING, primaryKey: true },type: { type: DataTypes.STRING, defaultValue: 'all' },enabled: { type: DataTypes.BOOLEAN, defaultValue: false } });
sequelize.sync();

Module({
  command: 'autoreact',
  package: 'tools',
  description: 'auto-react',
})(async (message, match) => {
  if (!message.fromMe) return; 
  match = match?.trim()?.toLowerCase();
  if (!match || !['on', 'off'].includes(match))
  return message.send('_usage: .autoreact on/off_');
  const enabled = match === 'on';
  const type = message.isGroup ? 'group' : 'pm';
  await AutoReact.upsert({ chat: message.from, type, enabled });
  await message.send(`_Auto-react ${match} for: ${type}_`);
});

Module({ on: 'text' })(async (message) => {
  const type = message.isGroup ? 'group' : 'pm';
  const row = await AutoReact.findOne({ where: { chat: message.from, type } });
  if (!row || !row.enabled) return;
  const text = message.body?.trim();
  if (!text) return;
  const res = await fetch('https://api.naxordeve.qzz.io/api/emojis');
  if (!res.ok) return;
  const data = await res.json();
  const emojis = data.emojis || [];
  for (const emoji of emojis) {
    await message.react(emoji);
  }
});
