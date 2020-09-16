require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const connectToDatabase = require('./config/config');
const morgan = require('morgan');

const app = express();
const PORT = process.env.PORT || 5000;
connectToDatabase();

if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}

app.use(express.json({
    extended: false
}));
// app.use(bodyParser.urlencoded({
//     extended: false
// }))

app.get('/',(req,res)=>{
    res.send('API running.');
});

//router
app.use('/api/auth',require('./routes/authRoutes'));
app.use('/api/users',require('./routes/userRoutes'));
app.use('/api/profile',require('./routes/profileRoutes'));
app.use('/api/cloud',require('./routes/cloudRoutes'));

app.listen(PORT,()=>console.log(`Server is running at 127.0.0.1:${PORT}/`));