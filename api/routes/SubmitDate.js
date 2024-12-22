const { google } = require("googleapis");





module.exports= async function BlockDate (req, res)  {
  const { fromDate, toDate } = req.body;

  if (!fromDate || !toDate) {
    return res.status(400).json({ message: "Both fromDate and toDate are required" });
  }

  const from = new Date(fromDate);
  const to = new Date(toDate);

  if (isNaN(from) || isNaN(to)) {
    return res.status(400).json({ message: "Invalid date format" });
  }

  if (from > to) {
    return res.status(400).json({ message: "fromDate cannot be after toDate" });
  }

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

    // Get existing data to determine the next serial number
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: sheetId,
      range: "A:A",
    });

    const existingData = response.data.values;
    const serialNumber = existingData ? existingData.length : 1;

    // Append new data
    const values = [[serialNumber, fromDate, toDate]];

    await sheets.spreadsheets.values.append({
      spreadsheetId: sheetId,
      range: "A1",
      valueInputOption: "USER_ENTERED",
      requestBody: {
        values,
      },
    });

    res.status(200).json({ message: "Dates added successfully", data: { serialNumber, fromDate, toDate } });
  } catch (error) {
    console.error("Error appending data to Google Sheets:", error);
    res.status(500).json({ message: "Internal Server Error", error });
  }
}

