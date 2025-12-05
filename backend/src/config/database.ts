import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();

const {
  DB_HOST,
  DB_NAME,
  DB_PASSWORD,
  DB_PORT,
  DB_USERNAME,
  DB_DIALECT,
} = process.env;

if (!DB_HOST || !DB_NAME || !DB_USERNAME || !DB_DIALECT) {
  throw new Error('Missing required database environment variables.');
}

export const sequelize = new Sequelize(DB_NAME, DB_USERNAME, DB_PASSWORD ||'', {
  host: DB_HOST,
  port: Number(DB_PORT) || 5432,
  dialect: DB_DIALECT as any, 
  logging: false,
});