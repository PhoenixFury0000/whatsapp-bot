const { Module } = require('../lib/plugins');
const { createGame, getGame, deleteGame, addPlayer, startGame, processWord } = require('../lib/wcg');

Module({
  command: 'wcg',
  package: 'games',
  description: 'Start Word Chain Game - max 4 players'
})(async (message, match) => {
  if (!message.isGroup) return;
  if (getGame(message.from)) {
  return await message.send('_wcg is already running_');}
  const maxRounds = parseInt(match) || 20;
  const session = createGame(message.from, message.sender, maxRounds);
  const gameMsg = `🎮 *WORD CHAIN GAME*                                 
  📝 Starting: *${session.currentWord.toUpperCase()}*
  🎯 Next letter: *${session.lastLetter.toUpperCase()}*
  👥 Players: *${session.players.size}/${session.maxPlayers}*
  💬 Type *join* to play`;

  await message.send(gameMsg, { mentions: [message.sender] });
  session.timeoutId = setTimeout(() => {
    const currentSession = getGame(message.from);
    if (currentSession && !currentSession.started) {
      if (currentSession.players.size >= 2) {
        startGame(message.from);
        const startMsg = `*Game Started*

📝 Word: *${currentSession.currentWord.toUpperCase()}*
🎯 Next: *${currentSession.lastLetter.toUpperCase()}*
👥 Players: *${currentSession.players.size}*

Say a word starting with *${currentSession.lastLetter.toUpperCase()}*`;

        message.send(startMsg, { mentions: Array.from(currentSession.players) });
        currentSession.timeoutId = setTimeout(() => {
          const gameSession = getGame(message.from);
          if (gameSession) {
            if (gameSession.players.size <= 1) {
              deleteGame(message.from);
              message.send('Game ended - not enough players');
            } else {
              message.send('Game continues with remaining players');
              gameSession.timeoutId = setTimeout(() => {
                if (getGame(message.from)) {
                  deleteGame(message.from);
                  message.send('Game ended due to inactivity');
                }
              }, 30000);
            }
          }
        }, 30000);
      } else {
        deleteGame(message.from);
        message.send('Game ended due to inactivity_');
      }
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
    if (session.started) {
      return await message.reply('_Game already started_');
    }

    if (session.players.has(sender)) {
      return await message.reply('_You are already in the game_');
    }

    if (addPlayer(message.from, sender)) {
      const joinMsg = `┌─ ✅ *PLAYER JOINED*                             
│  🎪 *${sender.split('@')[0]}* joined             
│  👥 Players: *${session.players.size}/${session.maxPlayers}*
${Array.from(session.players).map(p => ` • ${p.split('@')[0]}`).join('\n')}                   │
└─`;

      await message.send(joinMsg, { mentions: Array.from(session.players) });

      if (session.players.size === 4) {
        startGame(message.from);

        const startMsg = `*Game Started*

📝 Word: *${session.currentWord.toUpperCase()}*
🎯 Next: *${session.lastLetter.toUpperCase()}*
👥 Players: *${session.players.size}*

Say a word starting with *${session.lastLetter.toUpperCase()}*`;

        await message.send(startMsg, { mentions: Array.from(session.players) });

        session.timeoutId = setTimeout(() => {
          const currentSession = getGame(message.from);
          if (currentSession) {
            if (currentSession.players.size <= 1) {
              deleteGame(message.from);
              message.send('Game ended - not enough players');
            } else {
              message.send('Game continues with remaining players');
              
              currentSession.timeoutId = setTimeout(() => {
                if (getGame(message.from)) {
                  deleteGame(message.from);
                  message.send('Game ended due to inactivity');
                }
              }, 45000);
            }
          }
        }, 30000);
        return;
      }
    } else {
      await message.reply('_Game is full (4 players max)_');
    }

    session.timeoutId = setTimeout(() => {
      const currentSession = getGame(message.from);
      if (currentSession && !currentSession.started) {
        if (currentSession.players.size >= 2) {
          startGame(message.from);

          const startMsg = `*Game Started*

📝 Word: *${currentSession.currentWord.toUpperCase()}*
🎯 Next: *${currentSession.lastLetter.toUpperCase()}*
👥 Players: *${currentSession.players.size}*

Say a word starting with *${currentSession.lastLetter.toUpperCase()}*`;

          message.send(startMsg, { mentions: Array.from(currentSession.players) });

          currentSession.timeoutId = setTimeout(() => {
            if (getGame(message.from)) {
              deleteGame(message.from);
              message.send('_Game ended due to timeout_');
            }
          }, 45000);
        } else {
          deleteGame(message.from);
          message.send('_Game ended due to inactivity_');
        }
      }
    }, 120000);
    return;
  }

  if (body === 'start') {
    if (sender !== session.starter) {
      return await message.reply('_Only the game starter can start the game_');
    }

    if (session.started) {
      return await message.reply('_Game already started_');
    }

    if (session.players.size < 2) {
      return await message.reply('_Need at least 2 players to start_');
    }

    startGame(message.from);

    const startMsg = `*Game Started*

📝 Word: *${session.currentWord.toUpperCase()}*
🎯 Next: *${session.lastLetter.toUpperCase()}*
👥 Players: *${session.players.size}*

Say a word starting with *${session.lastLetter.toUpperCase()}*`;

    await message.send(startMsg, { mentions: Array.from(session.players) });

    session.timeoutId = setTimeout(() => {
      const currentSession = getGame(message.from);
      if (currentSession) {
        if (currentSession.players.size <= 1) {
          deleteGame(message.from);
          message.send('Game ended - not enough players');
        } else {
          message.send('Game continues with remaining players');
          
          currentSession.timeoutId = setTimeout(() => {
            if (getGame(message.from)) {
              deleteGame(message.from);
              message.send('Game ended due to inactivity');
            }
          }, 30000);
        }
      }
    }, 30000);
    return;
  }

  if (!/^[a-z]{3,}$/.test(body)) return;
  if (body.startsWith('.') || body.startsWith('!') || body.startsWith('/')) return;
  if (!session.started) return;
  if (!session.players.has(sender)) return;
  const result = processWord(message.from, body, sender);
  if (!result.success) {
    let errorMsg = '';
    if (result.reason === 'invalid_word') {
      errorMsg = `"*${result.word.toUpperCase()}*" is not a valid English word`;
    } else if (result.reason === 'repeated_word') {
      errorMsg = `"*${result.word.toUpperCase()}*" was already used!`;
    } else if (result.reason === 'wrong_letter') {
      errorMsg = `"*${result.word.toUpperCase()}*" doesn't start with "*${result.expectedLetter.toUpperCase()}*"`;
    }

    await message.reply(errorMsg);

    const endMsg = `🏁 *GAME OVER*                       
💀 *${sender.split('@')[0]}* lost
⚠️  ${result.reason.replace('_', ' ')}                       
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

  session.timeoutId = setTimeout(() => {
    const currentSession = getGame(message.from);
    if (currentSession) {
      if (currentSession.players.size <= 1) {
        deleteGame(message.from);
        message.send('Game ended - not enough players');
      } else {
        message.send('Game continues with remaining players');
        
        currentSession.timeoutId = setTimeout(() => {
          if (getGame(message.from)) {
            deleteGame(message.from);
            message.send('Game ended due to inactivity');
          }
        }, 30000);
      }
    }
  }, 30000);
});
