const { Module } = require('../lib/plugins')

Module({
  command: "setpp",
  package: "owner",
  description: "Set profile picture"
})(async (message) => {
  if (! message.fromMe) return;
  if (!message.quoted || !/imageMessage/.test(message.quoted.type)) {
  return message.send("Reply to an image")}
  let buf = await message.quoted.download()
  await message.setPp(message.sender, buf)
  return message.send("_Profile picture updated_")
})
