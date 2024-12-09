require("dotenv").config();
const express = require("express");
const cors = require("cors");


const submitRoute = require("./routes/submit");
// const anotherApiRoute = require("./routes/anotherApi");   
const GetData = require("./routes/GetData");
const GetCalendarValue = require("./routes/GetCalendarValue");
const GetFilteredData = require("./routes/GetFilteredData")
const Accepted = require("./routes/Accepted")
const GetCalendarValueView = require("./routes/GetCalendarValueView")
const Performance = require("./routes/Performance")


const app = express();
const PORT = process.env.PORT || 5000;
app.use(cors()); // Enable CORS
// Middleware
app.use(express.json()); // Express's built-in JSON parser

// Routes
app.use("/api/submit", submitRoute); // Attach submit API    adminview uses this
app.use("/api/GetData", GetData); // Attach another API       adminview 
app.use("/api/GetCalendarValue", GetCalendarValue);  //admincalendar
app.use("/api/GetFilteredData", GetFilteredData); //adminconfirm
app.use("/api/Accepted", Accepted);  //adminconfirm
app.use("/api/GetCalendarValueView", GetCalendarValueView);  
app.use("/api/Performance", Performance)

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
