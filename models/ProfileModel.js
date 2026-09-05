import { Sequelize } from "sequelize";
import db from "../config/database.js";

const { DataTypes } = Sequelize;

const ProfileModel = db.define('profiles', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notEmpty: true
        }
    },
    title: {
        type: DataTypes.STRING,
        allowNull: true,
        comment: 'Contoh: Full Stack Developer / UI UX Designer'
    },
    bio: {
        type: DataTypes.TEXT,
        allowNull: true,
        comment: 'Biografi singkat atau cerita latar belakang'
    },
    profile_image: {
        type: DataTypes.STRING,
        allowNull: true,
        comment: 'URL atau path foto profil'
    },
    education: {
        type: DataTypes.TEXT,
        allowNull: true,
        comment: 'Informasi latar belakang pendidikan (bisa format JSON string atau teks)'
    },
    experience: {
        type: DataTypes.TEXT,
        allowNull: true,
        comment: 'Informasi pengalaman profesional'
    },
    social_links: {
        type: DataTypes.TEXT,
        allowNull: true,
        comment: 'Tautan integrasi media sosial (bisa disimpan dalam format JSON string)'
    }
}, {
    freezeTableName: true,
    timestamps: true
});

export default ProfileModel;