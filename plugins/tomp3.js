const { Module } = require('../lib/plugins')
const fs = require('fs')
const ffmpeg = require('fluent-ffmpeg')
const path = require('path')
const os = require('os');

Module({
  command: "tomp3",
  description: "Convert video/audio to MP3",
  package: "tools"
})(async (message, match) => {
  if (!message.quoted) return message.send("Reply to a video or audio file")
  const mime = message.quoted.msg.mimetype || ''
  if (!/video|audio/.test(mime)) return message.send("Reply to a valid video/audio file")
  const buffer = await message.quoted.download();
  const tmc = (buf, ext) => { const p = path.join(os.tmpdir(), `tmp-${Date.now()}.${ext}`); fs.writeFileSync(p, buf); return p }
  const convertToMp3 = async (buf) => {
  const inFile = tmc(buf,'mp4'), outFile = tmc(Buffer.alloc(0),'mp3')
  await new Promise((res,rej) => { ffmpeg(inFile).addOptions(["-y","-i",inFile,"-vn","-ac","2","-b:a","128k","-ar","44100","-f","mp3"]).on('error', e=>rej(e)).on('end', ()=>res(true)).save(outFile) })
  const mp3 = fs.readFileSync(outFile); fs.unlinkSync(inFile); fs.unlinkSync(outFile); return mp3}
  const mp3Buffer = await convertToMp3(buffer)
  return message.send({ audio: mp3Buffer, mimetype: "audio/mpeg" })
})
