const axios = require('axios');
const { Module } = require('../lib/plugins');

Module({
  command: 'get',
  package: 'tools',
  description: 'Download file, image, video, audio, etc',
})(async (message, match) => {
  const input = match || message.quoted?.text || '';
  if (!input) return await message.send('_url required_');
  const url = (input.match(/https?:\/\/[^\s]+/) || [])[0];
  if (!url) return await message.send('_Invalid URL_');
  const config = {
    method: 'get',
    url,
    responseType: 'arraybuffer',
    maxRedirects: 10,
    validateStatus: s => s >= 200 && s < 400,
    headers: { 'User-Agent': 'Mozilla/5.0', Accept: '*/*' }
  };

  const res = await axios(config);
  const data = Buffer.from(res.data);
  let type = res.headers['content-type'] || '';
  const size = parseInt(res.headers['content-length'] || data.length);
  if (size > 100 * 1024 * 1024) return await message.send('_File too large_');
  const extMap = {
    'image/jpeg': '.jpg','image/png': '.png','image/gif': '.gif','image/webp': '.webp',
    'audio/mpeg': '.mp3','audio/mp4': '.m4a','audio/ogg': '.ogg',
    'video/mp4': '.mp4','video/quicktime': '.mov',
    'application/pdf': '.pdf',
    'text/plain': '.txt','application/json': '.json','text/html': '.html',
    'application/zip': '.zip','application/x-rar-compressed': '.rar'
  };

  const extFromType = extMap[type] || '';
  const urlPath = new URL(url).pathname;
  const urlName = urlPath.split('/').pop();
  const hasExt = urlName && urlName.includes('.') ? urlName : 'file' + extFromType;
  const cd = res.headers['content-disposition'];
  const fileName = cd ? (cd.match(/filename\*?=(?:UTF-8'')?"?([^";]+)"?/i)?.[1] || hasExt) : hasExt;
  if (type.startsWith('image/')) {
    return await message.send({ image: data, mimetype: type, fileName }, { quoted: message });
  } else if (type.startsWith('video/')) {
    return await message.send({ video: data, mimetype: type, fileName }, { quoted: message });
  } else if (type.startsWith('audio/') || urlName.endsWith('.mp3') || urlName.endsWith('.m4a') || urlName.endsWith('.ogg')) {
    return await message.send({ audio: data, mimetype: type || 'audio/mpeg', fileName }, { quoted: message });
  } else if (type.startsWith('text/') || type.includes('json')) {
    const text = data.toString('utf-8');
    return await message.send(text.length > 4000 ? text.slice(0, 3900) + '...' : text);
  } else {
    return await message.send({ document: data, mimetype: type || 'application/octet-stream', fileName }, { quoted: message });
  }
});
