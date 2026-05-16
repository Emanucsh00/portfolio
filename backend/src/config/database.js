import dotenv from 'dotenv';
import { Sequelize } from 'sequelize';

dotenv.config();

const {
  NODE_ENV,
  DATABASE_URL,
  DB_DIALECT = 'postgres',
  DB_HOST = '127.0.0.1',
  DB_PORT = '5432',
  DB_NAME = 'portfolio_db',
  DB_USER = 'root',
  DB_PASSWORD = ''
} = process.env;

const sslOptions = NODE_ENV === 'production'
  ? { dialectOptions: { ssl: { require: true, rejectUnauthorized: false } } }
  : {};

export const sequelize = DATABASE_URL
  ? new Sequelize(DATABASE_URL, {
      dialect: DB_DIALECT || 'postgres',
      logging: false,
      ...sslOptions
    })
  : new Sequelize(DB_NAME, DB_USER, DB_PASSWORD, {
      host: DB_HOST,
      port: Number(DB_PORT),
      dialect: DB_DIALECT,
      logging: false
    });

export async function connectDatabase() {
  await sequelize.authenticate();
  return sequelize;
}
