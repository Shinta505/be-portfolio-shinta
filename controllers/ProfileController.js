import ProfileModel from "../models/ProfileModel.js";

/**
 * Mengambil data profil untuk Halaman "Tentang Saya"
 * @route GET /api/profile
 */
export const getProfile = async(req, res) => {
    try {
        // Karena aplikasi ini adalah portofolio personal, umumnya hanya terdapat satu entri profil
        let profile = await ProfileModel.findOne();

        // Jika data profil belum diinisialisasi dalam database, buat entri default
        if (!profile) {
            profile = await ProfileModel.create({
                name: "Nama Pengguna",
                title: "Software Engineer / Web Developer",
                bio: "Deskripsikan latar belakang, minat profesional, dan keahlian Anda di sini.",
                profile_image: "",
                education: JSON.stringify([]),
                experience: JSON.stringify([]),
                social_links: JSON.stringify({
                    github: "",
                    linkedin: "",
                    instagram: ""
                })
            });
        }

        return res.status(200).json({
            success: true,
            message: "Data profil berhasil diambil.",
            data: profile
        });
    } catch (error) {
        console.error("Error fetching profile:", error);
        return res.status(500).json({
            success: false,
            message: "Terjadi kesalahan pada server saat mengambil data profil.",
            error: error.message
        });
    }
};

/**
 * Memperbarui data profil (Memerlukan hak akses autentikasi admin)
 * @route PUT /api/profile
 */
export const updateProfile = async(req, res) => {
    try {
        const {
            name,
            title,
            bio,
            profile_image,
            education,
            experience,
            social_links
        } = req.body;

        // Cari entri profil yang ada di database
        let profile = await ProfileModel.findOne();

        if (!profile) {
            // Jika belum ada record sama sekali, lakukan pembuatan baru (create)
            const newProfile = await ProfileModel.create({
                name,
                title,
                bio,
                profile_image,
                education,
                experience,
                social_links
            });

            return res.status(201).json({
                success: true,
                message: "Profil baru berhasil dibuat.",
                data: newProfile
            });
        }

        // Lakukan pembaruan data jika record sudah tersedia
        await profile.update({
            name: name !== undefined ? name : profile.name,
            title: title !== undefined ? title : profile.title,
            bio: bio !== undefined ? bio : profile.bio,
            profile_image: profile_image !== undefined ? profile_image : profile.profile_image,
            education: education !== undefined ? education : profile.education,
            experience: experience !== undefined ? experience : profile.experience,
            social_links: social_links !== undefined ? social_links : profile.social_links
        });

        return res.status(200).json({
            success: true,
            message: "Profil berhasil diperbarui.",
            data: profile
        });
    } catch (error) {
        console.error("Error updating profile:", error);
        return res.status(500).json({
            success: false,
            message: "Terjadi kesalahan pada server saat memperbarui data profil.",
            error: error.message
        });
    }
};