const { Module } = require("../lib/plugins");
const fetch = require("node-fetch");
const he = require("he");

Module({
  command: "deepseak",
  package: "ai",
  description: "Ask Deepseak AI"
})(async (message, match) => {
  if (!match) return message.send("_Please provide a prompt_");
  const res = await fetch("https://api.naxordeve.qzz.io/ai/deepseak", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ prompt: match })});
  const data = await res.json();
  await message.send(he.decode(data.result.replace(/<think>|<\/think>|<br>/g, "").trim())
  );
});
