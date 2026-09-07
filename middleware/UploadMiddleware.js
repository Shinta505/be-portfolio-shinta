import multer from "multer";
import path from "path";

// Menggunakan memoryStorage untuk menyimpan file sementara sebagai buffer di dalam memori utama (RAM).
// Pendekatan ini merupakan standar untuk arsitektur serverless guna menghindari error ENOENT pada file system yang bersifat ephemeral.
const storage = multer.memoryStorage();

// Validasi ekstensi dan tipe MIME file
const fileFilter = (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|webp|mp4|mkv/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (extname && mimetype) {
        return cb(null, true);
    } else {
        cb(new Error("Hanya file gambar (JPEG/JPG/PNG/WEBP) dan video (MP4/MKV) yang diizinkan!"), false);
    }
};

// Instansiasi middleware Multer
const upload = multer({
    storage: storage,
    limits: {
        fileSize: 10 * 1024 * 1024 // Batas alokasi buffer maksimal 10MB per file
    },
    fileFilter: fileFilter
});

export default upload;