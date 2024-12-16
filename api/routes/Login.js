const bcrypt = require("bcryptjs");



module.exports =  function login (req, res)  {
  const { password } = req.body;

  const storedHashedPassword = process.env.HASHED_PASSWORD;

    bcrypt.compare(password, storedHashedPassword, (err, result) => {
  
    if (err) {
      console.error("Error comparing passwords:", err);
      return res.status(500).json({ message: "Internal Server Error" });
    }

    if (result) {
      return res.status(200).json({ message: "Login successful!" });
    } else {
      return res.status(401).json({ message: "Invalid password!" });
    }
  });
};