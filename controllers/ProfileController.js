import ProfileModel from "../models/ProfileModel.js";

// Mengambil data profil (karena ini portofolio pribadi, biasanya hanya ada satu record data profil)
export const getProfile = async(req, res) => {
    try {
        const profile = await ProfileModel.findOne();
        if (!profile) {
            return res.status(404).json({
                success: false,
                message: "Data profil belum tersedia."
            });
        }
        res.status(200).json({
            success: true,
            data: profile
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Terjadi kesalahan pada server.",
            error: error.message
        });
    }
};

// Memperbarui atau membuat data profil baru jika belum ada
export const updateProfile = async(req, res) => {
    try {
        let profile = await ProfileModel.findOne();

        const {
            fullname,
            headline,
            bio,
            profile_image,
            location,
            email,
            github_url,
            linkedin_url,
            instagram_url,
            tiktok_url,
            twitter_url
        } = req.body;

        if (!profile) {
            // Jika data profil sama sekali belum ada, buat baru
            const newProfile = await ProfileModel.create({
                fullname,
                headline,
                bio,
                profile_image,
                location,
                email,
                github_url,
                linkedin_url,
                instagram_url,
                tiktok_url,
                twitter_url
            });

            return res.status(201).json({
                success: true,
                message: "Profil berhasil dibuat.",
                data: newProfile
            });
        }

        // Jika sudah ada, lakukan pembaruan berdasarkan uuid record yang ditemukan
        await ProfileModel.update({
            fullname,
            headline,
            bio,
            profile_image,
            location,
            email,
            github_url,
            linkedin_url,
            instagram_url,
            tiktok_url,
            twitter_url
        }, {
            where: { uuid: profile.uuid }
        });

        const updatedProfile = await ProfileModel.findOne({
            where: { uuid: profile.uuid }
        });

        res.status(200).json({
            success: true,
            message: "Profil berhasil diperbarui.",
            data: updatedProfile
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Gagal memperbarui profil.",
            error: error.message
        });
    }
};