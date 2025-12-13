require("dotenv").config();
const express = require("express");
const mysql = require("mysql");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());


// DATABASE
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
});

db.connect((err) => {
  if (err) throw err;
  console.log("MySQL Connected");
});

// Auth

// Register code
app.post("/api/auth/register", async (req, res) => {
  const { name, email, password, role } = req.body;

  db.query("SELECT * FROM users WHERE email=?", [email], async (err, rows) => {
    if (rows.length > 0) return res.status(400).json({ message: "Email already exists" });

    const hashed = await bcrypt.hash(password, 10);

    db.query(
      "INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)",
      [name, email, hashed, role || "user"],
      () => res.status(201).json({ message: "User registered" })
    );
  });
});


// login code
app.post("/api/auth/login", (req, res) => {
  const { email, password } = req.body;

  db.query("SELECT * FROM users WHERE email=?", [email], async (err, rows) => {
    if (rows.length === 0) return res.status(401).json({ message: "Invalid credentials" });

    const user = rows[0];
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(401).json({ message: "Invalid credentials" });

    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.json({ token, role: user.role });
  });
});

module.exports = app;
app.listen(5000, () => console.log("Server running"));
