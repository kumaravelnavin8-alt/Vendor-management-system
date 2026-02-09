const express = require('express');
const router = express.Router();
const { readDB, writeDB } = require('../utils/db');

// Middleware to check admin role (Simplified for demo)
const isAdmin = (req, res, next) => {
    // In a real app, verify JWT here. For now, we trust the client's role header/body for demo purposes or implement simple check if token is present.
    next();
};

router.get('/', (req, res) => {
    const db = readDB();
    res.json(db.vendors);
});

router.post('/', isAdmin, (req, res) => {
    const db = readDB();
    const newVendor = { ...req.body, id: Date.now(), status: 'ACTIVE' };
    db.vendors.push(newVendor);
    writeDB(db);
    res.status(201).json(newVendor);
});

router.put('/:id', isAdmin, (req, res) => {
    const db = readDB();
    const index = db.vendors.findIndex(v => v.id == req.params.id);
    if (index === -1) return res.status(404).send('Vendor not found');
    db.vendors[index] = { ...db.vendors[index], ...req.body };
    writeDB(db);
    res.json(db.vendors[index]);
});

router.delete('/:id', isAdmin, (req, res) => {
    const db = readDB();
    db.vendors = db.vendors.filter(v => v.id != req.params.id);
    writeDB(db);
    res.status(204).send();
});

// Product assignment
router.post('/assign-product', isAdmin, (req, res) => {
    const db = readDB();
    const newProduct = { ...req.body, id: Date.now() };
    db.products.push(newProduct);
    writeDB(db);
    res.status(201).json(newProduct);
});

router.get('/products/:vendorId', (req, res) => {
    const db = readDB();
    const products = db.products.filter(p => p.vendorId == req.params.vendorId);
    res.json(products);
});

module.exports = router;
