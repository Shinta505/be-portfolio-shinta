import { Sequelize } from "sequelize";
import db from "../config/database.js";

const { DataTypes } = Sequelize;

/**
 * Model Sequelize untuk entitas Experience (Riwayat Pekerjaan) 
 * yang mencakup posisi, perusahaan, jenis lokasi, jenis pekerjaan, 
 * periode waktu, deskripsi, keahlian, serta media pendukung 
 * (seperti dokumen PDF, foto sertifikat, atau lampiran bukti kerja)[cite: 1].
 */
const ExperienceModel = db.define('experiences', {
    uuid: {
        type: DataTypes.STRING,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        validate: {
            notEmpty: true
        }
    },
    position: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notEmpty: true
        }
    },
    company: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notEmpty: true
        }
    },
    location: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notEmpty: true
        }
    },
    location_type: {
        type: DataTypes.ENUM('Di lokasi', 'Gabungan', 'Jarak Jauh'),
        allowNull: false,
        defaultValue: 'Di lokasi'
    },
    employment_type: {
        type: DataTypes.ENUM('Penuh Waktu', 'Paruh Waktu', 'Pekerja Mandiri', 'Pekerja Lepas', 'Kontrak'),
        allowNull: false,
        defaultValue: 'Penuh Waktu'
    },
    start_date: {
        type: DataTypes.STRING, // Format bulan dan tahun mulai (contoh: "Januari 2023")
        allowNull: false,
        validate: {
            notEmpty: true
        }
    },
    end_date: {
        type: DataTypes.STRING, // Format bulan dan tahun berakhir atau "Sekarang"
        allowNull: true
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: false,
        validate: {
            notEmpty: true
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
    freezeTableName: true
});

export default ExperienceModel;