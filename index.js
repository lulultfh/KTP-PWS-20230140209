require("dotenv").config();
const express = require("express");
const app = express();
const db = require("./db/db.js");

app.use(express.json());
app.get("/ktp-data", (req, res) => {  
  db.query('SELECT * FROM ktp', (err, results) => {
        if (err) return res.status(500).send('Internal Server Error');
        res.json(results);
    });
});

app.get('/:nik', (req, res) => {
    db.query('SELECT * FROM ktp WHERE nik = ?', [req.params.id], (err, results) => {
        if (err) return res.status(500).send('Internal Server Error');
        if (results.length === 0) return res.status(404).send('Tugas tidak ditemukan');
        res.json(results[0]);
    });
});