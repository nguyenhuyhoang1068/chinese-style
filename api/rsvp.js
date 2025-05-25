export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Chỉ hỗ trợ POST' });
    }

    const { name, relationship, message, attendance } = req.body;
    const token = process.env.SECRET_TOKEN;
    const googleScriptUrl = process.env.GOOGLE_SCRIPT_URL;

    try {
        const response = await fetch(googleScriptUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                name,
                relationship,
                message,
                attendance,
                token
            })
        });

        return res.status(200).json({ success: true });
    } catch (err) {
        console.error("Error:", err);
        return res.status(500).json({ success: false, message: 'Lỗi server' });
    }
}
