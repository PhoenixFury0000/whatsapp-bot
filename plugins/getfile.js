const {Module} = require('../lib/plugins');
const fs = require("fs");

Module({
  command: "getcmd",
  package: "tools",
  description: "Get file source code"
})(async (message, match) => {
  if (!message.fromMe) return;
  if (!match) return await message.send("_Give a file path, e.g. `plugins/ping.js`_");
  const file = match.trim();
  if (!fs.existsSync(file)) return await message.send("_File not found_");
  const data = fs.readFileSync(file, "utf8");
  if (data.length > 4000) {
  return await message.send({document: Buffer.from(data), mimetype: "text/plain",fileName: file.split("/").pop()});}
  return await message.send("```\n" + data + "\n```");
});
