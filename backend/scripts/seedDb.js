import pg from 'pg';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, '../.env') });

const { Client } = pg;

async function seedDatabase() {
    const client = new Client({
        user: process.env.DB_USER || 'postgres',
        password: process.env.DB_PASSWORD || 'root',
        host: process.env.DB_HOST || 'localhost',
        port: process.env.DB_PORT || 5432,
        database: process.env.DB_NAME || 'edubuild',
    });

    try {
        await client.connect();
        console.log('Connected to edubuild database');

        // Check if projects already exist
        const checkRes = await client.query('SELECT COUNT(*) FROM "edubuild_projects"');
        if (parseInt(checkRes.rows[0].count) > 0) {
            console.log('Projects already exist in database. Skipping seed.');
            return;
        }

        const sqlPath = path.join(__dirname, '../insert_projects.sql');
        const sql = fs.readFileSync(sqlPath, 'utf8');

        console.log('Seeding projects...');
        await client.query(sql);
        console.log('Projects seeded successfully!');

    } catch (err) {
        console.error('Error during seeding:', err.message);
    } finally {
        await client.end();
    }
}

seedDatabase();
