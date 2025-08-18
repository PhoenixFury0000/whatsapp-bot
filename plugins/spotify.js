const { Module } = require('../lib/plugins');
const fetch = require('node-fetch');

Module({
  command: 'spotify',
  package: 'downloader',
  description: 'Download Spotify track as MP3'
})(async (message, match) => {
  if (!match) return await message.send('_Send a Spotify track url_');
  const cat_gar = `https://garfield-apis.onrender.com/download/spotify?url=${match}`;
  const res = await fetch(cat_gar);
  const data = await res.json();
  if (data.error) return await message.send(`${data.error}`);
  const buf = await (await fetch(data.mp3)).arrayBuffer();
  const name = (data.song_name.replace(/[\|\\\/\*\?"<>\:]/g, '').trim() || 'spotify');
  await message.send({document: Buffer.from(buf),fileName: `${name}.mp3`,mimetype: 'audio/mpeg'
  });
});
