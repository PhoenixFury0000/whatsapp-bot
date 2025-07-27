const {Module} = require('../lib/plugins');
const axios = require('axios');

Module({
  command: 'lyrics',
  package: 'info',
  description: 'Fetch song lyrics'
})(async (message, match) => {
  if (!match) return message.send('usage: .lyrics <song> <artist>');
  let [title, ...artistArr] = match.split(' ').reverse();
  let artist = artistArr.reverse().join(' ');
  if (!artist) return message.send('_Please include both song and artist_');
  let url = `https://api.lyrics.ovh/v1/${artist}/${title}`;
  let res = await axios.get(url);
  let lyrics = res.data.lyrics;
  let parts = lyrics.match(/(.|[\r\n]){1,4000}/g) || [];
  for (let i = 0; i < parts.length; i++) {
  await message.send(`🎵 *${title} - ${artist}*${parts.length > 1 ? ` (Part ${i + 1})` : ''}\n\n${parts[i]}`);
  }
});
