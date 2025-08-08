const {Module} = require('../lib/plugins');
const axios = require("axios");

Module({
  command: "lyrics",
  package: "info",
  description: "Get song lyrics"
})(async (message, match) => {
  if (!match) return await message.send("_Give me a song title eg Sad by xxxtentacion_");
  const url = `https://lrclib.net/api/search?q=${match}`;
  const headers = {"User-Agent": "Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Mobile Safari/537.36",Referer: "https://lrclib.net"};
  const { data } = await axios.get(url, { headers });
  if (!data.length) return await message.send("_no lyric_");
  const r = data[0];
  const text = `🎵 *${r.trackName}* by *${r.artistName}*\n\n${r.plainLyrics || "_nothin_"}`;
  await message.send({image: { url: "https://files.catbox.moe/6jx2fn.jpg" },caption: text.length > 4000 ? text.slice(0, 4000) + "\n\n_Lyrics truncated..._" : text
  });
});
