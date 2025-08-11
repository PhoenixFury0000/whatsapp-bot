const fs = require('fs');
const axios = require('axios');
const yts = require('yt-search');
const fetch = require('node-fetch');
const { Module } = require('../lib/plugins');
const ytStreamer = require("../lib/ytdl");
const { DownloadMusic,DownloadVideo } = require('yt-streamer');
const AddMp3Meta = require('../lib/Class/metadata');

const x = 'AIzaSyDLH31M0HfyB7Wjttl6QQudyBEq5x9s1Yg';
async function ytSearch(query, max = 10) {
  const url = `https://www.googleapis.com/youtube/v3/search?key=${x}&part=snippet&type=video&maxResults=${max}&q=${query}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(res.statusText);
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
  command: 'yts',
  package: 'search',
  description: 'Search YouTube videos'
})(async (message, match) => {
  if (!match) return await message.send('Please provide a search query');
  const query = match.trim();
  const results = await ytSearch(query, 10);
  if (!results.length) return await message.send('err');
  let reply = `*YouTube results:*"${query}":\n\n`;
  results.forEach((v, i) => {
    const date = new Date(v.publishedAt).toISOString().split('T')[0];
    reply += `⬢ ${i + 1}. ${v.title}\n   Channel: ${v.channel}\n   Published: ${date}\n   Link: ${v.url}\n\n`;
  });

  await message.send({
    image: { url: results[0].thumbnail },
    caption: reply
  });
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
  command: 'song',
  package: 'downloader',
  description: 'Download YouTube MP3'
})(async (message, match) => {
  if (!match) return await message.send('_Give a query or url_');
  let id, video;
  const regex = /(?:youtube\.com\/.*v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
  const found = match.match(regex);
  if (found) {
  id = found[1];
  const results = await ytApiSearch(id, 1, true);
  if (!results.length) return await message.send('_eish_');
  video = results[0];
  } else {
  const results = await ytApiSearch(match, 1);
  if (!results.length) return await message.send('_eosh_');
  video = results[0];
  id = video.id; }
  const title = video.title.replace(/[^\w\s]/g, '') + '.mp3';
  const img = video.thumb && video.thumb.startsWith('http') ? video.thumb : `https://i.ytimg.com/vi/${id}/hqdefault.jpg`;
  await message.send(`\`\`\`Downloading: ${video.title}\`\`\``);
  try { const links = await ytStreamer(`https://www.youtube.com/watch?v=${id}`);
  if (!links || !links.audio) return await message.send('_err_');
  const res = await axios.get(links.audio, { responseType: 'arraybuffer' });
  const buffer = Buffer.from(res.data);
  const thumb = await fetch(img).then(r => r.buffer());
  const doc = await AddMp3Meta(buffer, thumb, { title: video.title, artist: video.channel });
  await message.send({ document: doc, mimetype: 'audio/mpeg', fileName: title });
  } catch {}
});

Module({
  command: 'ytmp4',
  package: 'downloader',
  description: 'Download YouTube MP4'
})(async (message, match) => {
  if (!match) return await message.send('_Give a query or url_');
  let id, video;
  const regex = /(?:youtube\.com\/.*v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
  const found = match.match(regex);
  if (found) {
  id = found[1];
  const results = await ytApiSearch(id, 1, true);
  if (!results.length) return await message.send('_eish_');
  video = results[0];
  } else {
  const results = await ytApiSearch(match, 1);
  if (!results.length) return await message.send('_eish_');
  video = results[0];
  id = video.id; }
  await message.send(`\`\`\`Downloading: ${video.title}\`\`\``);
  try { const links = await ytStreamer(`https://www.youtube.com/watch?v=${id}`);
  if (!links || !links.video) return await message.send('_nothin_');
  const qInfo = (links.qualities || []).find(q => q.key === links.videoKey) || {};
  const quality = qInfo.quality;
  const size = qInfo.size;
  const caption = `*Title:* ${video.title}\n*Quality:* ${quality}\n*Size:* ${size}`;
  const res = await axios.get(links.video, { responseType: 'arraybuffer' });
  const buffer = Buffer.from(res.data);
  await message.send({video: buffer,mimetype: 'video/mp4',fileName: `${video.title}.mp4`,caption});
  } catch {}
});

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
  const video = res[0], id = video.id;
  const img = video.thumb && video.thumb.startsWith('http') ? video.thumb : `https://i.ytimg.com/vi/${id}/hqdefault.jpg`;
  const thumb = await fetch(img).then(r => r.buffer());
  const choice = message.body.trim();
  if (!['1','2','3'].includes(choice)) return;
  await message.send(`\`\`\`Downloading: ${video.title}\`\`\``);
  if (choice === '1') {
  let buffer;
  try { const { YouTubeDL } = require('./bin/trash');
  const info = await YouTubeDL(`https://youtube.com/watch?v=${id}`);
  if (!info || !info.url) throw 'fail';
  const res = await axios.get(info.url, { responseType: 'arraybuffer' });
  buffer = Buffer.from(res.data);
  } catch {
  const file = await DownloadMusic(id);
  if (!fs.existsSync(file)) return await message.send('_eish_');
  buffer = await fs.promises.readFile(file);
  fs.unlinkSync(file); }
  const audio = await AddMp3Meta(buffer, thumb, {title: video.title, artist: video.channel});
  await message.send({ audio, mimetype: 'audio/mpeg' });
  } else if (choice === '2') {
  let buffer;
  const file = await DownloadVideo(id);
  if (!fs.existsSync(file)) return await message.send('_eish_');
  buffer = fs.readFileSync(file);
  fs.unlinkSync(file);
  await message.send({ video: buffer, caption: video.title });
  } else if (choice === '3') {
  let buffer;
  try { const info = await YouTubeDL(`https://youtube.com/watch?v=${id}`);
  if (!info || !info.url) throw 'fail';
  const res = await axios.get(info.url, { responseType: 'arraybuffer' });
  buffer = Buffer.from(res.data);
  } catch {
  const file = await DownloadMusic(id);
  if (!fs.existsSync(file)) return await message.send('_eish_');
  buffer = await fs.promises.readFile(file);
  fs.unlinkSync(file);}
  const document = await AddMp3Meta(buffer, thumb, {title: video.title, artist: video.channel});
  const fileName = video.title.replace(/[^\w\s]/g, '') + '.mp3';
  await message.send({ document, mimetype: 'audio/mpeg', fileName });}
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
  const video = results[0], id = video.id; //thumb = await fetch(video.thumb).then(r => r.buffer());
  const img = video.thumb && video.thumb.startsWith('http') ? video.thumb : `https://i.ytimg.com/vi/${id}/hqdefault.jpg`;
  const thumb = await fetch(img).then(r => r.buffer());
  await message.send(`\`\`\`Downloading: ${video.title}\`\`\``);
  const path = await DownloadMusic(id);
  if (!fs.existsSync(path)) return await message.send('_er_');
  const buffer = await fs.promises.readFile(path);
  const audio = await AddMp3Meta(buffer, thumb, { title: video.title, artist: video.channel });
  await message.send({ audio, mimetype: 'audio/mpeg', contextInfo: { externalAdReply: { title: video.title, body: video.channel, thumbnail: thumb, mediaType: 1, mediaUrl: id, sourceUrl: id, showAdAttribution: false, renderLargerThumbnail: false } } });
  fs.unlinkSync(path);
});
