const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());

// MySQL Connection
const db = mysql.createConnection({
  host: "localhost",
  user: "root", // Change if needed
  password: "Sbl@2025", // Your MySQL password
  database: "server_inventory",
});

db.connect((err) => {
  if (err) {
    console.error("Database connection failed:", err);
    return;
  }
  console.log("✅ Connected to MySQL database");
});

// Fetch all servers from MySQL
app.get("/servers", (req, res) => {
  db.query("SELECT * FROM servers", (err, results) => {
    if (err) return res.status(500).send(err);

    // Convert JSON string fields back to arrays for frontend
    const formattedData = results.map((row) => ({
      ...row,
      serverName: JSON.parse(row.serverName || "[]"),
      serverIP: JSON.parse(row.serverIP || "[]"),
      dcDr: JSON.parse(row.dcDr || "[]"),
      liveUat: JSON.parse(row.liveUat || "[]"),
      remarks: JSON.parse(row.remarks || "[]"),
      publicIP: JSON.parse(row.publicIP || "[]"),
      purpose: JSON.parse(row.purpose || "[]"),
    }));

    res.json(formattedData);
  });
});

// Insert a new row
app.post("/servers", (req, res) => {
  const newServer = req.body;

  const sql = `
    INSERT INTO servers 
    (serverName, serverIP, dcDr, liveUat, remarks, publicIP, purpose, implementationYear, 
    vendorName, vendorSupportL1, vendorSupportL2, bankSupportL1, bankSupportL2, roleOfPerson, 
    serverType, osVersion, ipAddress, serverAdmin, dbTypeVersion, dbIPAddress)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  const values = [
    JSON.stringify(newServer.serverName),
    JSON.stringify(newServer.serverIP),
    JSON.stringify(newServer.dcDr),
    JSON.stringify(newServer.liveUat),
    JSON.stringify(newServer.remarks),
    JSON.stringify(newServer.publicIP),
    JSON.stringify(newServer.purpose),
    newServer.implementationYear,
    newServer.vendorName,
    newServer.vendorSupportL1,
    newServer.vendorSupportL2,
    newServer.bankSupportL1,
    newServer.bankSupportL2,
    newServer.roleOfPerson,
    newServer.serverType,
    newServer.osVersion,
    newServer.ipAddress,
    newServer.serverAdmin,
    newServer.dbTypeVersion,
    newServer.dbIPAddress,
  ];

  db.query(sql, values, (err, results) => {
    if (err) return res.status(500).send(err);
    res.json({ id: results.insertId, ...newServer });
  });
});

// Update an existing row
app.put("/servers/:id", (req, res) => {
  const { id } = req.params;
  const updatedData = req.body;

  const sql = `
    UPDATE servers SET 
    serverName=?, serverIP=?, dcDr=?, liveUat=?, remarks=?, publicIP=?, purpose=?, 
    implementationYear=?, vendorName=?, vendorSupportL1=?, vendorSupportL2=?, bankSupportL1=?, 
    bankSupportL2=?, roleOfPerson=?, serverType=?, osVersion=?, ipAddress=?, serverAdmin=?, 
    dbTypeVersion=?, dbIPAddress=? WHERE id=?
  `;

  const values = [
    JSON.stringify(updatedData.serverName),
    JSON.stringify(updatedData.serverIP),
    JSON.stringify(updatedData.dcDr),
    JSON.stringify(updatedData.liveUat),
    JSON.stringify(updatedData.remarks),
    JSON.stringify(updatedData.publicIP),
    JSON.stringify(updatedData.purpose),
    updatedData.implementationYear,
    updatedData.vendorName,
    updatedData.vendorSupportL1,
    updatedData.vendorSupportL2,
    updatedData.bankSupportL1,
    updatedData.bankSupportL2,
    updatedData.roleOfPerson,
    updatedData.serverType,
    updatedData.osVersion,
    updatedData.ipAddress,
    updatedData.serverAdmin,
    updatedData.dbTypeVersion,
    updatedData.dbIPAddress,
    id,
  ];

  db.query(sql, values, (err) => {
    if (err) return res.status(500).send(err);
    res.json({ message: "✅ Data updated successfully!" });
  });
});

// Start Server
app.listen(5000, () => {
  console.log("🚀 Server running on port 5000");
});
