const express = require('express');
const fetch = require('node-fetch'); // Asegúrate de usar 'node-fetch' versión 2
const app = express();

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    next();
});

app.get('/leidsa', async (req, res) => {
    try {
        const response = await fetch('https://www.miresultadoloteria.com/leidsaloto/');
        const body = await response.text();
        res.send(body);
    } catch (error) {
        res.status(500).send(error.toString());
    }
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Proxy server running on http://localhost:${PORT}`);
});
