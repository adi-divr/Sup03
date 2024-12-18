
// const { google } = require('googleapis');

// module.exports = async function Performance(req, res) {
//   if (req.method !== 'GET') {
//     return res.status(405).json({ message: 'Only GET method is allowed' });
//   }

//   const { month, year } = req.query;

//   if (!month || !year) {
//     return res.status(400).json({ message: 'Month and year are required as query parameters' });
//   }

//   try {
//     const auth = new google.auth.GoogleAuth({
//       credentials: {
//         client_email: process.env.GOOGLE_CLIENT_EMAIL,
//         private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\n/g, '\n'),
//       },
//       scopes: ['https://www.googleapis.com/auth/spreadsheets'],
//     });

//     const sheets = google.sheets({ version: 'v4', auth });

//     const response = await sheets.spreadsheets.values.get({
//       spreadsheetId: process.env.GOOGLE_SHEET_ID2,
//       range: 'A1:F',
//     });

//     const data = response.data.values;
//     if (!data || data.length <= 1) {
//       return res.status(404).json({ message: 'No data found in the sheet' });
//     }

//     const headers = data[0];
//     const rows = data.slice(1);

//     const bookingDateIndex = headers.indexOf('Booked Date');
//     const paymentIndex = headers.indexOf('Total Payment');
//     const slotIDIndex = headers.indexOf('SLOTID');

//     if (
//       bookingDateIndex === -1 ||
//       paymentIndex === -1 ||
//       slotIDIndex === -1
//     ) {
//       return res.status(400).json({ message: 'Invalid sheet structure' });
//     }

//     const filteredData = rows.filter((row) => {
//       const bookingDate = row[bookingDateIndex];
//       if (!bookingDate) return false;

//       const [yyyy, mm] = bookingDate.split('-');
//       return yyyy === year && mm === month;
//     });

//     const weekData = Array(4).fill(0).map(() => ({ slots: new Set(), payment: 0 }));

//     filteredData.forEach((row) => {
//       const bookingDate = row[bookingDateIndex];
//       const payment = parseFloat(row[paymentIndex]) || 0;
//       const slot = row[slotIDIndex];

//       if (!bookingDate || !slot) return;

//       const date = new Date(bookingDate);
//       if (isNaN(date)) return;

//       const week = Math.floor((date.getDate() - 1) / 7); 
//       if (week < 0 || week >= 4) return;

//       if (!weekData[week].slots.has(slot)) {
//         weekData[week].slots.add(slot);
//         weekData[week].payment += payment;
//       }
//     });

//     const acceptedSlots = weekData.map((week) => week.slots.size);
//     const payments = weekData.map((week) => week.payment);

//     return res.status(200).json({
//       acceptedSlots,
//       payments,
//     });
//   } catch (error) {
//     console.error('Error processing request:', error);
//     return res.status(500).json({ message: 'Internal Server Error', error });
//   }
// };*******************************************************************************************************

// const { google } = require('googleapis');

// module.exports = async function Performance(req, res) {
//   if (req.method !== 'GET') {
//     return res.status(405).json({ message: 'Only GET method is allowed' });
//   }

//   const { month, year } = req.query;
// console.log(month, year)
//   if (!month || !year) {
//     return res.status(400).json({ message: 'Month and year are required as query parameters' });
//   }

//   try {
//     const auth = new google.auth.GoogleAuth({
//       credentials: {
//         client_email: process.env.GOOGLE_CLIENT_EMAIL,
//         private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
//       },
//       scopes: ['https://www.googleapis.com/auth/spreadsheets'],
//     });

//     const sheets = google.sheets({ version: 'v4', auth });

//     // Fetch data from both sheets
//     const [sheet1Data, sheet2Data] = await Promise.all([
//       sheets.spreadsheets.values.get({ spreadsheetId: process.env.GOOGLE_SHEET_ID, range: 'A1:I' }),
//       sheets.spreadsheets.values.get({ spreadsheetId: process.env.GOOGLE_SHEET_ID2, range: 'A1:F' }),
//     ]);

//     const sheet1 = sheet1Data.data.values; // Rejected data
//     const sheet2 = sheet2Data.data.values; // Accepted and payment data

//     if (!sheet1 || !sheet2) return res.status(404).json({ message: 'No data found in the sheets' });

//     // Parsing headers
//     const sheet1Headers = sheet1[0];
//     const sheet2Headers = sheet2[0];

//     const sheet1Rows = sheet1.slice(1);
//     const sheet2Rows = sheet2.slice(1);

//     // Sheet1 indexes for rejected logic
//     const sheet1DateIndex = sheet1Headers.indexOf('Date');
//     const sheet1StatusIndex = sheet1Headers.indexOf('Status');
//     const sheet1SlotIndex = sheet1Headers.indexOf('SLOT');

//     // Sheet2 indexes for accepted and payment logic
//     const sheet2DateIndex = sheet2Headers.indexOf('Booked Date');
//     const sheet2SlotIDIndex = sheet2Headers.indexOf('SLOTID');
//     const sheet2PaymentIndex = sheet2Headers.indexOf('Total Payment');

//     // Initialize weeks
//     const weeks = Array(4).fill(0).map(() => ({
//       accepted: new Set(),
//       rejected: new Set(),
//       payment: 0,
//     }));

//     // Calculate rejected (sheet1)
//     sheet1Rows.forEach((row) => {
//       const dateStr = row[sheet1DateIndex];
//       const status = row[sheet1StatusIndex];
//       const slot = row[sheet1SlotIndex];

//       if (!dateStr || !status || !slot) return;

//       const date = new Date(dateStr);
//       if (date.getFullYear() === parseInt(year) && date.getMonth() + 1 === parseInt(month)) {
//         const week = Math.floor((date.getDate() - 1) / 7);
//         if (status === 'R') {
//           weeks[week].rejected.add(slot);
//         }
//       }
//     });

//     // Calculate accepted and payment (sheet2)
//     sheet2Rows.forEach((row) => {
//       const dateStr = row[sheet2DateIndex];
//       const slotID = row[sheet2SlotIDIndex];
//       const payment = parseFloat(row[sheet2PaymentIndex] || 0);

//       if (!dateStr || !slotID) return;

//       const date = new Date(dateStr);
//       if (date.getFullYear() === parseInt(year) && date.getMonth() + 1 === parseInt(month)) {
//         const week = Math.floor((date.getDate() - 1) / 7);
//         if (!weeks[week].accepted.has(slotID)) {
//           weeks[week].accepted.add(slotID);
//           weeks[week].payment += payment;
//         }
//       }
//     });

//     // Format the response
//     const result = weeks.map((week, index) => ({
//       week: `WEEK ${index + 1}`,
//       acceptedSlots: week.accepted.size,
//       rejectedSlots: week.rejected.size,
//       totalRevenue: week.payment,
//     }));
//     console.log(result)

//     return res.status(200).json(result);
//   } catch (error) {
//     console.error('Error processing request:', error);
//     return res.status(500).json({ message: 'Internal Server Error', error });
//   }
// }; works but sends bad data

const { google } = require('googleapis');

module.exports = async function Performance(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Only GET method is allowed' });
  }

  const { month, year } = req.query;

  if (!month || !year) {
    return res.status(400).json({ message: 'Month and year are required as query parameters' });
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

    const [sheet1Data, sheet2Data] = await Promise.all([
      sheets.spreadsheets.values.get({ spreadsheetId: process.env.GOOGLE_SHEET_ID, range: 'A1:I' }),
      sheets.spreadsheets.values.get({ spreadsheetId: process.env.GOOGLE_SHEET_ID2, range: 'A1:F' }),
    ]);

    const sheet1 = sheet1Data.data.values; // Rejected data
    const sheet2 = sheet2Data.data.values; // Accepted and payment data

    if (!sheet1 || !sheet2) return res.status(404).json({ message: 'No data found in the sheets' });

    const sheet1Headers = sheet1[0];
    const sheet2Headers = sheet2[0];

    const sheet1Rows = sheet1.slice(1);
    const sheet2Rows = sheet2.slice(1);

    const sheet1DateIndex = sheet1Headers.indexOf('Date');
    const sheet1StatusIndex = sheet1Headers.indexOf('Status');
    const sheet1SlotIndex = sheet1Headers.indexOf('SLOT');

    const sheet2DateIndex = sheet2Headers.indexOf('Booked Date');
    const sheet2SlotIDIndex = sheet2Headers.indexOf('SLOTID');
    const sheet2PaymentIndex = sheet2Headers.indexOf('Total Payment');

    const acceptedSlots = [0, 0, 0, 0];
    const rejectedSlots = [0, 0, 0, 0];
    const payments = [0, 0, 0, 0];

    const weekSlotIDs = Array(4).fill(null).map(() => new Set());

    sheet1Rows.forEach((row) => {
      const dateStr = row[sheet1DateIndex];
      const status = row[sheet1StatusIndex];
      const slot = row[sheet1SlotIndex];

      if (!dateStr || !status || !slot) return;

      const date = new Date(dateStr);
      if (date.getFullYear() === parseInt(year) && date.getMonth() + 1 === parseInt(month)) {
        const week = Math.floor((date.getDate() - 1) / 7);
        if (status === 'R') {
          rejectedSlots[week] += 1; // Increment rejected count
        }
      }
    });

    sheet2Rows.forEach((row) => {
      const dateStr = row[sheet2DateIndex];
      const slotID = row[sheet2SlotIDIndex];
      const payment = parseFloat(row[sheet2PaymentIndex] || 0);

      if (!dateStr || !slotID) return;

      const date = new Date(dateStr);
      if (date.getFullYear() === parseInt(year) && date.getMonth() + 1 === parseInt(month)) {
        const week = Math.floor((date.getDate() - 1) / 7);

        if (!weekSlotIDs[week].has(slotID)) {
          weekSlotIDs[week].add(slotID);
          acceptedSlots[week] += 1; // Increment accepted slots
          payments[week] += payment; // Add the payment
        }
      }
    });

    return res.status(200).json({
      acceptedSlots,
      rejectedSlots,
      payments,
    });
  } catch (error) {
    console.error('Error processing request:', error);
    return res.status(500).json({ message: 'Internal Server Error', error });
  }
};










// const { google } = require('googleapis');  //this has rejected********************************************

// module.exports = async function WeeklyAnalysis(req, res) {
//   if (req.method !== 'GET') {
//     return res.status(405).json({ message: 'Only GET method is allowed' });
//   }

//   const { month, year } = req.query;

//   if (!month || !year) {
//     return res.status(400).json({ message: 'Month and year are required query parameters.' });
//   }

//   try {
//     const auth = new google.auth.GoogleAuth({
//       credentials: {
//         client_email: process.env.GOOGLE_CLIENT_EMAIL,
//         private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\n/g, '\n'),
//       },
//       scopes: ['https://www.googleapis.com/auth/spreadsheets'],
//     });

//     const sheets = google.sheets({ version: 'v4', auth });

//     // Fetch accepted and payment data
//     const acceptedResponse = await sheets.spreadsheets.values.get({
//       spreadsheetId: process.env.GOOGLE_SHEET_ID2,
//       range: 'A1:F',
//     });
//     const acceptedData = acceptedResponse.data.values || [];

//     // Fetch rejected data
//     const rejectedResponse = await sheets.spreadsheets.values.get({
//       spreadsheetId: process.env.GOOGLE_SHEET_ID,
//       range: 'A1:H',
//     });
//     const rejectedData = rejectedResponse.data.values || [];

//     const filteredAccepted = acceptedData.slice(1).filter((row) => {
//       const [,, bookingDate] = row;
//       const [bookingYear, bookingMonth] = bookingDate.split('-');
//       return bookingYear === year && bookingMonth === month;
//     });

//     const weeklyAccepted = {};
//     const weeklyPayments = {};

//     filteredAccepted.forEach(([,, bookingDate, , paymentMade, slotID]) => {
//       const week = getWeekOfMonth(new Date(bookingDate));
//       if (!weeklyAccepted[week]) weeklyAccepted[week] = new Set();
//       if (!weeklyPayments[week]) weeklyPayments[week] = 0;

//       if (!weeklyAccepted[week].has(slotID)) {
//         weeklyAccepted[week].add(slotID);
//         weeklyPayments[week] += parseFloat(paymentMade);
//       }
//     });

//     // Filter rejected data by month and year
//     const filteredRejected = rejectedData.slice(1).filter((row) => {
//       const [, , , , , slotID, , date] = row;
//       const [rejectYear, rejectMonth] = date.split('-');
//       return rejectYear === year && rejectMonth === month;
//     });

//     const weeklyRejected = {};

//     filteredRejected.forEach(([,, , , , slotID, , date]) => {
//       const week = getWeekOfMonth(new Date(date));
//       if (!weeklyRejected[week]) weeklyRejected[week] = new Set();
//       weeklyRejected[week].add(slotID);
//     });

//     const rejectionsByWeek = Object.keys(weeklyRejected).map((week) => {
//       const acceptedSlots = weeklyAccepted[week] || new Set();
//       const rejectedSlots = [...weeklyRejected[week]].filter((slot) => !acceptedSlots.has(slot));
//       return rejectedSlots.length;
//     });

//     const acceptedSlotCounts = Object.values(weeklyAccepted).map((set) => set.size);
//     const payments = Object.values(weeklyPayments);

//     return res.status(200).json([
//       acceptedSlotCounts,
//       payments,
//       rejectionsByWeek,
//     ]);
//   } catch (error) {
//     console.error('Error processing request:', error);
//     return res.status(500).json({ message: 'Internal Server Error', error });
//   }
// };

// // Helper function
// function getWeekOfMonth(date) {
//   const startWeekDayIndex = 0; // Assuming week starts on Sunday
//   const firstDay = new Date(date.getFullYear(), date.getMonth(), 1).getDay();
//   const offsetDate = date.getDate() + firstDay - startWeekDayIndex;
//   return Math.ceil(offsetDate / 7);
// }

