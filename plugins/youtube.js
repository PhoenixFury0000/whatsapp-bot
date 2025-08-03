const fs = require('fs');
const axios = require('axios');
const yts = require('yt-search');
const fetch = require('node-fetch');
const { Module } = require('../lib/plugins');
const { DownloadMusic,DownloadVideo } = require('yt-streamer');

Module({
  command: 'ytmp4',
  package: 'downloader',
  description: 'Download YouTube videos'
})(async (message, match) => {
  let q = match;
  if (!q) return await message.send('_Please provide a yt link or search query_');
  let u = q;
  if (!q.match(/^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\//)) {
  const s = await yts(q);
  if (!s || !s.videos.length) return await message.send('_not_found_');
  u = s.videos[0].url; }
  const id = u.split("v=")[1]?.split("&")[0] || u.split("/").pop();
  const wait = await message.send('_Downloading video..._');
  const p = await DownloadVideo(id);
  const v = fs.readFileSync(p);
  const stat = fs.statSync(p);
  const mb = (stat.size / 1024 / 1024).toFixed(2);
  const title = p.split('/').pop().replace(/\.mp4$/, '');
  await message.send({video: v,mimetype: 'video/mp4',fileName: `${title}.mp4`,caption: `*${title}*\n*${mb} MB*`});
  fs.unlinkSync(p);
});


async function ytApiSearch(query, maxResults = 13) {
  const API_KEY = 'AIzaSyDLH31M0HfyB7Wjttl6QQudyBEq5x9s1Yg';
  const url = `https://www.googleapis.com/youtube/v3/search?key=${API_KEY}&part=snippet&type=video&maxResults=${maxResults}&q=${query}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`${res.statusText}`);
  const data = await res.json();
  if (!data.items || !data.items.length) return [];
  return data.items.map(vid => ({
    id: vid.id.videoId,
    title: vid.snippet.title,
    url: `https://www.youtube.com/watch?v=${vid.id.videoId}`,
    thumbnail: vid.snippet.thumbnails.high.url,
    channel: vid.snippet.channelTitle,
    publishedAt: vid.snippet.publishedAt
  }));
}

Module({
  command: 'play',
  package: 'downloader',
  description: 'YouTube video player'
})(async (message, match) => {
  if (!match) return await message.send('_Give a *query* to play the song or video_');
  const res = await ytApiSearch(match, 1);
  if (!res.length) return await message.send('_eish_');
  const video = res[0];
  const thumb = await fetch(video.thumbnail).then(r => r.buffer());
  const caption = `*_${video.title}_*\n\n\`\`\`1.⬤\`\`\` *audio*\n\`\`\`2.⬤\`\`\` *video*\n\`\`\`3.⬤\`\`\` *document (mp3)*\n\n_*Send a number as a reply*_`;
  await message.send({ image: thumb, caption });
});

Module({ on: 'text' })(async (message) => {
  if (!message.quoted) return;
  const body = message.quoted.body || message.quoted.msg?.text || message.quoted.msg?.caption || '';
  if (!body.includes('⬤')) return;
  const query = body.split('\n')[0].replace(/[*_]/g, '').trim();
  const res = await ytApiSearch(query, 1);
  if (!res.length) return await message.send('_eish_');
  const video = res[0];
  const id = video.id;
  await message.send(`\`\`\`Downloading: ${video.title}\`\`\``);
  if (message.body.includes('1')) {
  const p = await DownloadMusic(id);
  if (!fs.existsSync(p)) return await message.send('_eish_');
  await message.send({ audio: fs.readFileSync(p), mimetype: 'audio/mpeg' });
  fs.unlinkSync(p);
  } else if (message.body.includes('2')) {
  const p = await DownloadVideo(id);
  if (!fs.existsSync(p)) return await message.send('_eish_');
  await message.send({ video: fs.readFileSync(p), caption: video.title });
  fs.unlinkSync(p);
  } else if (message.body.includes('3')) {
  const p = await DownloadMusic(id);
  if (!fs.existsSync(p)) return await message.send('_eish_');
  const f = video.title.replace(/[^\w\s]/g, '') + '.mp3';
  await message.send({ document: fs.readFileSync(p), mimetype: 'audio/mpeg', fileName: f });
  fs.unlinkSync(p);
  }
});

Module({
  command: 'audio',
  package: 'downloader',
  description: 'Search and choose YouTube audio'
})(async (message, match) => {
  if (!match) return await message.send('_Give a *query* to search_');
  const results = await ytApiSearch(match, 12);
  if (!results.length) return await message.send('_nothin_');
  let text = `*_${match}_*\n\n`;
  results.forEach((v, i) => {
  text += `${i + 1}. *${v.title}*\n\n`; });
  text += `_Reply with a number to download_`;
  await message.send(text);
});

Module({ on: 'text' })(async (message) => {
  if (!message.quoted) return;
  const body = message.quoted.body || message.quoted.msg?.text || message.quoted.msg?.caption || '';
  const lines = body.split('\n');
  const arg = lines.filter(v => v.trim().match(/^\d+\.\s\*/));
  const args = parseInt(message.body);
  if (isNaN(args) || args < 1 || args > arg.length) return;
  const title = arg[args - 1].split('. ')[1].replace(/\*/g, '').trim();
  const results = await ytApiSearch(title, 1);
  if (!results.length) return await message.send('_rr_');
  const video = results[0];
  await message.send(`\`\`\`Downloading: ${video.title}\`\`\``);
  const path = await DownloadMusic(video.id);
  if (!fs.existsSync(path)) return await message.send('_er_');
  await message.send({ audio: fs.readFileSync(path), mimetype: 'audio/mpeg' });
  fs.unlinkSync(path);
});
