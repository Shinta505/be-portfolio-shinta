import SkillModel from "../models/SkillModel.js";

/**
 * Mengambil seluruh data keahlian (skills) yang tersimpan di dalam database Supabase PostgreSQL.
 * Dapat diakses oleh publik untuk ditampilkan pada halaman khusus skills dan teknologi[cite: 1].
 */
export const getSkills = async(req, res) => {
    try {
        const response = await SkillModel.findAll({
            attributes: ['uuid', 'name', 'category', 'icon', 'createdAt', 'updatedAt']
        });
        return res.status(200).json(response);
    } catch (error) {
        return res.status(500).json({ message: error.message || "Terjadi kesalahan saat mengambil data skills." });
    }
};

/**
 * Mengambil detail data keahlian tunggal berdasarkan UUID tertentu.
 */
export const getSkillById = async(req, res) => {
    try {
        const skill = await SkillModel.findOne({
            where: {
                uuid: req.params.uuid
            }
        });

        if (!skill) {
            return res.status(404).json({ message: "Data keahlian tidak ditemukan." });
        }

        return res.status(200).json(skill);
    } catch (error) {
        return res.status(500).json({ message: error.message || "Terjadi kesalahan pada server." });
    }
};

/**
 * Menambahkan data keahlian (skill) baru ke dalam sistem manajemen konten (CMS)[cite: 1].
 * Memerlukan hak akses otentikasi dan otorisasi administrator.
 */
export const createSkill = async(req, res) => {
    const { name, category, icon } = req.body;

    if (!name || !category) {
        return res.status(400).json({ message: "Nama dan kategori keahlian wajib diisi." });
    }

    try {
        await SkillModel.create({
            name,
            category,
            icon: icon || null
        });

        return res.status(201).json({ message: "Data keahlian berhasil ditambahkan." });
    } catch (error) {
        return res.status(500).json({ message: error.message || "Gagal menambahkan data keahlian." });
    }
};

/**
 * Memperbarui data keahlian yang sudah ada berdasarkan parameter UUID.
 * Memerlukan hak akses otentikasi dan otorisasi administrator.
 */
export const updateSkill = async(req, res) => {
    try {
        const skill = await SkillModel.findOne({
            where: {
                uuid: req.params.uuid
            }
        });

        if (!skill) {
            return res.status(404).json({ message: "Data keahlian yang ingin diubah tidak ditemukan." });
        }

        const { name, category, icon } = req.body;

        await SkillModel.update({
            name: name !== undefined ? name : skill.name,
            category: category !== undefined ? category : skill.category,
            icon: icon !== undefined ? icon : skill.icon
        }, {
            where: {
                uuid: req.params.uuid
            }
        });

        return res.status(200).json({ message: "Data keahlian berhasil diperbarui." });
    } catch (error) {
        return res.status(500).json({ message: error.message || "Gagal memperbarui data keahlian." });
    }
};

/**
 * Menghapus data keahlian berdasarkan parameter UUID dari sistem manajemen konten (CMS)[cite: 1].
 * Memerlukan hak akses otentikasi dan otorisasi administrator.
 */
export const deleteSkill = async(req, res) => {
    try {
        const skill = await SkillModel.findOne({
            where: {
                uuid: req.params.uuid
            }
        });

        if (!skill) {
            return res.status(404).json({ message: "Data keahlian yang ingin dihapus tidak ditemukan." });
        }

        await SkillModel.destroy({
            where: {
                uuid: req.params.uuid
            }
        });

        return res.status(200).json({ message: "Data keahlian berhasil dihapus." });
    } catch (error) {
        return res.status(500).json({ message: error.message || "Gagal menghapus data keahlian." });
    }
};