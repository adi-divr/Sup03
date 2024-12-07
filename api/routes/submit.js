require("dotenv").config();
const express = require("express");
const { google } = require("googleapis");

const router = express.Router();

// POST route to handle data submission
router.post("/", async (req, res) => {
  const { formData, slotAndDate } = req.body;

  if (!Array.isArray(formData) || typeof slotAndDate !== "object") {
    return res.status(400).json({ message: "Invalid request body format" });
  }

  try {
    // Authenticate with Google Sheets API
    const auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: process.env.GOOGLE_CLIENT_EMAIL,
        private_key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, "\n"),
      },
      scopes: ["https://www.googleapis.com/auth/spreadsheets"],
    });

    const sheets = google.sheets({ version: "v4", auth });

    // Get the current date in ddmm format
    const date = new Date();
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const dateFormatted = `${day}${month}`;

    // Fetch existing data to calculate the next slot number
    const sheetId = process.env.GOOGLE_SHEET_ID;
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: sheetId,
      range: "A:A", // Column A holds the slot values
    });

    const existingData = response.data.values;
    const nextSlotNumber = existingData ? existingData.length + 1 : 1;
    const slot = `slot${nextSlotNumber}`;

    // Combine formData and slotAndDate into the required format
    const values = formData.map((item) => [
      item.name,
      item.mail,
      item.number,
      item.ageData,
      item.weighData,
      slot, // Include the dynamically calculated slot
      dateFormatted, // Include the formatted date
      slotAndDate.selectedDate || "", // Add `selectedDate` from `slotAndDate`
    ]);

    // Append the data to Google Sheets
    await sheets.spreadsheets.values.append({
      spreadsheetId: sheetId,
      range: "A1", // Adjust the range as needed
      valueInputOption: "USER_ENTERED",
      requestBody: {
        values,
      },
    });

    res.status(200).json({ message: "Data appended successfully" });
  } catch (error) {
    console.error("Error appending data to Google Sheets:", error);
    res.status(500).json({ message: "Internal Server Error", error });
  }
});

module.exports = router;
