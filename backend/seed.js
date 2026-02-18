const bcrypt = require('bcryptjs');
const fs = require('fs');
const path = require('path');

const DB_PATH = path.join(__dirname, '../data/db.json');

const seed = async () => {
    const db = JSON.parse(fs.readFileSync(DB_PATH, 'utf8'));

    // Add Admin
    const adminPassword = await bcrypt.hash('admin123', 10);
    db.users.push({
        id: 1,
        username: 'admin',
        password: adminPassword,
        role: 'admin'
    });

    // Add Sample Vendor
    const vendorPassword = await bcrypt.hash('vendor123', 10);
    db.users.push({
        id: 2,
        username: 'vendor1',
        password: vendorPassword,
        role: 'vendor',
        vendorId: 101
    });

    db.vendors.push({
        id: 101,
        vendor_name: 'Apex Solutions',
        email: 'contact@apex.com',
        phone: '123-456-7890',
        address: '123 Business St',
        status: 'ACTIVE'
    });

    fs.writeFileSync(DB_PATH, JSON.stringify(db, null, 2));
    console.log('Database seeded successfully. Admin: admin/admin123, Vendor: vendor1/vendor123');
};

seed();
