const express = require('express');
const router = express.Router();
const { readDB, writeDB } = require('../utils/db');

router.get('/:vendorId', (req, res) => {
    const db = readDB();
    const performance = db.performance.find(p => p.vendor_id == req.params.vendorId);
    if (!performance) return res.status(404).send('Performance data not found');
    res.json(performance);
});

router.post('/calculate/:vendorId', (req, res) => {
    const db = readDB();
    const { delivery_rating, quality_rating, order_completion_rate } = req.body;

    // Simple score calculation: average of ratings
    const score = (delivery_rating + quality_rating + (order_completion_rate / 10)) / 3;

    const index = db.performance.findIndex(p => p.vendor_id == req.params.vendorId);
    const newPerformance = {
        vendor_id: parseInt(req.params.vendorId),
        delivery_rating,
        quality_rating,
        order_completion_rate,
        score: parseFloat(score.toFixed(2)),
        last_updated: new Date().toISOString()
    };

    if (index === -1) {
        db.performance.push(newPerformance);
    } else {
        db.performance[index] = newPerformance;
    }

    writeDB(db);
    res.json(newPerformance);
});

module.exports = router;
