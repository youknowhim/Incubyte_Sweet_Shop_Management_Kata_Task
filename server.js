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


// AUTHENTICATION MIDDLEWARE
const authenticate = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ message: "Token missing" });

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ message: "Invalid token" });

    req.user = user;
    next();
  });
};

// SWEETS CRUD APIs AND SEARCH FUNCTIONALITY


// adding a sweet (user can add)
app.post("/api/sweets", auth, (req,res)=>{
    const {name,category,price,quantity} = req.body;
    
    if(!name || !category || !price || !quantity){
        return res.status(400).json({msg:"missing fields"});
    }
    const q = "INSERT INTO sweets(name,category,price,quantity) VALUES(?,?,?,?)"
    db.query(q,[name,category,price,quantity],(err)=>{
        if(err){
            console.log("insert err:", err);
            return res.status(500).json({msg:"db error"});
        }
        res.status(201).json({msg:"sweet added"});
    })
})



// get all sweets
app.get("/api/sweets", auth, (req,res)=>{
    db.query("SELECT * FROM sweets", (err,rows)=>{
        if(err){
            return res.status(500).json({msg:"db error"});
        }
        res.json(rows);
    });
})



// search sweets by queries
app.get("/api/sweets/search", auth, (req,res)=>{
    const {name,category,minPrice,maxPrice} = req.query;
    let sql = "SELECT * FROM sweets WHERE 1=1";
    let arr = [];

    if(name){
        sql += " AND name LIKE ?";
        arr.push(`%${name}%`);
    }
    if(category){
        sql += " AND category LIKE ?";
        arr.push(`%${category}%`);
    }
    if(minPrice){
        sql += " AND price >= ?";
        arr.push(minPrice);
    }
    if(maxPrice){
        sql += " AND price <= ?";
        arr.push(maxPrice);
    }

    db.query(sql,arr,(err,rows)=>{
        if(err){
            return res.status(500).json({msg:"db error"});
        }
        res.json(rows);
    })
})



// update a sweet
app.put("/api/sweets/:id", auth, (req,res)=>{
    const id = req.params.id;
    const {name,category,price,quantity} = req.body;
    if(!name || !category || !price || !quantity){
        return res.status(400).json({msg:"missing fields"});
    }
    const q = "UPDATE sweets SET name=?,category=?,price=?,quantity=? WHERE id=?";
    db.query(q,[name,category,price,quantity,id],(err)=>{
        if(err){
            console.log(err);
            return res.status(500).json({msg:"db error"});
        }
        res.json({msg:"updated"});
    })
})



// delete sweet (admin only)
app.delete("/api/sweets/:id", auth, checkAdmin, (req,res)=>{
    const id = req.params.id;
    db.query("DELETE FROM sweets WHERE id=?", [id], (err)=>{
        if(err){
            return res.status(500).json({msg:"db error"});
        }
        res.json({msg:"deleted"});
    })
})


