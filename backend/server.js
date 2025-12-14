
require("dotenv").config();
const express = require("express");
const mysql = require("mysql");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());

//MySQL DATABASE CONNECTION
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


// MIDDLEWARES

// AUTH
const auth = (req,res,next)=>{
  const token = req.headers.authorization?.split(" ")[1];
  if(!token){
    return res.status(401).json({message:"Token missing"});
  }

  jwt.verify(token, process.env.JWT_SECRET, (err,user)=>{
    if(err){
      return res.status(403).json({message:"Invalid token"});
    }
    req.user = user;
    next();
  });
};

// Admin_CHECK
const isAdmin = (req,res,next)=>{
  if(req.user.role !== "admin"){
    return res.status(403).json({message:"Admin only"});
  }
  next();
};


//APIs

// register
// register
app.get("/", (req, res) => {
  res.send("Sweet Shop is running...");
});

app.post("/api/auth/register", async (req,res)=>{
  const {name,email,password,role,isTestUser} = req.body;

  db.query("SELECT * FROM users WHERE email=?", [email], async (err,rows)=>{
    if(err){
      console.log(err);
      return res.status(500).json({message:"db error"});
    }

    if(rows && rows.length>0){
      return res.status(400).json({message:"Email already exists"});
    }

    const hashed = await bcrypt.hash(password,10);

    db.query(
      "INSERT INTO users (name,email,password,role,isTestUser) VALUES (?,?,?,?,?)",
      [name,email,hashed,role || "user", isTestUser || false],
      (err2)=>{
        if(err2){
          console.log(err2);
          return res.status(500).json({message:"db error"});
        }
        return res.status(201).json({message:"User registered"});
      }
    );
  });
});



// login
app.post("/api/auth/login", (req, res) => {
  const { email, password } = req.body;

  db.query("SELECT * FROM users WHERE email=?", [email], async (err, rows) => {
    if (err) {
      console.log(err);
      return res.status(500).json({ message: "db error" });
    }

    if (!rows || rows.length === 0) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const user = rows[0];
    const valid = await bcrypt.compare(password, user.password);

    if (!valid) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.json({ token, role: user.role });
  });
});




// SWEETS CRUD

// add sweet
app.post("/api/sweets", auth, (req,res)=>{
  const {name,category,price,quantity} = req.body;

  if(!name || !category || !price || !quantity){
    return res.status(400).json({msg:"missing fields"});
  }

  db.query(
    "INSERT INTO sweets(name,category,price,quantity) VALUES(?,?,?,?)",
    [name,category,price,quantity],
    (err)=>{
      if(err) return res.status(500).json({msg:"db error"});
      res.status(201).json({msg:"sweet added"});
    }
  );
});


// get all sweets
app.get("/api/sweets", auth, (req,res)=>{
  db.query("SELECT * FROM sweets",(err,rows)=>{
    if(err) return res.status(500).json({msg:"db error"});
    res.json(rows);
  });
});


// search sweets
app.get("/api/sweets/search", auth, (req, res) => {
  const { q, minPrice, maxPrice } = req.query;

  let sql = "SELECT * FROM sweets WHERE 1=1";
  let params = [];

  if (q) {
    sql += " AND (name LIKE ? OR category LIKE ?)";
    params.push(`%${q}%`, `%${q}%`);
  }

  if (minPrice) {
    sql += " AND price >= ?";
    params.push(minPrice);
  }

  if (maxPrice) {
    sql += " AND price <= ?";
    params.push(maxPrice);
  }

  db.query(sql, params, (err, rows) => {
    if (err) return res.status(500).json({ msg: "db error" });
    res.json(rows);
  });
});



// update sweet
app.put("/api/sweets/:id", auth, (req,res)=>{

  const {id} = req.params;
  const {name,category,price,quantity} = req.body;

  if(!name || !category || !price || !quantity){
    return res.status(400).json({msg:"missing fields"});
  }

  db.query(
    "UPDATE sweets SET name=?,category=?,price=?,quantity=? WHERE id=?",
    [name,category,price,quantity,id],
    (err)=>{
      if(err) return res.status(500).json({msg:"db error"});
      res.json({msg:"updated"});
    }
  );
});


// delete sweet (admin)
app.delete("/api/sweets/:id", auth, isAdmin, (req,res)=>{
  const {id} = req.params;

  db.query("DELETE FROM sweets WHERE id=?", [id], (err)=>{
    if(err) return res.status(500).json({msg:"db error"});
    res.json({msg:"deleted"});
  });
});



//INVENTORY APIs

// purchase
app.post("/api/sweets/:id/purchase", auth, (req,res)=>{
  const {id} = req.params;

  db.query("SELECT quantity FROM sweets WHERE id=?", [id], (err,rows)=>{
    if(rows.length===0){
      return res.status(404).json({message:"Not found"});
    }

    const qty = rows[0].quantity;

    if(qty <= 0){
      return res.status(400).json({message:"Out of stock"});
    }

    db.query("UPDATE sweets SET quantity = quantity - 1 WHERE id=?", [id]);
    res.json({message:"Purchased"});
  });
});


// restock
app.post("/api/sweets/:id/restock", auth, isAdmin, (req,res)=>{
  const {id} = req.params;
  const {amount} = req.body;

  if(!amount){
    return res.status(400).json({message:"amount required"});
  }

  db.query(
    "UPDATE sweets SET quantity = quantity + ? WHERE id=?",
    [amount,id],
    (err)=>{
      if(err) return res.status(500).json({message:"db error"});
      res.json({message:"Restocked"});
    }
  );
});



// exporting app for tests
module.exports = {app,db};

  app.listen(5000, () => {
    console.log("Server running on http://localhost:5000");
  });


