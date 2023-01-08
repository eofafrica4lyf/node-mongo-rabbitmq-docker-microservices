//Init ENV variables
require('dotenv').config();

const express = require('express');
const channelRouter = require("./controllers");

const app = express();
const PORT = process.env.PORT;

app.use(express.json({
    limit: '5mb'
}));

app.get('/', (req, res) => res.send('Hello, world!'));
app.use('/channel', channelRouter)

app.listen(PORT, () => {
    console.log(`Channel app listening at http://localhost:${PORT}`)
})