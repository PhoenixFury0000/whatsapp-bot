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
  command:"song",
  package:"downloader",
  description:"Download audio from YouTube"
})(async(message,match)=>{
if(!match) return message.send("_need a yt url or song nam_")
let input=match.trim()
async function searchYt(q){const key='AIzaSyDLH31M0HfyB7Wjttl6QQudyBEq5x9s1Yg';const res=await fetch(`https://www.googleapis.com/youtube/v3/search?key=${key}&part=snippet&type=video&maxResults=13&q=${q}`);const data=await res.json();if(!data.items||!data.items.length)return[];return data.items.map(v=>({id:v.id.videoId,title:v.snippet.title,url:`https://www.youtube.com/watch?v=${v.id.videoId}`}))}
async function getTitle(u){let id=u.includes("youtu.be/")?u.split("youtu.be/")[1].split(/[?&]/)[0]:new URL(u).searchParams.get("v");if(!id)return"song";const key='AIzaSyDLH31M0HfyB7Wjttl6QQudyBEq5x9s1Yg';const res=await fetch(`https://www.googleapis.com/youtube/v3/videos?key=${key}&part=snippet&id=${id}`);const data=await res.json();if(!data.items||!data.items.length)return"song";return data.items[0].snippet.title}
let url=input,title
if(!/^https?:\/\/(www\.)?youtube\.com\/watch\?v=/.test(input)&&!/^https?:\/\/youtu\.be\//.test(input)){const r=await searchYt(input);if(!r.length)return message.send("err");url=r[0].url;title=r[0].title}else{title=await getTitle(url)}
await message.send("*Downloading:* "+title)
const apiRes=await axios.get(`https://garfield-apis.onrender.com/youtube-audio?url=${url}`)
const buf=await axios.get(apiRes.data.audio.downloadUrl,{responseType:"arraybuffer"})
await message.send({document:Buffer.from(buf.data),mimetype:"audio/mpeg",fileName:`${title}.mp3`})
})

Module({
  command: 'ytmp4',
  package: 'downloader',
  description: 'Download YouTube MP4'
})(async (message, match) => {
  if (!match) return await message.send('_Give a query or url_');
  let url = match.trim(), title = 'video';
  const regex = /(?:youtube\.com\/.*v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
  const id = url.match(regex)?.[1];
  if (!id) { const res = await ytApiSearch(url, 1); if (!res.length) return await message.send('_eish_'); url = res[0].url; title = res[0].title; } 
  else { const res = await ytApiSearch(id, 1); if (res.length) title = res[0].title; }
  const apiRes = await axios.get(`https://garfield-apis.onrender.com/youtube-video?url=${url}&quality=720`);
  const buf = await axios.get(apiRes.data.video.downloadUrl, { responseType: 'arraybuffer' });
  await message.send({ video: Buffer.from(buf.data), caption: `*Title:* ${title}\n*Quality:* 720p` });
});

Module({
  command: 'yta',
  package: 'downloader',
  description: 'Download YouTube Audio'
})(async (message, match) => {
  if (!match) return await message.send('_Give a query or url_');
  let url = match.trim();
  const regex = /(?:youtube\.com\/.*v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
  const id = url.match(regex)?.[1];
  if (!id) {const res = await ytApiSearch(url, 1);
  if (!res.length) return await message.send('_eish_');
  url = res[0].url; }
  const apiRes = await axios.get(`https://garfield-apis.onrender.com/youtube-audio?url=${url}`);
  const buf = await axios.get(apiRes.data.audio.downloadUrl, { responseType: 'arraybuffer' });
  await message.send({ audio: Buffer.from(buf.data), mimetype: 'audio/mpeg' });
});

Module({
  command: 'ytmp3',
  package: 'downloader',
  description: 'Download YouTube MP3'
})(async (message, match) => {
  if (!match) return await message.send('_Give a query or url_');
  let url = match.trim();
  const regex = /(?:youtube\.com\/.*v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
  const id = url.match(regex)?.[1];
  if (!id) { const res = await ytApiSearch(url, 1);
  if (!res.length) return await message.send('_eish_');
  url = res[0].url; }
  const apiRes = await axios.get(`https://garfield-apis.onrender.com/youtube-audio?url=${url}`);
  const buf = await axios.get(apiRes.data.audio.downloadUrl, { responseType: 'arraybuffer' });
  await message.send({ audio: Buffer.from(buf.data), mimetype: 'audio/mpeg' });
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
  let body = message.quoted.body || message.quoted.msg?.text || message.quoted.msg?.caption || '';
  if (!body.includes('⬤')) return;
  let url = body.split('\n')[0].replace(/[*_]/g, '').trim();
  const regex = /(?:youtube\.com\/.*v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
  const id = url.match(regex)?.[1];
  let title = 'video';
  const res = await ytApiSearch(url, 1);
  if (!id) {
  if (!res.length) return await message.send('_eish_');
  url = res[0].url;
  title = res[0].title;
  } else if (res.length) title = res[0].title;
  const choice = message.body.trim();
  if (!['1','2','3'].includes(choice)) return;
  await message.send(`\`\`\`Downloading: ${title}\`\`\``);
  const thumbUrl = `https://i.ytimg.com/vi/${id}/hqdefault.jpg`;
  if (choice === '1' || choice === '3') {
  const apiRes = await axios.get(`https://garfield-apis.onrender.com/youtube-audio?url=${url}`);
  const buf = await axios.get(apiRes.data.audio.downloadUrl, { responseType: 'arraybuffer' });
  if (choice === '1') await message.send({ audio: Buffer.from(buf.data), mimetype: 'audio/mpeg', contextInfo: { externalAdReply: { title, body: 'Audio', mediaType: 1, thumbnailUrl: thumbUrl, mediaUrl: url, showAdAttribution: falsa, renderLargerThumbnail: false } } });
  else { const fileName = title.replace(/[^\w\s]/g, '') + '.mp3'; await message.send({ document: Buffer.from(buf.data), mimetype: 'audio/mpeg', fileName, contextInfo: { externalAdReply: { title, body: 'Document', mediaType: 1,thumbnailUrl: thumbUrl, mediaUrl: url, showAdAttribution: false, renderLargerThumbnail:  false } } }); }
  } else if (choice === '2') {
  const apiRes = await axios.get(`https://garfield-apis.onrender.com/youtube-video?url=${url}&quality=720`);
  const buf = await axios.get(apiRes.data.video.downloadUrl, { responseType: 'arraybuffer' });
  await message.send({ video: Buffer.from(buf.data), caption: `*Title:* ${title}\n*Quality:* 720p` });
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
