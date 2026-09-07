import ProfileModel from "../models/ProfileModel.js";
import { createClient } from "@supabase/supabase-js";

// Inisialisasi klien Supabase
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);
const BUCKET_NAME = "uploads";

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
            location,
            email,
            github_url,
            linkedin_url,
            instagram_url,
            tiktok_url,
            twitter_url
        } = req.body;

        // Mengambil profil_image dari body (jika tidak ada file yang diunggah) atau null
        let imageUrl = profile ? profile.profile_image : (req.body.profile_image || null);

        // Logika integrasi unggahan berkas ke Supabase Storage
        if (req.file) {
            // Evaluasi dan penghapusan berkas lama pada object storage jika profil sudah eksis
            if (profile && profile.profile_image && profile.profile_image.includes("supabase.co")) {
                const oldFilePath = profile.profile_image.split(`/storage/v1/object/public/${BUCKET_NAME}/`)[1];
                if (oldFilePath) {
                    await supabase.storage.from(BUCKET_NAME).remove([oldFilePath]);
                }
            }

            // Pengunggahan aliran data (buffer) profil baru
            const fileName = `profiles/${Date.now()}-${req.file.originalname.replace(/\s+/g, "-")}`;
            const { data, error: uploadError } = await supabase.storage
                .from(BUCKET_NAME)
                .upload(fileName, req.file.buffer, {
                    contentType: req.file.mimetype,
                    upsert: false
                });

            if (uploadError) throw new Error(`Gagal mengunggah foto profil: ${uploadError.message}`);

            // Ekstraksi Absolute URL dari Supabase
            const { data: publicUrlData } = supabase.storage
                .from(BUCKET_NAME)
                .getPublicUrl(fileName);

            imageUrl = publicUrlData.publicUrl;
        }

        if (!profile) {
            // Jika entitas profil belum eksis, lakukan operasi insersi (Create)
            const newProfile = await ProfileModel.create({
                fullname,
                headline,
                bio,
                profile_image: imageUrl,
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

        // Jika entitas profil telah eksis, lakukan operasi pembaruan (Update)
        await ProfileModel.update({
            fullname: fullname || profile.fullname,
            headline: headline || profile.headline,
            bio: bio || profile.bio,
            profile_image: imageUrl,
            location: location || profile.location,
            email: email || profile.email,
            github_url: github_url !== undefined ? github_url : profile.github_url,
            linkedin_url: linkedin_url !== undefined ? linkedin_url : profile.linkedin_url,
            instagram_url: instagram_url !== undefined ? instagram_url : profile.instagram_url,
            tiktok_url: tiktok_url !== undefined ? tiktok_url : profile.tiktok_url,
            twitter_url: twitter_url !== undefined ? twitter_url : profile.twitter_url
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
