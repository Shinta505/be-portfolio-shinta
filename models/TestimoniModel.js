import { DataTypes, Sequelize } from "sequelize";
import dbContext from "../config/Database.js";

const Testimoni = dbContext.define(
    "testimoni", {
    id_testimoni: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    nama_pengirim: {
        type: DataTypes.STRING,
        allowNull: false,
    },  
    isi_testimoni: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    tanggal_dikirim: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
    },
}, {
    tableName: "testimoni",
    timestamps: false,
    freezeTableName: true,
});

export default Testimoni;

(async () => {
    try {
        await dbContext.authenticate();
        console.log("Database connection has been established successfully.");
        await Testimoni.sync();
        console.log("Testimoni table has been synchronized successfully.");
    } catch (error) {
        console.error("Unable to connect to the database:", error);
    }
})();