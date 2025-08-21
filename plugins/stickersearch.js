const axios = require("axios")
const {Module} = require('../lib/plugins');

Module({
  command: "stickersearch",
  type: "tools",
  description: "Search stickers"
})(async (message, match) => {
  if (!match) return message.send("_Need a search term_")
  let q = match.trim()
  let res = await axios.get(`https://garfield-apis.onrender.com/search/stickersearch?query=${q}`)
  let data = res.data
  if (!data.sticker_url || data.sticker_url.length === 0) return message.send("_not_found_")
  for (let url of data.sticker_url) {
  await message.sendFromUrl(url, { asSticker: true })
  }
})
