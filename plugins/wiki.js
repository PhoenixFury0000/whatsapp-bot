const { Module } = require('../lib/plugins');
const fetch = require('node-fetch');

Module({
  command: 'wiki',
  package: 'search',
  description: 'Search Wikipedia and get a summary',
})(async (message, match) => {
  if (!match) return message.send('_Please provide a search query_');
  const res = await fetch(`https://api.naxordeve.qzz.io/api/search/wiki?q=${match}`);
  if (!res.ok) return message.send('_err_');
  const data = await res.json();
  let text = `
*${data.title}*
${data.description}

${data.summary}

Read more: ${data.page}
  `;

  await message.send({image: { url: data.image },caption: text
  });
});
