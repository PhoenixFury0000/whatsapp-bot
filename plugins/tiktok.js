const { Module } = require('../lib/plugins');
const { TikTokDL } = require('yt-streamer');

Module({
    command: 'tiktok',
    package: 'downloader',
    description: 'Download TikTok videos',
})(async (message, match) => {
    if (!match || !match[1]) return message.send('Please provide a tiktok url');
    const vi = match[1];
    const data = await TikTokDL(vi);
    if (!data || !data.url) return message.send('err');
    const caption = `${data.title}\n*Author:* ${data.author}`;
    await message.send({video: { url: data.url },caption: caption
    });
});


Module({
    on: 'text'
})(async (message) => {
    if (!message.body) return;
    const match = message.body.match(/https?:\/\/(?:www\.)?tiktok\.com\/[^\s]+/);
    if (match) { const vi = match[0];
        const data = await TikTokDL(vi);
        if (data && data.url) {
          const caption = `${data.title}\n*Author:* ${data.author}`;
           await message.send({video: { url: data.url },caption: caption });
        }
    }
});
