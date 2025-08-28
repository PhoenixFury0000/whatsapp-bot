const fetch = require('node-fetch');

let word_list = new Set();
const games = new Map();
async function loadWords() {
  try {
    const response = await fetch('https://rawcdn.githack.com/dwyl/english-words/20f5cc9b3f0ccc8ce45d814c532b7c2031bba31c/words_alpha.txt');
    const text = await response.text();
    const words = text.split('\n').map(word => word.trim().toLowerCase()).filter(word => word.length >= 3);
    word_list = new Set(words);
    console.log(`${word_list.size}`);
  } catch (error) {
    console.error(error);
  }
}

function getRandomWord() {
const words_array = Array.from(word_list);
return words_array[Math.floor(Math.random() * words_array.length)];
}

function isValidWord(word) {
return word_list.has(word.toLowerCase());
}

function createGame(from, starter, maxRounds) {
  const startWord = getRandomWord();
  const session = {
    starter: starter,
    players: new Set([starter]),
    usedWords: new Set([startWord]),
    currentWord: startWord,
    lastLetter: startWord.slice(-1),
    round: 1,
    maxRounds: maxRounds || 20,
    timeoutId: null,
    started: false,
    maxPlayers: 4
  };
  games.set(from, session);
  return session;
}

function getGame(from) {
return games.get(from);
}

function deleteGame(from) {
  const session = games.get(from);
  if (session && session.timeoutId) {
  clearTimeout(session.timeoutId);}
  games.delete(from);
}

function addPlayer(from, player) {
  const session = games.get(from);
  if (session && session.players.size < session.maxPlayers) {
  session.players.add(player);
  return true;
  }
  return false;
}

function startGame(from) {
  const session = games.get(from);
  if (session) {
  session.started = true;
  return true;
  }
  return false;
}

function removePlayer(from, player) {
  const session = games.get(from);
  if (session && session.players.has(player)) {
  session.players.delete(player);
  return session.players.size;
  }
  return 0;
}

function processWord(from, word, sender) {
  const session = games.get(from);
  if (!session) return { success: false, reason: 'no_game' };
  if (!session.started) return { success: false, reason: 'not_started' };
  if (!isValidWord(word)) {
  return { success: false, reason: 'invalid_word', word: word };
  }

  if (session.usedWords.has(word)) {
  return { success: false, reason: 'repeated_word', word: word };
  }
  if (word[0] !== session.lastLetter) {
  return { success: false, reason: 'wrong_letter', word: word, expectedLetter: session.lastLetter };
  }

  session.usedWords.add(word);
  session.currentWord = word;
  session.lastLetter = word.slice(-1);
  session.round++;
  if (session.round > session.maxRounds) {
  return { success: true, gameComplete: true, word: word, sender: sender, session: session };
  }
  return { success: true, gameComplete: false, word: word, sender: sender, session: session };
 }

loadWords();
module.exports = {
  createGame,
  getGame,
  deleteGame,
  addPlayer,
  removePlayer,
  startGame,
  processWord,
  isValidWord
};
                
