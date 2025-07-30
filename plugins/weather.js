const {Module} = require('../lib/plugins');
var axios = require('axios')
const cheerio = require('cheerio')
const he = require('he')

Module({
  command: 'weather',
  package: 'info',
  description: 'Weather forecast'
})(async (message, match) => {
  let city = match || 'Johannesburg'
  let res = await axios.get(`https://wttr.in/${city}?0`)
  let $ = cheerio.load(res.data)
  let raw = $('pre').html()
  if (!raw) return message.send('err')
  raw = raw.replace(/<\/?span[^>]*>/g, '')
  let text = he.decode(raw.trim())
  message.send('```' + text + '```');
})
