//this api will give total number of slots available for a month

const { google } = require("googleapis");

module.exports = async function GetSlots(req, res) {
  const { month, year } = req.query;

  if (!month || !year) {
    return res.status(400).json({ message: "Month and year are required." });
  }

  try {
    const auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: process.env.GOOGLE_CLIENT_EMAIL,
        private_key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, "\n"),
      },
      scopes: ["https://www.googleapis.com/auth/spreadsheets.readonly"],
    });

    const sheets = google.sheets({ version: "v4", auth });

    const sheetDataResponse = await sheets.spreadsheets.values.get({
      spreadsheetId: process.env.GOOGLE_SHEET_ID2,
      range: "A2:G", // Adjusted to include the required columns
    });

    const rows = sheetDataResponse.data.values || [];
    const slots = {}; // To store available slots per date

    rows.forEach((row) => {
      const bookingDate = row[2]; // Column C: Booked Date

      if (!bookingDate) return;

      const bookedMonth = bookingDate.substring(5, 7);
      const bookedYear = bookingDate.substring(0, 4);

      if (bookedYear === year && bookedMonth === String(month).padStart(2, "0")) {
        slots[bookingDate] = (slots[bookingDate] || 0) + 1;
      }
    });

    // Calculate available slots
    const availableSlots = Object.entries(slots).map(([date, count]) => {
      const remainingSlots = Math.max(12 - count, 0);
      return [date, remainingSlots];
    });

    res.status(200).json({ availableSlots });
  } catch (error) {
    console.error("Error fetching slots:", error);
    res.status(500).json({ message: "Internal Server Error", error });
  }
};