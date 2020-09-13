require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const connectToDatabase = require('./config/config');

const app = express();
const PORT = process.env.PORT || 5000;

app.get('/',(req,res)=>{
    res.send('SEE YOU SOON');
})

connectToDatabase();

app.listen(PORT,()=>console.log(`Server is running at 127.0.0.1:${PORT}/`));