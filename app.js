require('dotenv').config();
require("./models/db")
const express = require('express');
const cors = require('cors');
const authRouter = require('./routes/router')

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(cors());

app.use(authRouter);

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
}); 

app.get("/", (req, res)  => {
    res.send("Server is up and running..")
})