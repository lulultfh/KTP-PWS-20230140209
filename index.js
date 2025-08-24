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

db.query("SELECT * from todos", (err, todos) => {
    if (err) return res.status(500).send("Internal Server Error");
    res.render("todo", {
      todos: todos,
      layout: "layouts/main-layout",
    });
  });