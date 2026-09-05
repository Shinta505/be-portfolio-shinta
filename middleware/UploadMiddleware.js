import multer from "multer";
import path from "path";

// Konfigurasi penyimpanan sementara atau direktori lokal
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        // Pastikan folder 'public/uploads' sudah tersedia di root direktori backend
        cb(null, "public/uploads/");
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname));
    }
});

// Validasi tipe file (hanya mengizinkan gambar atau video tertentu)
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

// Eksekusi konfigurasi Multer
const upload = multer({
    storage: storage,
    limits: {
        fileSize: 10 * 1024 * 1024 // Batas ukuran maksimal file 10MB
    },
    fileFilter: fileFilter
});

export default upload;