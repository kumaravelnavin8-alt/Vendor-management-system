const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');

const DB_DIR = path.join(__dirname, '../../data');
const DB_PATH = path.join(DB_DIR, 'db.json');

const ensureDB = async () => {
    if (!fs.existsSync(DB_DIR)) {
        fs.mkdirSync(DB_DIR, { recursive: true });
    }

    if (!fs.existsSync(DB_PATH) || fs.readFileSync(DB_PATH, 'utf8').trim() === '') {
        console.log('Database missing or empty. Seeding default data...');
        const adminPassword = await bcrypt.hash('admin123', 10);
        const vendorPassword = await bcrypt.hash('vendor123', 10);

        const initialData = {
            users: [
                { id: 1, username: 'admin', password: adminPassword, role: 'admin' },
                { id: 2, username: 'vendor1', password: vendorPassword, role: 'vendor', vendorId: 101 }
            ],
            vendors: [
                { id: 101, vendor_name: 'Apex Solutions', email: 'contact@apex.com', phone: '123-456-7890', address: '123 Business St', status: 'ACTIVE' }
            ],
            products: [],
            payments: [],
            performance: []
        };

        fs.writeFileSync(DB_PATH, JSON.stringify(initialData, null, 2));
        console.log('Default data seeded successfully.');
    }
};

module.exports = { ensureDB };
