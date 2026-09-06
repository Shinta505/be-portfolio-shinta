import { DataTypes } from "sequelize";
import db from "../config/database.js";

const ProfileModel = db.define('profiles', {
    uuid: {
        type: DataTypes.STRING,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        primaryKey: true,
        unique: true
    },
    fullname: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notEmpty: true
        }
    },
    headline: {
        type: DataTypes.STRING,
        allowNull: true
    },
    bio: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    profile_image: {
        type: DataTypes.STRING,
        allowNull: true
    },
    location: {
        type: DataTypes.STRING,
        allowNull: true
    },
    email: {
        type: DataTypes.STRING,
        allowNull: true,
        validate: {
            isEmail: true
        }
    },
    github_url: {
        type: DataTypes.STRING,
        allowNull: true
    },
    linkedin_url: {
        type: DataTypes.STRING,
        allowNull: true
    },
    instagram_url: {
        type: DataTypes.STRING,
        allowNull: true
    },
    tiktok_url: {
        type: DataTypes.STRING,
        allowNull: true
    },
    twitter_url: {
        type: DataTypes.STRING,
        allowNull: true
    }
}, {
    freezeTableName: true,
    timestamps: true
});

export default ProfileModel;