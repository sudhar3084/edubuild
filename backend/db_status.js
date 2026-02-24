import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';
dotenv.config();

const sequelize = new Sequelize(
    process.env.DB_NAME || 'edubuild',
    process.env.DB_USER || 'postgres',
    process.env.DB_PASSWORD || 'root',
    {
        host: process.env.DB_HOST || 'localhost',
        dialect: 'postgres',
        logging: false
    }
);

async function checkDatabase() {
    try {
        await sequelize.authenticate();
        console.log('✅ Connection to PostgreSQL has been established successfully.');

        // Check Tables
        const [results] = await sequelize.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
    `);

        console.log('\n📊 Database Tables:');
        console.table(results.map(r => r.table_name));

        // Check Project Count
        const [count] = await sequelize.query('SELECT count(*) FROM "edubuild_projects"');
        console.log(`\n📚 Total Projects: ${count[0].count}`);

        // Check User Count
        const [userCount] = await sequelize.query('SELECT count(*) FROM "edubuild_users"');
        console.log(`👤 Total Users: ${userCount[0].count}`);

    } catch (error) {
        console.error('❌ Unable to connect to the database:', error);
    } finally {
        await sequelize.close();
    }
}

checkDatabase();
