const { Module } = require('../lib/plugins');
const { searchTubidy, getDetail } = require('yt-streamer')
const fetch = require('node-fetch')

Module({
  command: 'tubidy',
  package: 'downloader'
})(async (message, match) => {
  if (!match) return await message.send('_Give a song name_')
  const results = await searchTubidy(match)
  if (!results.length) return await message.send('_nix_')
  await message.send(`_Downloading:_ ${results[0].title}`)
  const detail = await getDetail(results[0].link)
  const dl = detail.media.find(m => m.type === 'download')
  if (!dl) return await message.send('_nox_')
  const buf = await (await fetch(dl.link)).arrayBuffer()
  await message.send({ document: Buffer.from(buf), fileName: `${detail.title}.mp3`, mimetype: 'audio/mpeg' })
})
