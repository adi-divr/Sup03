const { google } = require('googleapis');

const SLOT_LIMIT = 12; // Max slots per date

module.exports = async function Accepted(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Only POST method is allowed' });
  }

  const body = req.body;

  if (!Array.isArray(body)) {
    return res.status(400).json({ message: 'Expected an array of objects' });
  }

  const isValidData = body.every(
    (item) =>
      typeof item.name === 'string' &&
      typeof item.number === 'string' &&
      typeof item.bookingDate === 'string' &&
      typeof item.paymentMade === 'string' &&
      typeof item.slotID === 'string'
  );

  if (!isValidData) {
    return res.status(400).json({ message: 'Invalid data format.' });
  }

  try {
    const auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: process.env.GOOGLE_CLIENT_EMAIL,
        private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
      },
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });

    const sheets = google.sheets({ version: 'v4', auth });

    // Fetch existing data from the sheet
    const existingDataResponse = await sheets.spreadsheets.values.get({
      spreadsheetId: process.env.GOOGLE_SHEET_ID2,
      range: 'A1:F', // Assuming columns are Name, Number, Booking Date, Total Slots
    });

    const existingData = existingDataResponse.data.values || [];
    const bookingsPerDate = {};

    // Skip the header row and calculate the total slots for each date
    existingData.slice(1).forEach((row) => {
      const bookingDate = row[2]; // Assuming bookingDate is in the 3rd column (index 2)
      if (bookingDate) {
        bookingsPerDate[bookingDate] = (bookingsPerDate[bookingDate] || 0) + 1;
      }
    });

    // Check if any of the incoming booking dates exceed the limit
    for (const booking of body) {
      const currentSlots = bookingsPerDate[booking.bookingDate] || 0;
      if (currentSlots + 1 > SLOT_LIMIT) {
        return res.status(400).json({
          message: `Slot limit exceeded for date ${booking.bookingDate}. Current slots: ${currentSlots}, attempted to add 1 slot.`,
        });
      }
    }

    // Map incoming data to the required format and append
    const values = body.map((item) => [
      item.name || '',
      item.number || '',
      item.bookingDate || '',
      1, // Total slots (always 1 per row for this system)
      item.paymentMade || '',
      item.slotID || ''
    ]);

    await sheets.spreadsheets.values.append({
      spreadsheetId: process.env.GOOGLE_SHEET_ID2,
      range: 'A1',
      valueInputOption: 'USER_ENTERED',
      requestBody: {
        values,
      },
    });

    return res.status(200).json({
      message: 'Data appended successfully',
    });
  } catch (error) {
    console.error('Error processing request:', error);
    return res.status(500).json({ message: 'Internal Server Error', error });
  }
};