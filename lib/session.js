const fs=require('fs');
const path=require('path');
const axios=require('axios');
const config=require('../config');

async function SessionCode(session,fd){try{if(!session)throw new Error("Missing session string");const token=config.HASTEBIN||process.env.HASTEBIN;const id=session.trim().split(/[^a-zA-Z0-9]/).filter(Boolean).pop();if(!id)throw new Error("not valid session ID");const url=`https://hastebin.com/raw/${id}`;const res=await axios.get(url,{headers:{Authorization:`Bearer ${token}`}});if(!res.data||!res.data.content)throw new Error("Session data missing");if(!fs.existsSync(fd))fs.mkdirSync(fd,{recursive:true});const filePath=path.join(fd,'creds.json');const content=typeof res.data.content==='string'?res.data.content:JSON.stringify(res.data.content);fs.writeFileSync(filePath,content);console.log("✅ connected");}catch(e){console.error(e.message);}}
module.exports={SessionCode};
