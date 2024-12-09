const { google } = require('googleapis');

module.exports = async function GetFilteredData(req, res) {
    if (req.method !== 'GET') {
        return res.status(405).json({ message: 'Only GET requests are allowed' });
    }

    const { slotKey } = req.query;

    if (!slotKey) {
        return res.status(400).json({ message: 'slotKey is required in the query params' });
    }
    console.log("Slot Key:", slotKey);

    try {
        const auth = new google.auth.GoogleAuth({
            credentials: {
                client_email: process.env.GOOGLE_CLIENT_EMAIL,
                private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
            },
            scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
        });

        const sheets = google.sheets({ version: 'v4', auth });

        const range = 'Sheet1!A1:H';

        const response = await sheets.spreadsheets.values.get({
            spreadsheetId: process.env.GOOGLE_SHEET_ID,
            range,
        });

        const rows = response.data.values;

        if (!rows || rows.length <= 1) {
            return res.status(404).json({ message: 'No data found' });
        }

        const headers = rows[0];
        const data = rows.slice(1);

        const slotColumnIndex = headers.indexOf('SLOT');

        if (slotColumnIndex === -1) {
            return res.status(400).json({ message: 'SLOT column not found in the sheet' });
        }

        const filteredRows = data.filter(row => row[slotColumnIndex] === slotKey);

        if (!filteredRows.length) {
            return res.status(404).json({ message: `No data found for slotKey: ${slotKey}` });
        }

        const result = [headers, ...filteredRows];
        console.log(result);
        return res.status(200).json({ data: result });
    } catch (error) {
        console.error("Error:", error);
        return res.status(500).json({ message: 'Internal Server Error', error });
    }
};
