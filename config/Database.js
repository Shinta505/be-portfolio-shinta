import { Sequelize } from "sequelize";
import dotenv from "dotenv";
import pg from 'pg';

dotenv.config();

const db = new Sequelize(process.env.POSTGRES_URL, {
    dialect: "postgres",
    protocol: "postgres",
    dialectModule: pg,
    dialectOptions: {
        ssl: {
            require: true,
            rejectUnauthorized: false
        }
    },
    logging: false
});

export default db;