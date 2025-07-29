import { DataTypes, Sequelize } from "sequelize";
import dbContext from "../config/Database.js";

const Experience = dbContext.define(
    "experience", {
    id_experience: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    bidang_pekerjaan: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    nama_perusahaan: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    tahun_masuk: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    tahun_keluar: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    alamat_perusahaan: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    deskripsi_experience: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
}, {
    tableName: "experience",
    timestamps: false,
    freezeTableName: true,
});

export default Experience;

(async () => {
    try {
        await dbContext.authenticate();
        console.log("Database connection has been established successfully.");
        await Experience.sync();
        console.log("Experience table has been synchronized successfully.");
    } catch (error) {
        console.error("Unable to connect to the database:", error);
    }
})();