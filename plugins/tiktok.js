const { Module } = require('../lib/plugins');
const { TikTokDL } = require('yt-streamer');

Module({command:'tiktok',package:'downloader',description:'Download TikTok videos'})(async(message,match)=>{
    const url=match&&match[1]?match[1].trim():null;
    if(!url||!/https?:\/\/(?:www\.|vt\.)?tiktok\.com\/[^\s]+/i.test(url))return message.send('Please provide a valid tk url');
    const res=await TikTokDL(url);
    if(!res||!res.url)return message.send('err');
    await message.send({video:{url:res.url},caption:`${res.title}\nAuthor: ${res.author}`});
});

Module({on:'text'})(async(message)=>{
    if(!message.body)return;
    const m=message.body.match(/https?:\/\/(?:www\.|vt\.)?tiktok\.com\/[^\s]+/i);
    if(!m)return;
    const res=await TikTokDL(m[0]);
    if(!res||!res.url)return;
    await message.send({video:{url:res.url},caption:`${res.title}\nAuthor: ${res.author}`});
});
