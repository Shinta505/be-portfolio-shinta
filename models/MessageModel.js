import { Sequelize } from "sequelize";
import db from "../config/database.js";

const { DataTypes } = Sequelize;

/**
 * @file MessageModel.js
 * @description Model Sequelize untuk entitas Pesan (Message).
 * Berfungsi sebagai representasi tabel 'messages' di database PostgreSQL (Supabase) 
 * guna menyimpan riwayat pesan masuk dari pengunjung melalui fitur Formulir Kontak[cite: 1].
 */
const MessageModel = db.define('messages', {
    uuid: {
        type: DataTypes.UUID,
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
            len: [2, 100]
        }
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notEmpty: true,
            isEmail: true
        }
    },
    message: {
        type: DataTypes.TEXT,
        allowNull: false,
        validate: {
            notEmpty: true
        }
    }
}, {
    freezeTableName: true,
    timestamps: true // Otomatis membuat kolom createdAt dan updatedAt
});

export default MessageModel;