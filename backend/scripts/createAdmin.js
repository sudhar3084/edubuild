import pg from 'pg';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import path from 'path';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, '../.env') });

const { Client } = pg;

async function insertAdmin() {
    const client = new Client({
        user: process.env.DB_USER || 'postgres',
        password: process.env.DB_PASSWORD || 'root',
        host: process.env.DB_HOST || 'localhost',
        port: process.env.DB_PORT || 5432,
        database: process.env.DB_NAME || 'edubuild',
    });

    try {
        await client.connect();

        // Check if admin already exists
        const checkRes = await client.query("SELECT id FROM edubuild_users WHERE email = 'admin@edubuild.com'");
        if (checkRes.rowCount > 0) {
            console.log('Admin already exists.');
            return;
        }

        const sql = `
      INSERT INTO "edubuild_users" (id, name, email, password, role, school, state, "createdAt", "updatedAt")
      VALUES 
      (
        '550e8400-e29b-41d4-a716-446655440002',
        'Admin User',
        'admin@edubuild.com',
        '$2a$10$UQJl2U/v6lx0zVHxQ7o/meMF.6xLBjPKwMl.5nVKUETBYQzPTtpGW',
        'admin',
        'Central School',
        'Delhi',
        NOW(),
        NOW()
      );
    `;

        await client.query(sql);
        console.log('Admin user created successfully! (Email: admin@edubuild.com, Password: admin123)');
    } catch (err) {
        console.error('Error:', err.message);
    } finally {
        await client.end();
    }
}

insertAdmin();
