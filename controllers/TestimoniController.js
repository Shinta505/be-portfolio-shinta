import Testimoni from "../models/TestimoniModel.js";

// GET all testimonials
async function getAllTestimoni(req, res) {
    try {
        const testimoni = await Testimoni.findAll();
        res.status(200).json(testimoni);
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ msg: "Terjadi kesalahan server" });
    }
}

// GET testimonial by ID
async function getTestimoniById(req, res) {
    const id_testimoni = req.params.id_testimoni;
    try {
        const testimoni = await Testimoni.findOne({ where: { id_testimoni: id_testimoni } });
        if (testimoni) {
            res.status(200).json(testimoni);
        } else {
            res.status(404).json({ msg: "Testimonial tidak ditemukan" });
        }
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ msg: "Terjadi kesalahan server" });
    }
}

// CREATE
async function createTestimoni(req, res) {
    try {
        const inputResult = req.body;
        await Testimoni.create(inputResult);
        res.status(201).json({ msg: "Testimonial berhasil ditambahkan" });
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ msg: "Terjadi kesalahan server" });
    }
}

// UPDATE
async function updateTestimoni(req, res) {
    const id_testimoni = req.params.id_testimoni;
    try {
        const inputResult = req.body;
        const [updated] = await Testimoni.update(inputResult, { where: { id_testimoni: id_testimoni } });
        if (updated) {
            res.status(200).json({ msg: "Testimonial berhasil diperbarui" });
        } else {
            res.status(404).json({ msg: "Testimonial tidak ditemukan" });
        }
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ msg: "Terjadi kesalahan server" });
    }
}

// DELETE
async function deleteTestimoni(req, res) {
    const id_testimoni = req.params.id_testimoni;
    try {
        const deleted = await Testimoni.destroy({ where: { id_testimoni: id_testimoni } });
        if (deleted) {
            res.status(200).json({ msg: "Testimonial berhasil dihapus" });
        } else {
            res.status(404).json({ msg: "Testimonial tidak ditemukan" });
        }
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ msg: "Terjadi kesalahan server" });
    }
}

export {
    getAllTestimoni,
    getTestimoniById,
    createTestimoni,
    updateTestimoni,
    deleteTestimoni
};
