const { google } = require('googleapis');

module.exports = async function GetData(req, res) {
    if (req.method !== 'GET') {
        return res.status(405).json({ message: 'Only GET requests are allowed' });
    }

    try {
        const auth = new google.auth.GoogleAuth({
            credentials: {
                client_email: process.env.GOOGLE_CLIENT_EMAIL,
                private_key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n'),
            },
            scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
        });

        const sheets = google.sheets({ version: 'v4', auth });

        // Desired range in the Google Sheet
        const range = 'Sheet1!A1:H';

        const response = await sheets.spreadsheets.values.get({
            spreadsheetId: process.env.GOOGLE_SHEET_ID,
            range,
        });

        const rows = response.data.values;

        if (rows && rows.length) {
            const groupedData = {};

            rows.forEach(row => {
                const slot = row[5]; // Grouping by slot (6th column)

                if (!groupedData[slot]) {
                    groupedData[slot] = [row]; // Initialize the group with the row
                }
            });

            const result = Object.values(groupedData).map(group => group[0]);

            return res.status(200).json({ data: result });
        } else {
            return res.status(404).json({ message: 'No data found' });
        }
    } catch (error) {
        return res.status(500).json({ message: 'Internal Server Error', error });
    }
};
