const fs = require('fs-extra');
const { Sequelize } = require('sequelize');
if (fs.existsSync('set.env'))
    require('dotenv').config({ path: __dirname + '/set.env' });
const path = require("path");
const databasePath = path.join(__dirname, './database.db');
const DATABASE_URL = process.env.DATABASE_URL === undefined
    ? databasePath
    : process.env.DATABASE_URL;
module.exports = { session: process.env.SESSION_ID || 'eyJub2lzZUtleSI6eyJwcml2YXRlIjp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoiR0dFcDM2VWVlR1FhQXJmNDI1a2VsNVNKblN3T2h5SERrRlBiaE5aSHhXOD0ifSwicHVibGljIjp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoiWnlaSTVmblExeHhOUUVsczFPaGw2VGxwVTBqUXE3SHZQOVJ1QjRXMzdDOD0ifX0sInBhaXJpbmdFcGhlbWVyYWxLZXlQYWlyIjp7InByaXZhdGUiOnsidHlwZSI6IkJ1ZmZlciIsImRhdGEiOiJlS05IOHVqZ1NGYXRyME5DOHhoRy9wZ1drbTJRMUE5bk9UUG51cElVdVZJPSJ9LCJwdWJsaWMiOnsidHlwZSI6IkJ1ZmZlciIsImRhdGEiOiJvU1JpUzljUXJwYTZPYzZ1WlgvYXpjaHdvZ0tpbmZhVjExYlNRYmc0MWx3PSJ9fSwic2lnbmVkSWRlbnRpdHlLZXkiOnsicHJpdmF0ZSI6eyJ0eXBlIjoiQnVmZmVyIiwiZGF0YSI6ImVHZWZnZmFVcG8yYThjUThTdnFucXQzUkxHOGtVM0YyeTU2TDlSWDVPR0U9In0sInB1YmxpYyI6eyJ0eXBlIjoiQnVmZmVyIiwiZGF0YSI6Iis3SUFaUWQrME15UnUzMWwwQ2poNFpmV2ZVOGRwR3pQR1NScE9jWXBOaGM9In19LCJzaWduZWRQcmVLZXkiOnsia2V5UGFpciI6eyJwcml2YXRlIjp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoicUZhMXVIY29BcC9JM3NqTUZSbWd3bWt5RXZDOXFGV0RTZEt0Y0lNdzBtOD0ifSwicHVibGljIjp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoiYUdEWHVES3ZUcjFrUkU2SUR6QzhIQ1RLRktGbFlDcjdZT1lzQzFHa1N5ND0ifX0sInNpZ25hdHVyZSI6eyJ0eXBlIjoiQnVmZmVyIiwiZGF0YSI6Ik1qcmFacDRqZG15Lzg5N21teWVnZW5jNEZmNGt1NjZkZjdrTXBsMjRWeUR2dlJEQi9LMFZxM2pLYzlabmoxRlRnM3ZUdER3UnhDcE5qUUNkSXhHY2dRPT0ifSwia2V5SWQiOjF9LCJyZWdpc3RyYXRpb25JZCI6MTM3LCJhZHZTZWNyZXRLZXkiOiJwaEd4NStadkdiS3M0ZGd0VUo1ZEtsK1h3OGV3TUVwL3Z0WW92QlRPb0ZrPSIsInByb2Nlc3NlZEhpc3RvcnlNZXNzYWdlcyI6W3sia2V5Ijp7InJlbW90ZUppZCI6IjIyMTc3Mjg2MDg2OEBzLndoYXRzYXBwLm5ldCIsImZyb21NZSI6dHJ1ZSwiaWQiOiI0QzUzRjdBODc0QjFGNDQ4QTNFMkVDOTk0QzIzMkFCOCJ9LCJtZXNzYWdlVGltZXN0YW1wIjoxNzUxMzI1MzQ1fSx7ImtleSI6eyJyZW1vdGVKaWQiOiIyMjE3NzI4NjA4NjhAcy53aGF0c2FwcC5uZXQiLCJmcm9tTWUiOnRydWUsImlkIjoiRkMwM0U0NjMyNzYxQ0E2ODY0MEVFQjExREMwNzMzOUIifSwibWVzc2FnZVRpbWVzdGFtcCI6MTc1MTMyNTM1MH1dLCJuZXh0UHJlS2V5SWQiOjMxLCJmaXJzdFVudXBsb2FkZWRQcmVLZXlJZCI6MzEsImFjY291bnRTeW5jQ291bnRlciI6MSwiYWNjb3VudFNldHRpbmdzIjp7InVuYXJjaGl2ZUNoYXRzIjp0cnVlfSwicmVnaXN0ZXJlZCI6dHJ1ZSwicGFpcmluZ0NvZGUiOiJYSDlFVjdMVCIsIm1lIjp7ImlkIjoiMjIxNzcyODYwODY4OjQxQHMud2hhdHNhcHAubmV0IiwibmFtZSI6IkRGYWNlIiwibGlkIjoiMjExNDgwNDgxOTMxMjczOjQxQGxpZCJ9LCJhY2NvdW50Ijp7ImRldGFpbHMiOiJDS0xjdEk0RkVKQzFqTU1HR0FJZ0FDZ0EiLCJhY2NvdW50U2lnbmF0dXJlS2V5IjoiK2JFdXZtaWJacjJVbDIvSmlCRWJqN2FTUUUrWWFVMTNsVkRuWktFUytqZz0iLCJhY2NvdW50U2lnbmF0dXJlIjoiSkJIaDZmU29nNUw0Tmd6TlB6SlA2aUJ6Vm1iVFBrTkhPOEZ4ZDRGTCtQMlhiamFvWEc1VHpCSTlDODdCcVh2MFNUSnZlZGJRRThjZ001bWU3UXV5RGc9PSIsImRldmljZVNpZ25hdHVyZSI6ImVKamEwd2JxSDJXZ252UTFQK3NLZlN5SUsvaWh3WDBQK2JUYXpEZXRhcHVzY0dwRHY2bjY4TUdXRm13OWExditGVXVwSkoxS1I5YWxGTUhCeURaUWlnPT0ifSwic2lnbmFsSWRlbnRpdGllcyI6W3siaWRlbnRpZmllciI6eyJuYW1lIjoiMjIxNzcyODYwODY4OjQxQHMud2hhdHNhcHAubmV0IiwiZGV2aWNlSWQiOjB9LCJpZGVudGlmaWVyS2V5Ijp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoiQmZteExyNW9tMmE5bEpkdnlZZ1JHNCsya2tCUG1HbE5kNVZRNTJTaEV2bzQifX1dLCJwbGF0Zm9ybSI6InNtYmEiLCJyb3V0aW5nSW5mbyI6eyJ0eXBlIjoiQnVmZmVyIiwiZGF0YSI6IkNBSUlDQT09In0sImxhc3RBY2NvdW50U3luY1RpbWVzdGFtcCI6MTc1MTMyNTM0MiwibGFzdFByb3BIYXNoIjoiMkc0QW11IiwibXlBcHBTdGF0ZUtleUlkIjoiQUFBQUFMZkgifQ==',
    PREFIXE: process.env.PREFIX || ".",
    OWNER_NAME: process.env.OWNER_NAME || "Douzy 😈",
    NUMERO_OWNER : process.env.NUMERO_OWNER || "221772860868",              
    AUTO_READ_STATUS: process.env.AUTO_READ_STATUS || "yes",
    AUTO_DOWNLOAD_STATUS: process.env.AUTO_DOWNLOAD_STATUS || 'no',
    BOT : process.env.BOT_NAME || 'B.M.B-TECH',
    URL : process.env.BOT_MENU_LINKS || 'https://files.catbox.moe/hvi870.jpg',
    MODE: process.env.PUBLIC_MODE || "yes",
    PM_PERMIT: process.env.PM_PERMIT || 'yes',
    HEROKU_APP_NAME : process.env.HEROKU_APP_NAME,
    HEROKU_APY_KEY : process.env.HEROKU_APY_KEY ,
    WARN_COUNT : process.env.WARN_COUNT || '1' ,
    ETAT : process.env.PRESENCE || '',
    ANTICALL : process.env.ANTICALL || 'yes',   
    AUTO_BIO : process.env.AUTO_BIO || 'yes',               
    DP : process.env.STARTING_BOT_MESSAGE || "yes",
    ANTIDELETE1 : process.env.ANTI_DELETE_MESSAGE || 'yes',
    AUTO_REACT : process.env.AUTO_REACT || 'no',
    AUTO_REACT : process.env.AUTO_REACT || 'no',              
    AUTO_REACT_STATUS : process.env.AUTO_REACT_STATUS || 'yes',
    AUTO_READ : process.env.AUTO_READ || 'no',
    DATABASE_URL,
    DATABASE: DATABASE_URL === databasePath
        ? "postgresql://postgres:bKlIqoOUWFIHOAhKxRWQtGfKfhGKgmRX@viaduct.proxy.rlwy.net:47738/railway" : "postgresql://postgres:bKlIqoOUWFIHOAhKxRWQtGfKfhGKgmRX@viaduct.proxy.rlwy.net:47738/railway",
   
};
let fichier = require.resolve(__filename);
fs.watchFile(fichier, () => {
    fs.unwatchFile(fichier);
    console.log(`mise à jour ${__filename}`);
    delete require.cache[fichier];
    require(fichier);
});

