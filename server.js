const express = require('express');
const app = express();

app.use(express.static('public'));
app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');

const fs = require('fs');
const path = require('path');

app.get('/', (req, res) => {
    res.send("Ili obican tekst ako nema HTML datoteke.");
});
app.get('/slike', (req, res) => {
    const dataPath = path.join(__dirname, 'images.json');
    const images = JSON.parse(fs.readFileSync(dataPath));
    res.render('slike', { images });
});
app.listen(3000, () => {
    console.log("Server pokrenut na http://localhost:3000");
});