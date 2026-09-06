import { Sequelize } from "sequelize";
import db from "../config/database.js";

const { DataTypes } = Sequelize;

/**
 * Model SkillModel merepresentasikan tabel 'skills' di database Supabase PostgreSQL.
 * Berfungsi untuk menyimpan data keahlian dan teknologi (seperti Frontend, Backend, Tools, Database) 
 * yang ditampilkan pada halaman khusus skills dan teknologi[cite: 1].
 */
const SkillModel = db.define('skills', {
    uuid: {
        type: DataTypes.STRING,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        primaryKey: true,
        validate: {
            notEmpty: true
        }
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notEmpty: true,
            len: [1, 100]
        }
    },
    category: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notEmpty: true
        }
    },
    icon: {
        type: DataTypes.STRING,
        allowNull: true
    }
}, {
    freezeTableName: true,
    timestamps: true
});

export default SkillModel;