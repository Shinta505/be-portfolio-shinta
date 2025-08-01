import { DataTypes } from "sequelize";
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
    persentase_keahlian: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
            min: 0,
            max: 100
        }
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
        await Skill.sync({ alter: true });
        console.log("Skill table has been synchronized successfully.");
    } catch (error) {
        console.error("Unable to connect to the database:", error);
    }
})();
