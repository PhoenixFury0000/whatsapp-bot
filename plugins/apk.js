const fetch = require("node-fetch");
const { Module } = require("../lib/plugins");

Module({
  command: "apk",
  package: "downloader",
  description: "Search apps and dl"
})(async (message, match) => {
  if (!match) return message.send("_Please provide an app name_");
  let query = match.trim();
  let res = await fetch(`https://api.naxordeve.qzz.io/aptoide?query=${query}`);
  let data = await res.json();
  if (!data.results || data.results.length === 0) return message.send("_err_");
  let app = data.results[0];
  let caption = `*${app.name}*\n`;
  caption += `*Version:* ${app.version}\n`;
  caption += `*Size:* ${(app.size / 1024 / 1024).toFixed(2)} MB\n`;
  caption += `*Developer:* ${app.developer}`;
  let dlRes = await fetch(`https://api.naxordeve.qzz.io/aptoide/download?url=${app.download_url}`);
  if (!dlRes.ok) return message.send("_er_");
  let buffer = Buffer.from(await dlRes.arrayBuffer());
  await message.send({document: buffer,fileName: `${app.name}.apk`,mimetype: "application/vnd.android.package-archive",caption
  });
});
