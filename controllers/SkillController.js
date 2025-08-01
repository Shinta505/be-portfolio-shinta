import Skill from '../models/SkillModel.js';

// GET all skills
export async function getAllSkills(req, res) {
    try {
        const skills = await Skill.findAll();
        res.status(200).json(skills);
    } catch (error) {
        res.status(500).json({ msg: "Terjadi kesalahan server" });
    }
}

// GET skill by ID
export async function getSkillById(req, res) {
    try {
        const skill = await Skill.findOne({ where: { id_skill: req.params.id_skill } });
        if (skill) {
            res.status(200).json(skill);
        } else {
            res.status(404).json({ msg: "Skill tidak ditemukan" });
        }
    } catch (error) {
        res.status(500).json({ msg: "Terjadi kesalahan server" });
    }
}

// CREATE
export async function createSkill(req, res) {
    // DIUBAH: Menggunakan destructuring untuk mengambil field baru
    const { nama_skill, persentase_keahlian } = req.body;
    if (persentase_keahlian < 0 || persentase_keahlian > 100) {
        return res.status(400).json({ msg: "Persentase harus di antara 0 dan 100." });
    }
    try {
        await Skill.create({ nama_skill, persentase_keahlian });
        res.status(201).json({ msg: "Skill berhasil ditambahkan" });
    } catch (error) {
        res.status(500).json({ msg: "Terjadi kesalahan server" });
    }
}

// UPDATE
export async function updateSkill(req, res) {
    const { nama_skill, persentase_keahlian } = req.body;
    if (persentase_keahlian !== undefined && (persentase_keahlian < 0 || persentase_keahlian > 100)) {
        return res.status(400).json({ msg: "Persentase harus di antara 0 dan 100." });
    }
    try {
        const [updated] = await Skill.update(req.body, { where: { id_skill: req.params.id_skill } });
        if (updated) {
            res.status(200).json({ msg: "Skill berhasil diperbarui" });
        } else {
            res.status(404).json({ msg: "Skill tidak ditemukan" });
        }
    } catch (error) {
        res.status(500).json({ msg: "Terjadi kesalahan server" });
    }
}

// DELETE
export async function deleteSkill(req, res) {
    try {
        const deleted = await Skill.destroy({ where: { id_skill: req.params.id_skill } });
        if (deleted) {
            res.status(200).json({ msg: "Skill berhasil dihapus" });
        } else {
            res.status(404).json({ msg: "Skill tidak ditemukan" });
        }
    } catch (error) {
        res.status(500).json({ msg: "Terjadi kesalahan server" });
    }
}
