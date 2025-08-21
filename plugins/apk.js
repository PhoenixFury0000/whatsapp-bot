const axios = require("axios")
const { Module } = require("../lib/plugins")

Module({
  command: "aptoide",
  package: "downloader",
  description: "Search apps and dl"
})(async (message, match) => {
  if (!match) return message.send("_Please provide an app name_")
  let query = match.trim()
  let res
  res = await axios.get(`https://garfield-apis.onrender.com/aptoide?query=${query}`)
  let data = res.data
  if (!data.results || data.results.length === 0) return message.send("_err_")
  let app = data.results[0] 
  let caption = `*${app.name}*\n`
  caption += `*Version:* ${app.version}\n`
  caption += `*Size:* ${(app.size/1024/1024).toFixed(2)} MB\n`
  caption += `*Developer:* ${app.developer}`
  let dlRes
  try { dlRes = await axios.get(`https://garfield-apis.onrender.com/aptoide/download?url=${app.download_url}`, { responseType: "arraybuffer" })
  } catch { return message.send("_er_");}
  await message.send({document: Buffer.from(dlRes.data), fileName: `${app.name}.apk`, mimetype: "application/vnd.android.package-archive", caption
  })
})
