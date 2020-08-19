const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 5000;

app.get('/',(req,res)=>{
    res.send('SEE YOU SOON');
})

app.listen(PORT,()=>console.log(`Server is running at 127.0.0.1:${PORT}/`));