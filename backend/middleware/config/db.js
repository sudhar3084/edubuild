import { Sequelize } from 'sequelize';

console.log('📋 Database Config:');
console.log('  DB_NAME:', process.env.DB_NAME || 'edubuild');
console.log('  DB_USER:', process.env.DB_USER || 'postgres');
console.log('  DB_PASSWORD:', process.env.DB_PASSWORD ? '***' : 'root');
console.log('  DB_HOST:', process.env.DB_HOST || 'localhost');
console.log('  DB_PORT:', process.env.DB_PORT || 5432);

const sequelize = new Sequelize(
  process.env.DB_NAME || 'edubuild',
  process.env.DB_USER || 'postgres',
  process.env.DB_PASSWORD || 'root',
  {
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 5432,
    dialect: 'postgres',
    logging: process.env.NODE_ENV === 'development' ? console.log : false,
    dialectOptions: {
      connectTimeoutMillis: 10000,
    },
  }
);

const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ PostgreSQL connected successfully');
    // Sync models with database (creates tables if they don\'t exist)
    await sequelize.sync({ alter: process.env.NODE_ENV === 'development' });
    console.log('✅ Database tables synchronized');
  } catch (error) {
    console.error('❌ PostgreSQL connection failed:', error.message);
    process.exit(1);
  }
};

export { sequelize, connectDB };

