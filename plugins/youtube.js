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


Module({
  command: 'play',
  package: 'downloader',
  description: 'YouTube video player'
})(async (message, match) => {
  if (!match) return await message.send('_Give a *query* to play the song or video_');
  const res = await yts(match);
  if (!res.videos.length) return await message.send('_eish_');
  const video = res.videos[0];
  const thumb = await fetch(video.thumbnail).then(r => r.buffer());
  const caption = `*_${video.title}_*\n\n\`\`\`1.⬤\`\`\` *audio*\n\`\`\`2.⬤\`\`\` *video*\n\`\`\`3.⬤\`\`\` *document (mp3)*\n\n_*Send a number as a reply*_`;
  await message.send({ image: thumb, caption });
});

Module({ on: 'text' })(async (message) => {
  if (!message.quoted) return;
  const body = message.quoted.body || message.quoted.msg?.text || message.quoted.msg?.caption || '';
  if (!body.includes('⬤')) return;
  const query = body.split('\n')[0].replace(/[*_]/g, '').trim();
  const res = await yts(query);
  if (!res.videos.length) return await message.send('_eish_');
  const video = res.videos[0];
  const id = video.url.split("v=")[1]?.split("&")[0] || video.url.split("/").pop();
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
