const { google } = require("googleapis");

module.exports =  async function GetCalendarValueView(req, res) {
  const { date } = req.query;

  if (!date || typeof date !== "string") {
    return res.status(400).json({ message: "Date is required in 'YYYY-MM-DD' format." });
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
      range: "A2:F",
    });

    const rows = sheetDataResponse.data.values || [];
    const results = [];

    rows.forEach((row) => {
      const [name, number, bookingDate] = row; 
      if (bookingDate === date) {
        results.push({ name, number });
      }
    });

    res.status(200).json({
      totalSlots: results.length,
      details: results,
    });
  } catch (error) {
    console.error("Error fetching details by date:", error);
    res.status(500).json({ message: "Internal Server Error", error });
  }
}

