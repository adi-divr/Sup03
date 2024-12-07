require("dotenv").config();
const express = require("express");
const cors = require("cors");


const submitRoute = require("./routes/submit");
// const anotherApiRoute = require("./routes/anotherApi");

const app = express();
const PORT = process.env.PORT || 5000;
app.use(cors()); // Enable CORS
// Middleware
app.use(express.json()); // Express's built-in JSON parser

// Routes
app.use("/api/submit", submitRoute); // Attach submit API
// app.use("/api/another", anotherApiRoute); // Attach another API

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
