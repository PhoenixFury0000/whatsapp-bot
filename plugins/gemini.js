const { Module } = require('../lib/plugins');
const axios = require('axios');

Module({
    command: 'gemini',
    package: 'ai',
    description: 'Ask Gemini 2.5 with text and optional image'
})(async (message, match) => {
    const api = 'AIzaSyClFUKysXJj-v4NxGwVeQZN7ygds7dpkcs';
    const prompt = match && match[1] ? match[1] : 'Describe this image';
    let contents = [{ parts: [{ text: prompt }] }];
    if (message.quoted && message.quoted.type === 'imageMessage') {
    const buffer = await message.quoted.download();
    const base64 = buffer.toString('base64');
    contents[0].parts.push({
        inline_data: {
        mime_type: 'image/jpeg',
        data: base64
            }
        });}
    const res = await axios.post(
    'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent',
    { contents },
    { headers: { 'Content-Type': 'application/json', 'X-goog-api-key': api } });
    const output = res.data?.candidates?.[0]?.content?.parts?.[0]?.text || 'err';
    await message.send(output);
});
