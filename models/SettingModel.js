import { Sequelize } from "sequelize";
import db from "../config/database.js";

const { DataTypes } = Sequelize;

/**
 * Model SettingModel
 * Menyimpan data pengaturan web yang mencakup konfigurasi Optimasi SEO (teks meta), 
 * Kustomisasi Desain (kode warna/tema), serta pengaturan Dukungan Multi-Bahasa.
 */
const SettingModel = db.define('settings', {
    site_title: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: "Portfolio Website"
    },
    meta_description: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    meta_keywords: {
        type: DataTypes.STRING,
        allowNull: true
    },
    theme_color: {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: "#3b82f6" // Default Primary Hex Color
    },
    language: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: "id" // Dukungan Multi-Bahasa (e.g., 'id' atau 'en')
    },
    maintenance_mode: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
    }
}, {
    freezeTableName: true,
    timestamps: true
});

export default SettingModel;