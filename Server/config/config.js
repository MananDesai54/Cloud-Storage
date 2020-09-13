const mongoose = require('mongoose');

module.exports = function() {
    mongoose.connect(process.env.DATABASE_CONNECTION_URL,{
        useUnifiedTopology : true,
        useNewUrlParser : true
    },()=>{
        console.log('Connected to Database');
    });
}