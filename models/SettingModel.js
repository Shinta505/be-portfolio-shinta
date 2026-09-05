import { Sequelize, DataTypes } from "sequelize";
import db from "../config/database.js";

const SettingModel = db.define('settings', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    siteTitle: {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: "Portofolio Saya"
    },
    metaDescription: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    themeColor: {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: "#3b82f6"
    },
    maintenanceMode: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
    }
}, {
    freezeTableName: true,
    timestamps: true
});

export default SettingModel;