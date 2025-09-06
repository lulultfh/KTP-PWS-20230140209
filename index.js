const express = require("express");
const cors = require("cors");
const ktpRoutes = require("./routes/ktp-db.js");

const app = express();
const PORT = process.env.PORT || 3001;
// const PORT = 3000;

app.use(cors());
app.use(express.static('public'));
app.use(express.json());
app.use('/api/ktp', ktpRoutes);

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/index.html');
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});