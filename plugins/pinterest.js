const axios = require('axios');
const cheerio = require('cheerio');
const { Module } = require('../lib/plugins');

Module({
  command: "pinterest",
  package: "search",
  description: "Search Pinterest images"
})(async (message, match) => {
  if (!match) return message.send("_Please provide a search term_")
  let query = match.trim();
  let res 
  res = await axios.get(`https://garfield-apis.onrender.com/search/pinterest?query=${query}`)
  let data = res.data
  if (!data.results || data.results.length === 0) return message.send("_err_")
  let results = data.results.slice(0, 5)
  for (let url of results) {
  await message.sendFromUrl(url)
  }
})

Module({
  command: 'pint',
  package: 'downloader',
  description: 'Search Pinterest images'
})(async (message, match) => {
  if (!match) return message.send('Enter a search keyword or pinterest url');
  let img;
  if (/^(https?:\/\/)?(www\.)?(pin\.it|pinterest\.com)\/.+/.test(match)) {
    const res = await axios.get(match, {
      maxRedirects: 5,
      headers: { 'User-Agent': 'Mozilla/5.0' }
    });
    const $ = cheerio.load(res.data);
    img = $('meta[property="og:image"]').attr('content');
    if (!img) return message.send('_not found_');
  } else {
    const q = `${match} site:pinterest.com`;
    const url = `https://www.google.com/search?q=${q}&tbm=isch`;
    const { data } = await axios.get(url, {
    headers: { 'User-Agent': 'Mozilla/5.0' }});
    const $ = cheerio.load(data);
    const images = [];
    $('img').each((_, el) => {
    const src = $(el).attr('data-iurl') || $(el).attr('data-src') || $(el).attr('src');
    if (src?.startsWith('http')) images.push(src); });
    if (!images.length) return message.send('_eish_');
    img = images[Math.floor(Math.random() * images.length)]; }
    await message.send({ image: { url: img }, caption: `${match}` });
});
