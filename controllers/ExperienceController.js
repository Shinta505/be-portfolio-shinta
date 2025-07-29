import Experience from "../models/ExperienceModel.js";

// GET all experiences
async function getAllExperiences(req, res) {
    try {
        const experiences = await Experience.findAll();
        res.status(200).json(experiences);
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ msg: "Terjadi kesalahan server" });
    }
}

// GET experience by ID
async function getExperienceById(req, res) {
    const id_experience = req.params.id_experience;
    try {
        const experience = await Experience.findOne({ where: { id_experience: id_experience } });
        if (experience) {
            res.status(200).json(experience);
        } else {
            res.status(404).json({ msg: "Pengalaman tidak ditemukan" });
        }
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ msg: "Terjadi kesalahan server" });
    }
}

// CREATE
async function createExperience(req, res) {
    try {
        const inputResult = req.body;
        await Experience.create(inputResult);
        res.status(201).json({ msg: "Pengalaman berhasil ditambahkan" });
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ msg: "Terjadi kesalahan server" });
    }
}

// UPDATE
async function updateExperience(req, res) {
    const id_experience = req.params.id_experience;
    try {
        const inputResult = req.body;
        const [updated] = await Experience.update(inputResult, { where: { id_experience: id_experience } });
        if (updated) {
            res.status(200).json({ msg: "Pengalaman berhasil diperbarui" });
        } else {
            res.status(404).json({ msg: "Pengalaman tidak ditemukan" });
        }
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ msg: "Terjadi kesalahan server" });
    }
}

// DELETE
async function deleteExperience(req, res) {
    const id_experience = req.params.id_experience;
    try {
        const deleted = await Experience.destroy({ where: { id_experience: id_experience } });
        if (deleted) {
            res.status(200).json({ msg: "Pengalaman berhasil dihapus" });
        } else {
            res.status(404).json({ msg: "Pengalaman tidak ditemukan" });
        }
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ msg: "Terjadi kesalahan server" });
    }
}

export {
    getAllExperiences,
    getExperienceById,
    createExperience,
    updateExperience,
    deleteExperience
};