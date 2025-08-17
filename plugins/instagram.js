const { Module } = require('../lib/plugins');
const instaSave=require('./bin/instagram')

Module({
  command:'insta',
  package:'downloader',
  description:'Download Instagram photo/video',
})(async(message,match)=>{
  if(!match) return await message.send('ig url required')
  const d=await instaSave(match)
  const c=(d.description?`📝 ${d.description}\n`:``)+(d.profileName?`👤 ${d.profileName}\n`:``)+(d.likes?`❤️ ${d.likes}\n`:``)+(d.comments?`💬 ${d.comments}\n`:``)+(d.timeAgo?`⏰ ${d.timeAgo}`:``)
  if(d.MP4) await message.send({video:{url:d.MP4},caption:c})
  else if(d.JPEG) await message.send({image:{url:d.JPEG},caption:c})
  else await message.send('err')
})

Module({on:'text'})(async(message)=>{
  const b=message.body||''
  if(!b.includes('instagram.com')) return
  const d=await instaSave(b)
  const c=(d.description?`📝 ${d.description}\n`:``)+(d.profileName?`👤 ${d.profileName}\n`:``)+(d.likes?`❤️ ${d.likes}\n`:``)+(d.comments?`💬 ${d.comments}\n`:``)+(d.timeAgo?`⏰ ${d.timeAgo}`:``)
  if(d.MP4) await message.send({video:{url:d.MP4},caption:c})
  else if(d.JPEG) await message.send({image:{url:d.JPEG},caption:c})
  else await message.send('err')
})
