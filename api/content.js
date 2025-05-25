const fs = require('fs').promises;
const path = require('path');

export default async function handler(req, res) {
    // Chỉ cho phép phương thức GET
    if (req.method !== 'GET') {
        return res.status(405).json({ success: false, message: 'Chỉ hỗ trợ GET' });
    }

    // Kiểm tra nguồn gốc (CORS)
    const origin = req.headers.origin;
    const allowedOrigins = ['https://huyhoangkimthoa-chinese-style.vercel.app'];
    if (!allowedOrigins.includes(origin)) {
        return res.status(403).json({ success: false, message: 'Nguồn gốc không được phép' });
    }

    try {
        // Đọc file content.json từ assets/data
        const filePath = path.join(process.cwd(), 'assets', 'data', 'content.json');
        const data = await fs.readFile(filePath, 'utf8');
        const content = JSON.parse(data);

        // Thiết lập header CORS
        res.setHeader('Access-Control-Allow-Origin', origin);
        res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');

        // Trả về dữ liệu
        res.status(200).json({ success: true, data: content });
    } catch (err) {
        console.error('Error reading content.json:', err);
        res.status(500).json({ success: false, message: 'Lỗi server khi tải nội dung' });
    }
}