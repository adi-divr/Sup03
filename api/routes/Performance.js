// const { google } = require('googleapis');

// module.exports = async function Performance(req, res) {
//     if (req.method !== 'GET') {
//         return res.status(405).json({ message: 'Only GET requests are allowed' });
//     }

//     const { month, year } = req.query;

//     if (!month || !year) {
//         return res.status(400).json({ message: 'Month and year are required in the query params' });
//     }

//     try {
//         const auth = new google.auth.GoogleAuth({
//             credentials: {
//                 client_email: process.env.GOOGLE_CLIENT_EMAIL,
//                 private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
//             },
//             scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
//         });

//         const sheets = google.sheets({ version: 'v4', auth });

//         const range = 'A2:F';
//         const sheetDataResponse = await sheets.spreadsheets.values.get({
//             spreadsheetId: process.env.GOOGLE_SHEET_ID2,
//             range,
//         });

//         const rows = sheetDataResponse.data.values || [];
//         let totalSlots = 0;
//         const uniqueSlotPayments = {}; 

//         rows.forEach(row => {
//             const [ , , bookedDate, totalSlotsCount, payment, slotId] = row;
//             if (bookedDate && bookedDate.startsWith(`${year}-${month.padStart(2, '0')}`)) {
//                 totalSlots += parseInt(totalSlotsCount || '0', 10);

//                 if (slotId && !uniqueSlotPayments[slotId]) {
//                     uniqueSlotPayments[slotId] = parseInt(payment || '0', 10);
//                 }
//             }
//         });

//         const totalPayment = Object.values(uniqueSlotPayments).reduce((acc, payment) => acc + payment, 0);

//         return res.status(200).json({
//             totalSlots,
//             totalPayment,
//         });
//     } catch (error) {
//         console.error('Error fetching data:', error);
//         return res.status(500).json({ message: 'Internal Server Error', error });
//     }
// };



const { google } = require('googleapis');

module.exports = async function GetAcceptedPaymentInfo(req, res) {
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
        private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\n/g, '\n'),
      },
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });

    const sheets = google.sheets({ version: 'v4', auth });

    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: process.env.GOOGLE_SHEET_ID2,
      range: 'A1:F',
    });

    const data = response.data.values;
    if (!data || data.length <= 1) {
      return res.status(404).json({ message: 'No data found in the sheet' });
    }

    const headers = data[0];
    const rows = data.slice(1);

    const bookingDateIndex = headers.indexOf('Booked Date');
    const paymentIndex = headers.indexOf('Total Payment');
    const slotIDIndex = headers.indexOf('SLOTID');

    if (
      bookingDateIndex === -1 ||
      paymentIndex === -1 ||
      slotIDIndex === -1
    ) {
      return res.status(400).json({ message: 'Invalid sheet structure' });
    }


    const queryMonth = String(month).padStart(2, '0');
    const queryYear = String(year);


    const filteredData = rows.filter((row) => {
      const bookingDate = row[bookingDateIndex];
      

      if (!bookingDate) return false;

      const [yyyy, mm] = bookingDate.split('-').map((part) => part.trim());
     

      return yyyy === queryYear && mm === queryMonth;
    });


    const weekData = Array(4).fill(0).map(() => ({ slots: new Set(), payment: 0 }));

    filteredData.forEach((row) => {
      const date = new Date(row[bookingDateIndex]);

      const payment = parseFloat(row[paymentIndex]) || 0;
      const slot = row[slotIDIndex];

      if (isNaN(date)) return;

      const week = Math.floor((date.getDate() - 1) / 7); 

      if (week < 0 || week >= 4) return;

      if (!weekData[week].slots.has(slot)) {
        weekData[week].slots.add(slot);
        weekData[week].payment += payment;
      }
    });

    const acceptedSlots = weekData.map((week) => week.slots.size);
    const payments = weekData.map((week) => week.payment);


    return res.status(200).json({
      acceptedSlots,
      payments,
    });
  } catch (error) {
    console.error('Error processing request:', error);
    return res.status(500).json({ message: 'Internal Server Error', error });
  }
};

// const { google } = require('googleapis');

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

