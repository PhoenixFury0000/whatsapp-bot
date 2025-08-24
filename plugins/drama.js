const { Module } = require("../lib/plugins");
const fetch = require("node-fetch");

Module({
  command: "drama",
  package: "movie",
  description: "Get all episodes of top drama"
})(async (message, match) => {
  const category = match;
  if (!category) return message.send('eg drama romance');
  const res = await fetch(
    `https://api.naxordeve.qzz.io/movie/drama?category=${category}&limit=1`
  );
  const data = await res.json();
  if (!data.success || !data.results || data.results.length === 0)
  return message.send("_No results found_");
  const drama = data.results[0];
  for (let i = 0; i < drama.episodes.length; i++) {
    const ep = drama.episodes[i];
    const vi = await fetch(ep.vid);
    const buffer = Buffer.from(await vi.arrayBuffer());
    await message.send({video: { url: buffer },fileName: `${drama.title}-Episode${i + 1}.mp4`,mimetype: "video/mp4",caption: `${drama.title} - Episode ${i + 1}`
    });
  }
});
