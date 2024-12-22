// const { google } = require('googleapis');

// module.exports = async function GetData(req, res) {
//     if (req.method !== 'GET') {
//         return res.status(405).json({ message: 'Only GET requests are allowed' });
//     }

//     try {
//         const auth = new google.auth.GoogleAuth({
//             credentials: {
//                 client_email: process.env.GOOGLE_CLIENT_EMAIL,
//                 private_key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n'),
//             },
//             scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
//         });

//         const sheets = google.sheets({ version: 'v4', auth });

//         const range = 'Sheet1!A1:H';

//         const response = await sheets.spreadsheets.values.get({
//             spreadsheetId: process.env.GOOGLE_SHEET_ID,
//             range,
//         });

//         const rows = response.data.values;

//         if (rows && rows.length) {
//             const groupedData = {};

//             rows.forEach(row => {
//                 const slot = row[5]; 
//                 if (!groupedData[slot]) {
//                     groupedData[slot] = [row]; 
//                 }
//             });

//             const result = Object.values(groupedData).map(group => group[0]);

//             return res.status(200).json({ data: result });
//         } else {
//             return res.status(404).json({ message: 'No data found' });
//         }
//     } catch (error) {
//         return res.status(500).json({ message: 'Internal Server Error', error });
//     }
// };
const { google } = require('googleapis');

module.exports = async function GetData(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Only GET requests are allowed' });
  }

  try {
    const auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: process.env.GOOGLE_CLIENT_EMAIL,
        private_key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n'),
      },
      scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
    });

    const sheets = google.sheets({ version: 'v4', auth });

    // Fetch data from the first sheet
    const sheet1Response = await sheets.spreadsheets.values.get({
      spreadsheetId: process.env.GOOGLE_SHEET_ID,
      range: 'Sheet1!A1:I',
    });
    const sheet1Rows = sheet1Response.data.values || [];

    // Fetch data from the second sheet
    const sheet2Response = await sheets.spreadsheets.values.get({
      spreadsheetId: process.env.GOOGLE_SHEET_ID2,
      range: 'Sheet1!A1:G',
    });
    const sheet2Rows = sheet2Response.data.values || [];

    // Filter out rows with status 'R' from sheet1
    const filteredSheet1 = sheet1Rows.filter((row, index) => {
      if (index === 0) return true; // Keep headers

      return row[8] !== 'R';
    });
    // Extract slot IDs from sheet2 for filtering
    const sheet2SlotIDs = new Set(sheet2Rows.map((row, index) => {
      if (index === 0) return null; // Skip headers
      return row[5]; // SLOTID column
    }).filter(Boolean));

    // Remove rows from sheet1 where slot matches any SLOTID in sheet2
    const finalData = filteredSheet1.filter((row, index) => {
      if (index === 0) return true; // Keep headers
      return !sheet2SlotIDs.has(row[5]); // Compare SLOT column
    });

    // Return the filtered data
    if (finalData.length > 1) {
        console.log("this note ",finalData)

      return res.status(200).json({ data: finalData });
    } else {
      return res.status(404).json({ message: 'No relevant data found' });
    }
  } catch (error) {
    return res.status(500).json({ message: 'Internal Server Error', error });
  }
};