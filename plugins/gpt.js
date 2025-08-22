const { Module } = require('../lib/plugins')
const fetch = require("node-fetch")

Module({
  command: "gpt",
  package: "ai",
  description: "Chat with ChatGPT 3.5"
})(async (message, match) => {
  if (!match) return message.send("Please provide a question")
  let res = await fetch("https://garfield-apis.onrender.com/ai/chatgpt_3.5_scr1", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      messages: [
        { role: "user", content: match }
      ]
    })
  })
  
  let data = await res.json()
  await message.send(data.answer)
})
