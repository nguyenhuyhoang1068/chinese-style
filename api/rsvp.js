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

        const responseData = await response.json(); // get response from Google Apps Script

        if (responseData.success === false) {
            console.error("Google Script Error:", responseData);
            return res.status(400).json({
                success: false,
                message: responseData.message || 'Lỗi từ Google Apps Script'
            });
        }

        if (responseData.status === 'success') {
            return res.status(200).json({ success: true, message: responseData.message || 'RSVP saved' });
        }

        // Case not determined
        console.error("Unexpected Google Script Response:", responseData);
        return res.status(500).json({ success: false, message: 'Phản hồi không hợp lệ từ Google Apps Script' });

    } catch (err) {
        console.error("Error:", err);
        return res.status(500).json({ success: false, message: 'Liên hệ 1068studios/nguyenhuyhoang1068@gmail.com bạn nhé' });
    }
}