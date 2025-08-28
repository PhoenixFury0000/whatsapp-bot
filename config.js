require('dotenv').config();
const isTrue = (x) => x === 'true' || x === true;

module.exports = {
    prefix: process.env.PREFIX || '.',
    owner: process.env.OWNER_NUMBER || '',
    sudo: process.env.SUDO || '',
    packname: process.env.PACKNAME || 'ɠαɾϝιҽʅɗ',
    author: process.env.AUTHOR || 'ɳαxσɾ',
    SESSION_ID: process.env.SESSION_ID || '',
    THEME: process.env.THEME || '', //Garfield
    maxFileSize: parseInt(process.env.MAX_FILE_SIZE) || 100 * 1024 * 1024,
    timezone: process.env.TIMEZONE || 'UTC',
    WORK_TYPE: process.env.WORK_TYPE || 'public',
    STATUS_REACT: isTrue(process.env.STATUS_REACT) || false, // true 
    WARN_MESSAGE: process.env.WARN_MESSAGE || '⚠️WARNING⚠️\n*User :* &mention\n*Warn :* &warn\n*Remaining :* &remaining',
    WARN_RESET_MESSAGE: process.env.WARN_RESET_MESSAGE ||
        'WARN RESET\nUser : &mention\nRemaining : &remaining',
    WARN_KICK_MESSAGE: process.env.WARN_KICK_MESSAGE ||
        '&mention kicked',
};
