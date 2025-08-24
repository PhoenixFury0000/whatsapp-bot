const { Module } = require("../lib/plugins");
const fetch = require("node-fetch");

Module({
  command: "apk",
  package: "downloader",
  description: "Search and download APK from uptodown"
})(async (message, match) => {
  if (!match) return message.send("_Please provide an app name_");
  let query = match.trim();
  let res = await fetch(`https://api.naxordeve.qzz.io/download/uptodown?query=${query}`);
  let data = await res.json();
  if (!data.result || !data.result.download || !data.result.download.url) 
  return message.send("_not found_");
  let url = data.result.download.url;
  let name = data.result.title;
  let size = (parseInt(data.result.download.size) / 1024 / 1024).toFixed(2) + " MB";
  await message.send({document: { url },mimetype: "application/vnd.android.package-archive",fileName: `${name}.apk`,caption: `⬢ Name: ${name}\n⬢ Size: ${size}`
  });
});
