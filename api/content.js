const fs = require('fs').promises;
const path = require('path');

export default async function handler(req, res) {
    // Chỉ cho phép phương thức GET
    if (req.method !== 'GET') {
        return res.status(405).json({ success: false, message: 'Chỉ hỗ trợ GET' });
    }

    // Kiểm tra nguồn yêu cầu (tùy chọn, để hạn chế truy cập)
    const origin = req.headers.origin;
    const allowedOrigins = [
        'https://huyhoangkimthoa-chinese-style.vercel.app'
    ];
    if (!allowedOrigins.includes(origin)) {
        return res.status(403).json({ success: false, message: 'Nguồn không được phép' });
    }

    try {
        const filePath = path.join(process.cwd(), 'data', 'content.json');
        const data = await fs.readFile(filePath, 'utf8');
        res.setHeader('Content-Type', 'application/json');
        res.status(200).json(JSON.parse(data));
    } catch (err) {
        console.error('Error reading content.json:', err);
        res.status(500).json({ success: false, message: 'Lỗi server' });
    }
}