const os = require('os');
const { Module, commands } = require('../lib/plugins');
const { getTheme } = require('../Themes/themes');
const config = require('../config');
const TextStyles = require('../lib/textfonts');
const styles = new TextStyles();
const theme = getTheme();
const star = '⛥';

Module({
  command: 'menu',
package: 'general',
description: 'Show main or fun commands menu',
})(async (message, match, args) => {
  if (args && args.includes('--fun')) {
    await message.reply(`--------[ ♧ Eternity Fun Section ♧ ]---------
> .tr        ~ Translate Text
> .chat      ~ Talk with AI
> .song      ~ Song Downloader
> .time      ~ Time of any country
> .wame      ~ Your WhatsApp link
> .carbon    ~ Create code images
> .removebg  ~ Remove image background
> .animequiz ~ Anime trivia game
------------------------------------
ETERNITY | THE BEST IS YET TO BE
------------------------------------`);
  } else {
    await message.reply(`--------[ ♧ Eternity ♧ ]---------
> .ping    ~ Latency Check
> .alive   ~ Bot Status
> .menu --fun ~ Fun Commands
> .define  ~ Urban Dictionary lookup
> .weather ~ Weather information
------------------------------------
ETERNITY | THE BEST IS YET TO BE
------------------------------------`);
  }
});


Module({
  command: 'alive',
  package: 'general',
  description: 'Check if bot is alive',
})(async (message) => {
  const hostname = os.hostname();
  const time = new Date().toLocaleTimeString('en-ZA', { timeZone: 'Africa/Johannesburg' });
  const ramUsedMB = (process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2);
  const uptime = process.uptime();
  const hours = Math.floor(uptime / 3600);
  const minutes = Math.floor((uptime % 3600) / 60);
  const seconds = Math.floor(uptime % 60);
  const ctx = `
${theme.botName}* is online

Time: ${time}
Host: ${hostname}
RAM Usage: ${ramUsedMB} MB
Uptime: ${hours}h ${minutes}m ${seconds}s
`;
  if (theme.image) {
    await message.send({ image: { url: theme.image }, caption: ctx });
  } else {
    await message.send(ctx);
  }
});
