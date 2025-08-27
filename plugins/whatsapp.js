const { Module } = require('../lib/plugins');

Module({
  command: 'wame',
  package: 'whatsapp',
  description: 'number'
})(async (message, match) => {
 let num
 if (message.mention && message.mention[0]) {
 num = message.mention[0]
 } else if (message.quoted) {
 num = message.quoted.participant || message.quoted.sender
 } else if (match) {
 num = match
 } else { num = message.sender }
 num = num.replace(/[^0-9]/g, '')
await message.send(`https://wa.me/${num}`)
})

Module({
  command: 'status',
  package: 'whatsapp',
  description: 'Get WhatsApp profile status'
})(async (message, match) => {
  let user = message.sender;
  if(message.quoted) user = message.quoted.sender;
  const [statusObj, pfpUrl] = await Promise.all([
  message.fetchStatus(user),message.profilePictureUrl(user).catch(() => null)]);
  if(!statusObj || !statusObj.status) return await message.send('_no status set_');
  const time = new Date(statusObj.setAt).toLocaleString('en-ZA', {timeZone:'Africa/Johannesburg'});
  const text = `*Whois* @${user.split('@')[0]}:\n\n${statusObj.status}\n\nSet at: ${time}`;
  if(pfpUrl) await message.send({image:{url:pfpUrl}, caption:text}, {mentions:[user]});
  else await message.send(text, {mentions:[user]});
});

Module({
  command: 'block',
  package: 'whatsapp',
  description: 'Block a user (owner only)'
})(async (message, match) => {
  if (!message.fromMe) return;
  if (!message.quoted) return await message.send('_Reply to the user_');
  const user = message.quoted.sender;
  await message.blockUser(user);
  await message.send(`${user.split('@')[0]} blocked`, { mentions: [user] });
});

Module({
  command: 'unblock',
  package: 'whatsapp',
  description: 'Unblock a user (owner only)'
})(async (message, match) => {
  if (!message.fromMe) return;
  if (!message.quoted) return await message.send('_Reply to the user_');
  const user = message.quoted.sender;
  await message.unblockUser(user);
  await message.send(`${user.split('@')[0]} unblocked`, { mentions: [user] });
});
