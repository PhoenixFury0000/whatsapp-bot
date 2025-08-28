const { Module } = require('../lib/plugins');
const { createGame, getGame, deleteGame, addPlayer, startGame, processWord } = require('../lib/wcg');

Module({
  command: 'wcg',
  package: 'games',
  description: 'Start Word Chain Game - 2 players only'
})(async (message, match) => {
  if (!message.isGroup) return;
  if (getGame(message.from)) return await message.send('_wcg is already running_');
  
  const maxRounds = parseInt(match) || 20;
  const session = createGame(message.from, message.sender, maxRounds);
  session.maxPlayers = 2;

  const gameMsg = `🎮 *WORD CHAIN GAME*                                 
📝 Starting: *${session.currentWord.toUpperCase()}*
🎯 Next letter: *${session.lastLetter.toUpperCase()}*
👥 Players: *${session.players.size}/${session.maxPlayers}*
💬 Type *join* to play`;

  await message.send(gameMsg, { mentions: [message.sender] });

  session.timeoutId = setTimeout(() => {
    const currentSession = getGame(message.from);
    if (currentSession && !currentSession.started) {
      deleteGame(message.from);
      message.send('Game ended due to inactivity');
    }
  }, 120000);
});

Module({
  command: 'wcgend',
  package: 'games',
  description: 'End current Word Chain Game'
})(async (message) => {
  if (!message.isGroup) return;
  const session = getGame(message.from);
  if (!session) return await message.send('_No Word Chain Game is running_');
  if (message.sender !== session.starter && !message.fromMe) {
    return await message.send('_Only the game starter can end the game_');
  }
  deleteGame(message.from);
  await message.send('🏁 _Word Chain Game ended by admin_');
});

Module({
  on: 'text'
})(async (message) => {
  if (!message.isGroup) return;
  const session = getGame(message.from);
  if (!session) return;

  const body = message.body.trim().toLowerCase();
  const sender = message.sender;
  if (session.timeoutId) clearTimeout(session.timeoutId);

  if (body === 'join') {
    if (session.started) return await message.reply('_Game already started_');
    if (session.players.has(sender)) return await message.reply('_You are already in the game_');

    if (addPlayer(message.from, sender)) {
      const joinMsg = `┌─ ✅ *PLAYER JOINED*                             
│ 🎪 *${sender.split('@')[0]}* joined             
│ 👥 Players: *${session.players.size}/${session.maxPlayers}*
${Array.from(session.players).map(p => ` • ${p.split('@')[0]}`).join('\n')}                   
└─`;

      await message.send(joinMsg, { mentions: Array.from(session.players) });

      // auto start when 2nd player joins
      if (session.players.size === 2) {
        startGame(message.from);
        const startMsg = `*Game Started*

📝 Word: *${session.currentWord.toUpperCase()}*
🎯 Next: *${session.lastLetter.toUpperCase()}*
👥 Players: *${session.players.size}*

Say a word starting with *${session.lastLetter.toUpperCase()}*`;
        await message.send(startMsg, { mentions: Array.from(session.players) });
      }
    } else {
      await message.reply('_Game is full (2 players only)_');
    }
    return;
  }

  if (!/^[a-z]{3,}$/.test(body)) return;
  if (body.startsWith('.') || body.startsWith('!') || body.startsWith('/')) return;
  if (!session.started) return;
  if (!session.players.has(sender)) return;

  const result = processWord(message.from, body, sender);
  if (!result.success) {
    let errorMsg = '';
    if (result.reason === 'invalid_word') errorMsg = `"*${result.word.toUpperCase()}*" is not a valid English word`;
    else if (result.reason === 'repeated_word') errorMsg = `"*${result.word.toUpperCase()}*" was already used!`;
    else if (result.reason === 'wrong_letter') errorMsg = `"*${result.word.toUpperCase()}*" doesn't start with "*${result.expectedLetter.toUpperCase()}*"`;

    await message.reply(errorMsg);

    const endMsg = `🏁 *GAME OVER*                       
💀 *${sender.split('@')[0]}* lost
⚠️ ${result.reason.replace('_', ' ')}                       
👥 Players: *${session.players.size}*
📝 Words: *${session.usedWords.size}*
🎮 Thanks for playing`;

    await message.send(endMsg, { mentions: Array.from(session.players) });
    deleteGame(message.from);
    return;
  }

  if (result.gameComplete) {
    const winMsg = `🎊 *COMPLETE*\n
🏆 Winner: *${result.sender.split('@')[0]}*
📝 Final: *${result.word.toUpperCase()}*
👥 Players: *${result.session.players.size}*`;

    await message.send(winMsg, { mentions: Array.from(result.session.players) });
    deleteGame(message.from);
    return;
  }

  const updateMsg = `✅ *VALID WORD*
📝 *${result.word.toUpperCase()}* by ${result.sender.split('@')[0]}
🎯 Next: *${result.session.lastLetter.toUpperCase()}*
📊 Words: *${result.session.usedWords.size}*`;
  await message.send(updateMsg);
});
