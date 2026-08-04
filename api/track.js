const axios = require('axios');

module.exports = async (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    if (req.method === 'OPTIONS') return res.status(200).end();

    const { nik } = req.body || {};
    if (!nik || nik.length !== 16 || !/^\d{16}$/.test(nik)) {
        return res.status(400).json({
            status: "failed",
            code: 400,
            creator: "@Zaam",
            message: "NIK harus 16 digit angka"
        });
    }

    const url = 'https://nik.zakiego.com/api/trpc/nik.read?batch=1';
    const headers = {
        'Accept': '*/*',
        'Content-Type': 'application/json',
        'Origin': 'https://nik.zakiego.com',
        'Referer': 'https://nik.zakiego.com/',
        'User-Agent': 'Mozilla/5.0 (Linux; Android 10; K) Chrome/143.0.0.0 Mobile Safari/537.36'
    };
    const payload = {
        "0": { "json": { "nik": String(nik) } }
    };

    try {
        const response = await axios.post(url, payload, { headers });
        const rawData = response.data?.[0]?.result?.data?.json;
        if (rawData) {
            return res.status(200).json({
                status: "success",
                code: 200,
                creator: "@Zaam",
                result: rawData
            });
        } else {
            return res.status(404).json({
                status: "failed",
                code: 404,
                creator: "@Zaam",
                message: "Data NIK tidak ditemukan."
            });
        }
    } catch (error) {
        return res.status(error.response?.status || 500).json({
            status: "failed",
            code: error.response?.status || 500,
            creator: "@Zaam",
            message: error.response?.data || error.message
        });
    }
};