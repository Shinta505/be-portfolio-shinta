import { DataTypes } from "sequelize";
import db from "../config/database.js";

/**
 * Model Article untuk merepresentasikan tabel artikel atau blog pada basis data PostgreSQL via Sequelize.
 * Menyimpan teks konten, judul, serta tanggal publikasi untuk fitur Blog atau Artikel[cite: 1].
 */
const ArticleModel = db.define("articles", {
    uuid: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        primaryKey: true,
        validate: {
            notEmpty: true
        }
    },
    title: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notEmpty: {
                msg: "Judul artikel tidak boleh kosong."
            },
            len: {
                args: [3, 255],
                msg: "Judul artikel harus memiliki panjang antara 3 hingga 255 karakter."
            }
        }
    },
    slug: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: {
            msg: "Slug artikel sudah digunakan, silakan gunakan slug lain."
        },
        validate: {
            notEmpty: {
                msg: "Slug tidak boleh kosong."
            }
        }
    },
    content: {
        type: DataTypes.TEXT,
        allowNull: false,
        validate: {
            notEmpty: {
                msg: "Konten artikel tidak boleh kosong."
            }
        }
    },
    image: {
        type: DataTypes.STRING,
        allowNull: true,
        comment: "Menyimpan path atau URL gambar sampul/thumbnail artikel"
    },
    publishedAt: {
        type: DataTypes.DATE,
        allowNull: true,
        defaultValue: DataTypes.NOW,
        comment: "Tanggal dan waktu publikasi artikel[cite: 1]"
    },
    status: {
        type: DataTypes.ENUM("draft", "published"),
        defaultValue: "draft",
        allowNull: false,
        validate: {
            isIn: {
                args: [
                    ["draft", "published"]
                ],
                msg: "Status artikel harus bernilai 'draft' atau 'published'."
            }
        }
    }
}, {
    freezeTableName: true,
    timestamps: true
});

export default ArticleModel;