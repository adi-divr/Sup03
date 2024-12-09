const { google } = require('googleapis');

module.exports = async function Performance(req, res) {
    if (req.method !== 'GET') {
        return res.status(405).json({ message: 'Only GET requests are allowed' });
    }

    const { month, year } = req.query;

    if (!month || !year) {
        return res.status(400).json({ message: 'Month and year are required in the query params' });
    }

    try {
        const auth = new google.auth.GoogleAuth({
            credentials: {
                client_email: process.env.GOOGLE_CLIENT_EMAIL,
                private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
            },
            scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
        });

        const sheets = google.sheets({ version: 'v4', auth });

        const range = 'A2:F'; // Assuming data starts from row 2 and slot ID is column F (index 5)
        const sheetDataResponse = await sheets.spreadsheets.values.get({
            spreadsheetId: process.env.GOOGLE_SHEET_ID2,
            range,
        });

        const rows = sheetDataResponse.data.values || [];
        let totalSlots = 0;
        const uniqueSlotPayments = {}; // To track unique slot IDs and their payments

        rows.forEach(row => {
            const [ , , bookedDate, totalSlotsCount, payment, slotId] = row; // Extract required columns
            if (bookedDate && bookedDate.startsWith(`${year}-${month.padStart(2, '0')}`)) {
                // Summing total slots
                totalSlots += parseInt(totalSlotsCount || '0', 10);

                // Handling unique slot payments
                if (slotId && !uniqueSlotPayments[slotId]) {
                    uniqueSlotPayments[slotId] = parseInt(payment || '0', 10);
                }
            }
        });

        // Calculate the total payment for unique slots
        const totalPayment = Object.values(uniqueSlotPayments).reduce((acc, payment) => acc + payment, 0);

        return res.status(200).json({
            totalSlots,
            totalPayment,
        });
    } catch (error) {
        console.error('Error fetching data:', error);
        return res.status(500).json({ message: 'Internal Server Error', error });
    }
};
