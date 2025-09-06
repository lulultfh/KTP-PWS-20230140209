const express = require("express");
const router = express.Router();
const db = require("../db/db.js");

router.get("/", (req,res) => {
    db.query("SELECT * FROM ktp", (err,result) =>{
        if(err) return res.status(500).json({error: 'Terjadi kesalahan pada server.'});
        res.json(result);
    })
})

router.get('/:nik', (req, res) => {
    db.query('SELECT * FROM ktp WHERE nik = ?', [req.params.nik], (err, results) => {
        if (err) return res.status(500).send('Internal Server Error');
        if (results.length === 0) return res.status(404).send('Data tidak ditemukan');
        res.json(results[0]);
    });
});

router.post('/',(req,res)=> {
    const {nik, nama, tempat_lahir, tanggal_lahir, jns_kelamin, alamat, agama, status_kawin, pekerjaan, kewarganegaraan
    } = req.body;
    if (!nik || !nama || !tempat_lahir || !tanggal_lahir || !jns_kelamin || !alamat || !agama || !status_kawin || !kewarganegaraan) {
        return res.status(400).send('Semua kolom wajib diisi!');
    }

    const query = 'INSERT INTO ktp (nik, nama, tempat_lahir, tanggal_lahir, jns_kelamin, alamat, agama, status_kawin, pekerjaan, kewarganegaraan) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
    const values = [nik.trim(), nama.trim(), tempat_lahir.trim(), tanggal_lahir, jns_kelamin.trim(), alamat.trim(), agama.trim(), status_kawin.trim(), pekerjaan ? pekerjaan.trim() : null,  kewarganegaraan.trim()];

    // db.query(query, values, (err) => {
    //     if (err) {
    //         console.error('Database error:', err);
    //         return res.status(500).send('Internal Server Error');
    //     }

    //     const newData = {
    //         nik: nik.trim(),
    //         nama: nama.trim(),
    //         tempat_lahir: tempat_lahir.trim(),
    //         tanggal_lahir: tanggal_lahir,
    //         jns_kelamin: jns_kelamin.trim(),
    //         alamat: alamat.trim(),
    //         agama: agama.trim(),
    //         status_kawin: status_kawin.trim(),
    //         pekerjaan ? pekerjaan.trim() : null,
    //         kewarganegaraan: kewarganegaraan.trim()
    //     };

    //     res.status(201).json(newData);
    // });
    db.query(query, values, (err, result) => {
        if (err) {
            if (err.code === 'ER_DUP_ENTRY') {
                return res.status(409).json({ error: 'NIK yang Anda masukkan sudah terdaftar.' });
            }
            console.error('Database error:', err);
            return res.status(500).json({ error: 'Terjadi kesalahan pada server.' });
        }

        res.status(201).json({
            message: 'Data KTP berhasil ditambahkan!',
            data: {
                nik: nik.trim(),
                nama: nama.trim(),
            }
        });
    });
});

router.put('/:nik', (req, res) => {
    const { nik } = req.params;

    const { nama, tempat_lahir, tanggal_lahir, jns_kelamin, alamat, agama, status_kawin, pekerjaan, kewarganegaraan } = req.body;
    if (!nama || !tempat_lahir || !tanggal_lahir || !jns_kelamin || !alamat || !agama || !status_kawin || !kewarganegaraan) {
        return res.status(400).json({ error: 'Pastikan semua kolom wajib terisi.' });
    }

    const query = ` UPDATE ktp SET nama = ?, tempat_lahir = ?, tanggal_lahir = ?, jns_kelamin = ?, alamat = ?, agama = ?, 
            status_kawin = ?, pekerjaan = ?, kewarganegaraan = ? WHERE nik = ?`;
    const values = [nama.trim(), tempat_lahir.trim(), tanggal_lahir, jns_kelamin.trim(), alamat.trim(),
        agama.trim(), status_kawin.trim(), pekerjaan ? pekerjaan.trim() : null, kewarganegaraan.trim(), nik];

    db.query(query, values, (err, result) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).json({ error: 'Terjadi kesalahan pada server.' });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: `Data KTP dengan NIK ${nik} tidak ditemukan.` });
        }

        res.status(200).json({
            message: `Data KTP dengan NIK ${nik} berhasil diperbarui.`,
            updatedData: req.body
        });
    });
});

router.delete('/:nik', (req, res) => {
    db.query('DELETE FROM ktp WHERE nik = ?', [req.params.nik], (err, results) => {
        if (err) return res.status(500).send('Internal Server Error');
        if (results.affectedRows === 0) return res.status(404).send('Data tidak ditemukan');
        res.status(204).send();
    });
});

module.exports = router;