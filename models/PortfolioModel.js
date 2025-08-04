import { DataTypes, Sequelize } from "sequelize";
import dbContext from "../config/Database.js";

const Portfolio = dbContext.define(
    "portfolio", {
    id_portfolio: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    judul_portfolio: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    deskripsi_portfolio: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    gambar_portfolio: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    link_portfolio: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    link_github: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    tanggal_dibuat: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
    },
}, {
    tableName: "portfolio",
    timestamps: false,
    freezeTableName: true,
});

export default Portfolio;

(async () => {
    try {
        await dbContext.authenticate();
        console.log("Database connection has been established successfully.");
        await Portfolio.sync({ alter: true });
        console.log("Portfolio table has been synchronized successfully.");
    } catch (error) {
        console.error("Unable to connect to the database:", error);
    }
})();
