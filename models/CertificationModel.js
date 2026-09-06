import { Sequelize } from "sequelize";
import db from "../config/database.js";

const { DataTypes } = Sequelize;

/**
 * Model Certification untuk merepresentasikan entitas data lisensi dan sertifikasi
 * dalam sistem manajemen konten (CMS) portofolio[cite: 1].
 */
const CertificationModel = db.define('certifications', {
    uuid: {
        type: DataTypes.STRING,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        validate: {
            notEmpty: true
        }
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notEmpty: true,
            len: [3, 255]
        }
    },
    issuer: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notEmpty: true
        }
    },
    issueDate: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notEmpty: true
        }
    },
    expirationDate: {
        type: DataTypes.STRING,
        allowNull: true
    },
    credentialId: {
        type: DataTypes.STRING,
        allowNull: true
    },
    credentialUrl: {
        type: DataTypes.TEXT,
        allowNull: true,
        validate: {
            isUrl: true
        }
    },
    skills: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    media: {
        type: DataTypes.TEXT,
        allowNull: true
    }
}, {
    freezeTableName: true,
    timestamps: true
});

export default CertificationModel;