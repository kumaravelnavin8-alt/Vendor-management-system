const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;
const DB_PATH = path.join(__dirname, '../data/db.json');

app.use(cors());
app.use(bodyParser.json());

// Initialize Database with default users
const { ensureDB } = require('./utils/initDB');
ensureDB();

// Helper to read/write DB
const readDB = () => JSON.parse(fs.readFileSync(DB_PATH, 'utf8'));
const writeDB = (data) => fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2));

// Auth routes
const authRoutes = require('./routes/auth');
app.use('/api/auth', authRoutes);

// Vendor routes
app.use('/api/vendors', require('./routes/vendors'));

// Payment routes
app.use('/api/payments', require('./routes/payments'));

// Performance routes
app.use('/api/performance', require('./routes/performance'));

// Serve static frontend files
app.use(express.static(path.join(__dirname, '../')));

// Handle root route
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../index.html'));
});

app.listen(PORT, () => {
    console.log(`ZenVendor Backend running on port ${PORT}`);
});
