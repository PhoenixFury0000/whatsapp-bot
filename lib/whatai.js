const axios = require("axios");
const models = ["gpt-4o", "gpt-4o-mini", "claude-3-opus", "claude-3-sonnet","llama-3", "llama-3-pro", "perplexity-ai", "mistral-large", "gemini-1.5-pro"];
function ip() { return `${rand()}.${rand()}.${rand()}.${rand()}`; }
function rand() { return Math.floor(Math.random() * 255) + 1; }
function heads() {
  let x = ip();
  return {
    accept: "application/json, text/plain, */*",
    "content-type": "application/json",
    origin: "https://whatsthebigdata.com",
    referer: "https://whatsthebigdata.com/ai-chat/",
    "user-agent": "Mozilla/5.0 (Linux; Android 10)",
    "x-forwarded-for": x,
    "x-real-ip": x,
    "x-client-ip": x
  };
}

async function askAi(text = "") {
  if (!text) return "Missing prompt";
  let model = "gpt-4o";
  let q = text;
  if (text.includes(":")) {
    let p = text.split(":");
    let m = p[0].trim().toLowerCase();
    if (models.includes(m)) {
      model = m;
      q = p.slice(1).join(":").trim();
    }}try {
    let res = await axios.post(
      "https://whatsthebigdata.com/api/ask-ai/",
      { message: q, model, history: [] },
      { headers: heads() }
    );
    return res.data?.text || "no reply";
  } catch (e) {
    return e.response?.data || e.message || "error";
  }
}

module.exports = askAi;
