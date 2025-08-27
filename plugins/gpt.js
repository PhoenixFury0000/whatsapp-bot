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

Module({
  command: 'garfield',
  package: 'ai',
  description: 'Chat with Garfield the cat'
})(async (message, match) => {
  if (!match) return message.send("What do you want, human?")
  let sys = "You are Garfield, the lazy sarcastic orange cat. You love lasagna, hate Mondays, and reply with humor and grumpiness."
  let q = match
  let r = await fetch("https://api.naxordeve.qzz.io/ai/chatgpt_3.5_scr1", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      messages: [
        { role: "system", content: sys },
        { role: "user", content: q }
      ]
    })
  })

  let j = await r.json()
  await message.send(j?.response || "Ugh... too much work.")
})
