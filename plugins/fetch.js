const axios = require('axios');
const { Module } = require('../lib/plugins');

Module({
  command: 'get',
  package: 'tools',
  description: 'Download file, image, video, etc',
})(async (message, match) => {
  const input = match || message.quoted?.text || '';
  if (!input) return await message.send('_url required_');
  const url = (input.match(/https?:\/\/[^\s]+/) || [])[0];
  if (!url) return await message.send('_invalid url_');
  const config = {
    method: 'get',
    url, responseType: 'arraybuffer', maxRedirects: 10,
    validateStatus: s => s >= 200 && s < 400,
    headers: {
      'User-Agent': 'Mozilla/5.0',
      'Accept': '*/*',
      'Accept-Encoding': 'gzip, deflate, br',
      'Accept-Language': 'en-US,en;q=0.5',
      'Connection': 'keep-alive',
      'DNT': '1'
   }};
  const res = await axios(config);
  const data = Buffer.from(res.data);
  const type = res.headers['content-type'] || 'application/octet-stream';
  const size = parseInt(res.headers['content-length'] || data.length);
  if (size > 100 * 1024 * 1024) return await message.send('_file too large_');
  const ctx = {
  'image/jpeg': '.jpg','image/png': '.png','image/gif': '.gif','image/webp': '.webp',
  'application/pdf': '.pdf','audio/mpeg': '.mp3','video/mp4': '.mp4',
  'text/plain': '.txt','application/json': '.json','text/html': '.html',
  'application/zip': '.zip','application/x-rar-compressed': '.rar','application/octet-stream': '.bin',
  };
  const ext = ctx[type] || '';
  const namo = (() => {
  const cd = res.headers['content-disposition'];
  const match = cd && cd.match(/filename\*?=(?:UTF-8'')?"?([^";]+)"?/i);
  return match ? decodeURIComponent(match[1]) : null;
  })();
  const x = (() => {
    const path = new URL(url).pathname;
    const last = path.split('/').pop();
    return (last && last.includes('.')) ? last : 'file' + ext;
  })();
  const fileName = namo || x;
  if (type.startsWith('image/')) return await message.send({ image: data, mimetype: type, fileName }, { quoted: message });
  if (type.startsWith('video/')) return await message.send({ video: data, mimetype: type, fileName }, { quoted: message });
  if (type.startsWith('audio/')) return await message.send({ audio: data, mimetype: type, fileName }, { quoted: message });
  if (type.startsWith('text/') || type.includes('json')) {
  const text = data.toString('utf-8');
  return await message.send(text.length > 4000 ? text.slice(0, 3900) + '...' : text);}
  await message.send({ document: data, mimetype: type, fileName }, { quoted: message });
});
