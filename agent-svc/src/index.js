//Init ENV variables
require('dotenv').config();

const express = require('express');

const app = express();
const PORT = process.env.PORT;

app.get('/', (req, res) => res.send('Hello, world!'));

app.listen(PORT, () => {
    console.log(`Agent app listening at http://localhost:${PORT}`)
})