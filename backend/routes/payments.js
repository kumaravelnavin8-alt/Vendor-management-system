const express = require('express');
const router = express.Router();
const { readDB, writeDB } = require('../utils/db');

router.get('/', (req, res) => {
    const db = readDB();
    res.json(db.payments);
});

router.post('/', (req, res) => {
    const db = readDB();
    const newPayment = { ...req.body, id: Date.now(), status: 'PENDING' };
    db.payments.push(newPayment);
    writeDB(db);
    res.status(201).json(newPayment);
});

router.put('/:id/status', (req, res) => {
    const db = readDB();
    const index = db.payments.findIndex(p => p.id == req.params.id);
    if (index === -1) return res.status(404).send('Payment not found');
    db.payments[index].status = req.body.status;
    writeDB(db);
    res.json(db.payments[index]);
});

router.get('/vendor/:vendorId', (req, res) => {
    const db = readDB();
    const payments = db.payments.filter(p => p.vendorId == req.params.vendorId);
    res.json(payments);
});

module.exports = router;
