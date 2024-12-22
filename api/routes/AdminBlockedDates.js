//this api gets from and to between dates
const { google } = require("googleapis");

module.exports = async function GetDatesInRange(req, res) {
  try {
    const auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: process.env.GOOGLE_CLIENT_EMAIL,
        private_key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, "\n"),
      },
      scopes: ["https://www.googleapis.com/auth/spreadsheets"],
    });

    const sheets = google.sheets({ version: "v4", auth });
    const sheetId = process.env.GOOGLE_SHEET_ID3;

    // Get data from the sheet
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: sheetId,
      range: "A:C", // Assuming columns A, B, C are used for SNO, From Date, To Date
    });

    const rows = response.data.values;
    if (!rows || rows.length <= 1) {
      return res.status(404).json({ message: "No data found in the sheet" });
    }

    // Parse the date ranges
    const dateRanges = rows.slice(1).map((row) => {
      const fromDate = new Date(row[1]);
      const toDate = new Date(row[2]);
      return { fromDate, toDate };
    });

    // Calculate all dates in each range
    const allDates = [];
    dateRanges.forEach(({ fromDate, toDate }) => {
      const dates = [];
      let currentDate = new Date(fromDate);
      while (currentDate <= toDate) {
        dates.push(new Date(currentDate).toISOString().split("T")[0]); // Convert to YYYY-MM-DD format
        currentDate.setDate(currentDate.getDate() + 1);
      }
      allDates.push(...dates);
    });

    res.status(200).json({ dates: allDates });
  } catch (error) {
    console.error("Error fetching data from Google Sheets:", error);
    res.status(500).json({ message: "Internal Server Error", error });
  }
};
