const fs = require('fs').promises;
const path = require('path');

export default async function handler(req, res) {

    try {
        // Đọc file content.json từ assets/data
        const filePath = path.join(process.cwd(), 'assets', 'data', 'content.json');
        const data = await fs.readFile(filePath, 'utf8');
        const content = JSON.parse(data);

        // Trả về dữ liệu
        res.status(200).json({ success: true, data: content });
    } catch (err) {
        console.error('Error reading content.json:', err);
        res.status(500).json({ success: false, message: 'Lỗi server khi tải nội dung' });
    }
}