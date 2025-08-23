const fs = require('fs');
var path = require('path');
const axios = require('axios');

async function SessionCode(session, fd) {
    try {
    if (!session) throw new Error("Invalid SESSION_ID format");
    const x = session.includes("~") ? session.split("~")[1] : session;
    const ctx = `https://pastebin.com/raw/${x}`;
    const con = {method: 'get',url: ctx};
    const res = await axios(con);   
    if (!res.data) throw new Error("Session data missing");   
    if (!fs.existsSync(fd)) fs.mkdirSync(fd, { recursive: true });   
    const n = path.join(fd, "creds.json");
    const conn = typeof res.data === "string" 
    ? res.data 
    : JSON.stringify(res.data);
    fs.writeFileSync(n, conn);
   console.log("✅ connected");
    } catch (error) {
   console.error(error.message);
    }
}

module.exports = { SessionCode };
