export async function loginAdmin(req, res) {
    // Ambil username dan password dari body request
    const { username, password } = req.body;

    // Ambil kredensial yang benar dari environment variables
    const correctUsername = process.env.ADMIN_USERNAME;
    const correctPassword = process.env.ADMIN_PASSWORD;

    // Lakukan validasi
    if (username === correctUsername && password === correctPassword) {
        // Jika berhasil
        res.status(200).json({ success: true, message: 'Login berhasil!' });
    } else {
        // Jika gagal
        res.status(401).json({ success: false, message: 'Username atau password salah.' });
    }
}