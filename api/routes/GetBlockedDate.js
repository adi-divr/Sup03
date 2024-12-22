const { google } = require("googleapis");


module.exports = async function GetBlockedDate(req, res) {
    try {
      // Set up Google Auth
      const auth = new google.auth.GoogleAuth({
        credentials: {
          client_email: process.env.GOOGLE_CLIENT_EMAIL,
          private_key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, "\n"),
        },
        scopes: ["https://www.googleapis.com/auth/spreadsheets"],
      });
  
      const sheets = google.sheets({ version: "v4", auth });
  
      const sheetId = process.env.GOOGLE_SHEET_ID3;
  
      // Fetch all data from the sheet
      const response = await sheets.spreadsheets.values.get({
        spreadsheetId: sheetId,
        range: "A:C", // Assuming data is in columns A to C
      });
  
      const rows = response.data.values;
  
      if (!rows || rows.length === 0) {
        return res.status(200).json({ message: "No data found", data: [] });
      }
  
      // Format the data into JSON
      const formattedData = rows.slice(1).map((row, index) => ({
        serialNumber: row[0] || index + 1, // Serial number
        fromDate: row[1], // From date
        toDate: row[2], // To date
      }));
  
      res.status(200).json({ message: "Data fetched successfully", data: formattedData });
    } catch (error) {
      console.error("Error fetching data from Google Sheets:", error);
      res.status(500).json({ message: "Internal Server Error", error });
    }
  };