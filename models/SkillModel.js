import { DataTypes, Sequelize } from "sequelize";
import dbContext from "../config/Database.js";

const Skill = dbContext.define(
    "skill", {
    id_skill: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    nama_skill: {
        type: DataTypes.STRING,
        allowNull: false,
    }, 
    tingkat_keahlian: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    }, {
    tableName: "skill",
    timestamps: false,
    freezeTableName: true,
});

export default Skill;

(async () => {
    try {
        await dbContext.authenticate();
        console.log("Database connection has been established successfully.");
        await Skill.sync();
        console.log("Skill table has been synchronized successfully.");
    } catch (error) {
        console.error("Unable to connect to the database:", error);
    }
})();