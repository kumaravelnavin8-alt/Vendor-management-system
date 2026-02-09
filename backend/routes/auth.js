const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { readDB, writeDB } = require('../utils/db');

router.post('/register', async (req, res) => {
    const { username, password, role, vendorId } = req.body;
    const db = readDB();

    if (db.users.find(u => u.username === username)) {
        return res.status(400).send('User already exists');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = { id: Date.now(), username, password: hashedPassword, role, vendorId };
    db.users.push(newUser);
    writeDB(db);

    res.status(201).send('User registered');
});

router.post('/login', async (req, res) => {
    const { username, password } = req.body;
    const db = readDB();
    const user = db.users.find(u => u.username === username);

    if (!user || !(await bcrypt.compare(password, user.password))) {
        return res.status(401).send('Invalid credentials');
    }

    const token = jwt.sign({ id: user.id, role: user.role, vendorId: user.vendorId }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ token, role: user.role, vendorId: user.vendorId, username: user.username });
});

module.exports = router;
