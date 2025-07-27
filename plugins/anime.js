const {Module} = require('../lib/plugins');
const axios = require('axios');
const he = require('he');

Module({
  command: 'anime',
  package: 'info',
  description: 'Get anime info from Anilist'
})(async (message, match) => {
  if (!match) return message.send('usage: anime <name>');
  let query = `
      query ($search: String) {
        Media (search: $search, type: ANIME) {
          title { romaji english native }
          episodes
          status
          genres
          averageScore
          description(asHtml: false)
          siteUrl
          coverImage { large }
        }
      }
    `;
    let variables = { search: match };
    let res = await axios.post('https://graphql.anilist.co', { query, variables });
    let ani = res.data.data.Media;
    if (!ani) return message.send('eish');
    let desc = he.decode(ani.description.replace(/<[^>]*>/g, ''));
    let text = `*${ani.title.romaji || ani.title.english}*\n`
             + `Episodes: ${ani.episodes || '?'}\n`
             + `Status: ${ani.status}\n`
             + `Score: ${ani.averageScore || '?'}%\n`
             + `Genres: ${ani.genres.join(', ')}\n\n`
             + `${desc}\n\n`
             + `${ani.siteUrl}`;
    
    message.send({ image: { url: ani.coverImage.large }, caption: text });
});

Module({
  command: 'character',
  package: 'info',
  description: 'Get anime character info from Anilist'
})(async (message, match) => {
  if (!match) return message.send('usage: character <name>');
    let query = `
      query ($search: String) {
        Character(search: $search) {
          name { full native }
          description(asHtml: false)
          image { large }
          siteUrl
          media(perPage: 3) {
            nodes {
              title { romaji }
            }
          }
        }
      }
    `;
    let variables = { search: match };
    let res = await axios.post('https://graphql.anilist.co', { query, variables });
    let ch = res.data.data.Character;
    if (!ch) return message.send('not found');
    let desc = ch.description.replace(/<[^>]*>/g, '').slice(0, 500);
    let medias = ch.media.nodes.map(m => m.title.romaji).join(', ');
    let txt = `*${ch.name.full}* (${ch.name.native})\n`
            + `Appears in: ${medias || 'N/A'}\n\n`
            + `${desc}\n\n`
            + `More info: ${ch.siteUrl}`;
    await message.send(txt, { image: ch.image.large });

});      

Module({
  command: 'manga',
  package: 'info',
  description: 'Get manga info from Anilist'
})(async (message, match) => {
  if (!match) return message.send('usage: manga <name>');
  let query = `
      query ($search: String) {
        Media (search: $search, type: MANGA) {
          title { romaji english native }
          chapters
          volumes
          status
          genres
          averageScore
          description(asHtml: false)
          siteUrl
        }
      }
    `;
    let variables = { search: match };
    let res = await axios.post('https://graphql.anilist.co', { query, variables });
    let manga = res.data.data.Media;
    if (!manga) return message.send('not found');
    let desc = manga.description.replace(/<[^>]*>/g, '').slice(0, 500);
    let txt = `*${manga.title.romaji || manga.title.english}*\n`
            + `Chapters: ${manga.chapters || '?'} | Volumes: ${manga.volumes || '?'}\n`
            + `Status: ${manga.status}\n`
            + `Score: ${manga.averageScore || '?'}%\n`
            + `Genres: ${manga.genres.join(', ')}\n\n`
            + `${desc}\n\n`
            + `More info: ${manga.siteUrl}`;
 await message.send(txt);
  
});
