const { google } = require("googleapis");

module.exports = async function Reject(req, res) {
  const { slot } = req.query; 

  if (!slot || typeof slot !== "string") {
    return res.status(400).json({ message: "Slot value is required and should be a string" });
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
    const sheetId = process.env.GOOGLE_SHEET_ID;

    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: sheetId,
      range: "F:I", 
    });

    const rows = response.data.values;

    if (!rows || rows.length === 0) {
      return res.status(404).json({ message: "No data found in the sheet" });
    }

    const matchingRowIndex = rows.findIndex((row) => row[0] === slot);

    if (matchingRowIndex === -1) {
      return res.status(404).json({ message: "Slot not found" });
    }

    const rowNumber = matchingRowIndex + 1; 
    const updateRange = `I${rowNumber}`;

    await sheets.spreadsheets.values.update({
      spreadsheetId: sheetId,
      range: updateRange,
      valueInputOption: "USER_ENTERED",
      requestBody: {
        values: [["R"]],
      },
    });

    res.status(200).json({ message: `Status updated to 'R' for slot ${slot}` });
  } catch (error) {
    console.error("Error updating status in Google Sheets:", error);
    res.status(500).json({ message: "Internal Server Error", error });
  }
};
