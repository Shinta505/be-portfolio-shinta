import { Sequelize } from "sequelize";
import db from "../config/database.js";

const { DataTypes } = Sequelize;

const ProjectModel = db.define('project', {
    uuid: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        validate: {
            notEmpty: true
        }
    },
    title: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notEmpty: true,
            len: [3, 255]
        }
    },
    category: {
        type: DataTypes.ENUM('UI/UX Design', 'Website Development', 'Mobile Development', 'Sekretaris', 'Project Lain'),
        allowNull: false,
        validate: {
            notEmpty: true
        }
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    imageUrl: {
        type: DataTypes.STRING,
        allowNull: true
    },
    projectUrl: {
        type: DataTypes.STRING,
        allowNull: true
    }
}, {
    freezeTableName: true
});

export default ProjectModel;