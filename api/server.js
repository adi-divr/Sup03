require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require('path')

const submitRoute = require("./routes/submit");
// const anotherApiRoute = require("./routes/anotherApi");   
const GetData = require("./routes/GetData");
const GetCalendarValue = require("./routes/GetCalendarValue");
const GetFilteredData = require("./routes/GetFilteredData")
const Accepted = require("./routes/Accepted")
const GetCalendarValueView = require("./routes/GetCalendarValueView")
const Performance = require("./routes/Performance")
const login = require("./routes/Login")
const Reject = require("./routes/Rejected")
const BlockDate = require("./routes/SubmitDate")
const GetBlockedDate = require("./routes/GetBlockedDate")
const GetSlots = require("./routes/GetSlotValue")

const GetDatesInRange = require("./routes/AdminBlockedDates")



const app = express();
const PORT = process.env.PORT || 5000;

//env change in both front and back
//cors change in backend
//app serve static open it

const corsOptions = {
  origin: 'https://sup-kochi.azurewebsites.net/', // Allow only the GitHub Pages origin
  methods: ['GET', 'POST'], // Allow GET and POST requests
  credentials: true,
}; 

 app.use(cors(corsOptions));


// Middleware
app.use(express.json()); 
// app.use((req, res, next) => {
//   console.log(`${req.method} ${req.url}`);
//   next();
// });


app.use("/api/submit", submitRoute); // Attach submit API    adminview uses this
app.use("/api/GetData", GetData); // Attach another API       adminview 
app.use("/api/GetCalendarValue", GetCalendarValue);  //admincalendar
app.use("/api/GetFilteredData", GetFilteredData); //adminconfirm
app.use("/api/Accepted", Accepted);  //adminconfirm
app.use("/api/GetCalendarValueView", GetCalendarValueView);  
app.use("/api/Performance", Performance)
app.use("/api/login", login)
app.use("/api/reject", Reject)
app.use("/api/BlockDate", BlockDate)
app.use("/api/GetBlockedDate", GetBlockedDate)
app.use("/api/GetSlots", GetSlots)
app.use("/api/GetDatesInRange", GetDatesInRange)

 app.use(express.static(path.join(__dirname, 'build')));

  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'build', 'index.html'));
  });
// console.log('Serving static files from:', path.join(__dirname, 'build'));

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
