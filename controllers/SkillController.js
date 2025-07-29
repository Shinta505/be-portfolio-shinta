import Skill from '../models/SkillModel.js';

// GET all skills
async function getAllSkills(req, res) {
    try {
        const skills = await Skill.findAll();
        res.status(200).json(skills);
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ msg: "Terjadi kesalahan server" });
    }
}

// GET skill by ID
async function getSkillById(req, res) {
    const id_skill = req.params.id_skill;
    try {
        const skill = await Skill.findOne({ where: { id_skill: id_skill } });
        if (skill) {
            res.status(200).json(skill);
        } else {
            res.status(404).json({ msg: "Skill tidak ditemukan" });
        }
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ msg: "Terjadi kesalahan server" });
    }
}

// CREATE
async function createSkill(req, res) {
    try {
        const inputResult = req.body;
        await Skill.create(inputResult);
        res.status(201).json({ msg: "Skill berhasil ditambahkan" });
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ msg: "Terjadi kesalahan server" });
    }
}

// UPDATE
async function updateSkill(req, res) {
    const id_skill = req.params.id_skill;
    try {
        const inputResult = req.body;
        const [updated] = await Skill.update(inputResult, { where: { id_skill: id_skill } });
        if (updated) {
            res.status(200).json({ msg: "Skill berhasil diperbarui" });
        } else {
            res.status(404).json({ msg: "Skill tidak ditemukan" });
        }
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ msg: "Terjadi kesalahan server" });
    }
}

// DELETE
async function deleteSkill(req, res) {
    const id_skill = req.params.id_skill;
    try {
        const deleted = await Skill.destroy({ where: { id_skill: id_skill } });
        if (deleted) {
            res.status(200).json({ msg: "Skill berhasil dihapus" });
        } else {
            res.status(404).json({ msg: "Skill tidak ditemukan" });
        }
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ msg: "Terjadi kesalahan server" });
    }
}

export {
    getAllSkills,
    getSkillById,
    createSkill,
    updateSkill,
    deleteSkill
};
