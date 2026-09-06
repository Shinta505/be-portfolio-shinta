import { Sequelize } from "sequelize";
import db from "../config/database.js";

const { DataTypes } = Sequelize;

/**
 * EducationModel merepresentasikan tabel riwayat pendidikan pada database PostgreSQL (Supabase)[cite: 1].
 * Digunakan untuk mengelola data pendidikan formal dalam sistem portofolio dan CMS[cite: 1].
 */
const EducationModel = db.define('educations', {
    uuid: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        primaryKey: true
    },
    institution_logo: {
        type: DataTypes.STRING,
        allowNull: true,
        comment: "Logo atau ikon institusi pendidikan[cite: 1]"
    },
    institution_name: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notEmpty: true
        },
        comment: "Nama institusi atau sekolah/universitas[cite: 1]"
    },
    degree: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notEmpty: true
        },
        comment: "Gelar akademik (misal: S.Kom, Sarjana Komputer)[cite: 1]"
    },
    field_of_study: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notEmpty: true
        },
        comment: "Bidang studi atau jurusan (misal: Teknik Informatika)[cite: 1]"
    },
    start_date: {
        type: DataTypes.STRING,
        allowNull: false,
        comment: "Bulan dan tahun mulai pendidikan[cite: 1]"
    },
    end_date: {
        type: DataTypes.STRING,
        allowNull: true,
        comment: "Bulan dan tahun berakhir atau lulus (kosongkan jika masih berlangsung)[cite: 1]"
    },
    score: {
        type: DataTypes.STRING,
        allowNull: true,
        comment: "Nilai akhir, IPK, atau GPA[cite: 1]"
    },
    activities: {
        type: DataTypes.TEXT,
        allowNull: true,
        comment: "Aktivitas dan kegiatan sosial selama menempuh pendidikan[cite: 1]"
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: true,
        comment: "Deskripsi tambahan terkait pencapaian atau studi[cite: 1]"
    },
    media: {
        type: DataTypes.STRING,
        allowNull: true,
        comment: "Media pendukung tambahan (lampiran/sertifikat terkait pendidikan)[cite: 1]"
    }
}, {
    freezeTableName: true,
    timestamps: true
});

export default EducationModel;