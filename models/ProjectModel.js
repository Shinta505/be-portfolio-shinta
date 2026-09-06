import { Sequelize, DataTypes } from "sequelize";
import db from "../config/database.js";

/**
 * Model Project untuk merepresentasikan tabel 'projects' di database Supabase PostgreSQL.
 * Menyimpan data galeri karya/projek lengkap dengan judul, deskripsi, tools, serta tautan terkait.
 */
const ProjectModel = db.define(
    "projects", {
        uuid: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            allowNull: false,
            primaryKey: true,
            validate: {
                notEmpty: true,
            },
        },
        title: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notEmpty: true,
                len: [3, 255],
            },
        },
        slug: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
            validate: {
                notEmpty: true,
            },
        },
        category: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notEmpty: true,
            },
        },
        description: {
            type: DataTypes.TEXT,
            allowNull: false,
            validate: {
                notEmpty: true,
            },
        },
        tools: {
            type: DataTypes.TEXT, // Disimpan sebagai string terpisah koma atau format JSON
            allowNull: false,
            validate: {
                notEmpty: true,
            },
        },
        image: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        github_url: {
            type: DataTypes.STRING,
            allowNull: true,
            validate: {
                isUrl: true,
            },
        },
        figma_url: {
            type: DataTypes.STRING,
            allowNull: true,
            validate: {
                isUrl: true,
            },
        },
        website_url: {
            type: DataTypes.STRING,
            allowNull: true,
            validate: {
                isUrl: true,
            },
        },
    }, {
        freezeTableName: true,
        timestamps: true,
    }
);

export default ProjectModel;