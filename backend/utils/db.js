const fs = require('fs');
const path = require('path');
const DB_PATH = path.join(__dirname, '../../data/db.json');

const readDB = () => JSON.parse(fs.readFileSync(DB_PATH, 'utf8'));
const writeDB = (data) => fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2));

module.exports = { readDB, writeDB };
