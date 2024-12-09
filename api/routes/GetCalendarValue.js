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
      range: "A2:E", // Assuming data starts from row 2
    });

    const rows = sheetDataResponse.data.values || [];
    const slots = {}; // Object to store the slots data

    rows.forEach((row) => {
      const bookingDate = row[2]; // Assuming date is in column C (index 2)
      const slotsCount = row[3]; // Assuming slots count is in column D (index 3)

      // Ensure `month` is treated as a string
      const monthString = Array.isArray(month) ? month[0] : month;

      if (
        bookingDate &&
        bookingDate.startsWith(`${year}-${String(monthString).padStart(2, "0")}`)
      ) {
        slots[bookingDate] = (slots[bookingDate] || 0) + parseInt(slotsCount || "0", 10);
      }
    });

    res.status(200).json({ slots });
  } catch (error) {
    console.error("Error fetching slots:", error);
    res.status(500).json({ message: "Internal Server Error", error });
  }
};
