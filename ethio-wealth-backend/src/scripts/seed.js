const pool = require('../config/db');

const seedData = async () => {
    try {
        console.log('Seeding categories...');

        const categories = [
            { name: 'Food & Drinks', type: 'expense', icon: 'FaUtensils' },
            { name: 'Shopping', type: 'expense', icon: 'FaShoppingBag' },
            { name: 'Transport', type: 'expense', icon: 'FaBus' },
            { name: 'Bills', type: 'expense', icon: 'FaFileInvoiceDollar' },
            { name: 'Health', type: 'expense', icon: 'FaNotesMedical' },
            { name: 'Entertainment', type: 'expense', icon: 'FaFilm' },
            { name: 'Salary', type: 'income', icon: 'FaMoneyBillWave' },
            { name: 'Business', type: 'income', icon: 'FaBriefcase' },
        ];

        for (const cat of categories) {
            const check = await pool.query('SELECT * FROM categories WHERE name = $1', [cat.name]);
            if (check.rows.length === 0) {
                await pool.query(
                    'INSERT INTO categories (name, type, icon_slug) VALUES ($1, $2, $3)',
                    [cat.name, cat.type, cat.icon]
                );
                console.log(`Added category: ${cat.name}`);
            }
        }

        console.log('Seeding completed successfully!');
        process.exit(0);
    } catch (error) {
        console.error('Error seeding data:', error);
        process.exit(1);
    }
};

seedData();
