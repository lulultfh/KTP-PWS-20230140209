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
        if (results.length === 0) return res.status(404).send('KTP tidak ditemukan');
        res.json(results[0]);
    });
});

app.post('/ktp-data', (req, res) => {
    const { nik, nama, tempat_lahir, tanggal_lahir, jns_kelamin, alamat, agama, status_kawin, pekerjaan, kewarganegaraan } = req.body;
    if (!nik || !nama || !tempat_lahir || !tanggal_lahir || !jns_kelamin || !alamat || !agama|| !status_kawin || !pekerjaan || !kewarganegaraan) {
        return res.status(400).send('Semua kolom wajib diisi!');
    }
    const query = 'INSERT INTO ktp (nik, nama, tempat_lahir, tanggal_lahir, jns_kelamin, alamat, agama, status_kawin, pekerjaan, kewarganegaraan) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
    const values = [nik.trim(), jns_kelamin.trim(), agama.trim()];

    db.query(query, values, (err) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).send('Internal Server Error');
        }

        const newKTP = {
            nik: nik.trim(),
            nama: nama,
            tempat_lahir: tempat_lahir,
            tanggal_lahir: tanggal_lahir,
            jns_kelamin: jns_kelamin.trim(),
            alamat: alamat,
            agama: agama.trim(),
            status_kawin: status_kawin,
            pekerjaan: pekerjaan,
            kewarganegaraan: kewarganegaraan
        };

        res.status(201).json(newKTP);
    });
});