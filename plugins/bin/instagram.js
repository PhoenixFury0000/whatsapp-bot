const f = require('node-fetch');
const c = require('cheerio');

/*
Diegoson 
*/

async function instaSave(url) {
  const u = 'https://insta-save.net/content.php';
  const r = await f(`${u}?url=${url}`, {
    headers: {
      'User-Agent': 'Mozilla/5.0',
      'Referer': 'https://insta-save.net/'
    }
  });

  const j = await r.json();
  if (j.status !== 'ok') throw new Error('fail');
  const $ = c.load(j.html);
  const el = $('#download_content .col-md-4.position-relative').first();
  const jpg = el.find('img.load').attr('src') || el.find('img').attr('src') || null;
  const mp4 = el.find('a.btn.bg-gradient-success').attr('href') || null;
  const description = el.find('p.text-sm').text().trim() || null;
  const profileName = el.find('p.text-sm a').text().trim() || null;
  const stats = el.find('.stats small').toArray().map(s => $(s).text().trim());
  const likes = stats[0] || null;
  const comments = stats[1] || null;
  const timeAgo = stats[2] || null;
  return { JPEG: jpg, MP4: mp4, likes, comments, description, profileName, timeAgo };
}

module.exports = instaSave;
