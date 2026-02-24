import pg from 'pg';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, '.env') });

const { Client } = pg;

async function setupDatabase() {
    const dbConfig = {
        user: process.env.DB_USER || 'postgres',
        password: process.env.DB_PASSWORD || 'root',
        host: process.env.DB_HOST || 'localhost',
        port: process.env.DB_PORT || 5432,
    };

    const client = new Client({
        ...dbConfig,
        database: 'postgres', // Connect to default postgres DB first
    });

    try {
        await client.connect();
        console.log('Connected to PostgreSQL server');

        const dbName = process.env.DB_NAME || 'edubuild';
        const res = await client.query(`SELECT 1 FROM pg_database WHERE datname = '${dbName}'`);

        if (res.rowCount === 0) {
            console.log(`Database "${dbName}" does not exist. Creating it...`);
            await client.query(`CREATE DATABASE ${dbName}`);
            console.log(`Database "${dbName}" created successfully.`);
        } else {
            console.log(`Database "${dbName}" already exists.`);
        }
    } catch (err) {
        console.error('Error during database setup:', err.message);
        if (err.message.includes('authentication failed')) {
            console.log('TIP: Check your DB_PASSWORD in backend/.env');
        }
    } finally {
        await client.end();
    }
}

setupDatabase();
