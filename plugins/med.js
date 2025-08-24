const { Module } = require("../lib/plugins");
const axios = require("axios");

Module({
  command: "genimg",
  package: "ai",
  description: "Generate an AI image"
})(async (message, match) => {
  if (!match) return message.send("_Please provide a prompt_");
  let res = await axios.get(`https://api.naxordeve.qzz.io/media/generate?prompt=${match}`, { responseType: "arraybuffer" });
  await message.send({image: res.data, caption: `${match}`
  });
});


Module({
  command: "movie",
  package: "search",
  description: "Search movie details"
})(async (message, match) => {
  if (!match) return message.send("_Please provide a movie title_");
  let res = await axios.get(`https://api.naxordeve.qzz.io/search/movie?title=${match}`);
  let movie = res.data?.result;
  if (!movie || movie.Response === "False") return message.send("_not found_");
  let caption = `🎬 *${movie.Title}* (${movie.Year})
⭐ IMDB: ${movie.imdbRating}\n
🎯 Metascore: ${movie.Metascore}\n
📺 Type: ${movie.Type}\n
📅 Released: ${movie.Released}\n
⏱️ Runtime: ${movie.Runtime}\n
🎭 Genre: ${movie.Genre}\n
🎥 Director: ${movie.Director}\n
📝 Plot: ${movie.Plot}`;

  if (movie.Poster && movie.Poster !== "N/A") {
    await message.send({ image: { url: movie.Poster }, caption });
  } else {
    await message.send(caption);
  }
});
