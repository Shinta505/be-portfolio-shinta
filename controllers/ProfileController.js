import ProfileModel from "../models/ProfileModel.js"; 
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

// Nama bucket utama Anda
const BUCKET_NAME = "uploads";

export const getProfile = async (req, res) => {
    try {
        const profile = await ProfileModel.findOne();
        if (!profile) {
            return res.status(404).json({
                success: false,
                message: "Data profil belum tersedia."
            });
        }
        res.status(200).json({ success: true, data: profile });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Terjadi kesalahan pada server.",
            error: error.message
        });
    }
};

export const updateProfile = async (req, res) => {
    try {
        let profile = await ProfileModel.findOne();
        const bodyData = req.body;
        
        let imageUrl = profile ? profile.profile_image : null;
        let oldFilePathToClean = null;

        // 1. Eksekusi Upload ke Supabase (Jika ada file baru)
        if (req.file) {
            // Gunakan folder 'profiles/' di dalam bucket 'uploads' agar rapi
            const sanitizedName = req.file.originalname.replace(/[^a-zA-Z0-9.-]/g, "_");
            const fileName = `profiles/profile-${Date.now()}-${sanitizedName}`;
            
            const { error: uploadError } = await supabase.storage
                .from(BUCKET_NAME)
                .upload(fileName, req.file.buffer, {
                    contentType: req.file.mimetype,
                    upsert: false
                });

            if (uploadError) {
                return res.status(400).json({ 
                    success: false, 
                    message: `Gagal mengunggah foto: ${uploadError.message}` 
                });
            }

            const { data: publicUrlData } = supabase.storage
                .from(BUCKET_NAME)
                .getPublicUrl(fileName);

            imageUrl = publicUrlData.publicUrl;

            // Siapkan path file lama untuk dihapus nanti
            if (profile && profile.profile_image?.includes("supabase.co")) {
                const urlParts = profile.profile_image.split(`/storage/v1/object/public/${BUCKET_NAME}/`);
                if (urlParts.length > 1) {
                    oldFilePathToClean = urlParts[1]; // Akan menghasilkan misal: 'profiles/profile-123.jpg' atau 'profile-123.jpg'
                }
            }
        }

        // 2. Simpan Data ke Database
        if (!profile) {
            profile = await ProfileModel.create({
                ...bodyData,
                profile_image: imageUrl
            });
        } else {
            await ProfileModel.update({
                fullname: bodyData.fullname || profile.fullname,
                headline: bodyData.headline || profile.headline,
                bio: bodyData.bio || profile.bio,
                profile_image: imageUrl,
                location: bodyData.location || profile.location,
                email: bodyData.email || profile.email,
                github_url: bodyData.github_url !== undefined ? bodyData.github_url : profile.github_url,
                linkedin_url: bodyData.linkedin_url !== undefined ? bodyData.linkedin_url : profile.linkedin_url,
                instagram_url: bodyData.instagram_url !== undefined ? bodyData.instagram_url : profile.instagram_url,
                tiktok_url: bodyData.tiktok_url !== undefined ? bodyData.tiktok_url : profile.tiktok_url,
                twitter_url: bodyData.twitter_url !== undefined ? bodyData.twitter_url : profile.twitter_url
            }, {
                where: { uuid: profile.uuid }
            });
        }

        // 3. Bersihkan Storage (Hanya Dieksekusi Jika Database Berhasil Diupdate)
        if (oldFilePathToClean) {
            await supabase.storage.from(BUCKET_NAME).remove([oldFilePathToClean]);
        }

        const updatedProfile = await ProfileModel.findOne({ where: { uuid: profile.uuid } });

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
