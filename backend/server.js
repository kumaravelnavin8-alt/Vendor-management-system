const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;
const DB_PATH = path.join(__dirname, '../data/db.json');
const JWT_SECRET = process.env.JWT_SECRET || 'zen_vendor_default_secret_2026';

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

const startServer = async () => {
    // Initialize Database with default users
    const { ensureDB } = require('./utils/initDB');
    await ensureDB();

    app.listen(PORT, () => {
        console.log(`Kumaravel Vendor Management System Backend running on port ${PORT}`);
    });
};

// Test endpoint to check DB health (remove in production if sensitive)
app.get('/api/health', (req, res) => {
    try {
        const db = readDB();
        res.json({
            status: 'ok',
            usersCount: db.users.length,
            dbPathExists: fs.existsSync(DB_PATH)
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

startServer();
