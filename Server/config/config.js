const mongoose = require('mongoose');

module.exports = async function() {
    try {
        await mongoose.connect(process.env.DATABASE_CONNECTION_URL,{
            useUnifiedTopology : true,
            useNewUrlParser : true,
            useCreateIndex: true
        },()=>{
            console.log('Connected to Database');
        });   
    } catch (error) {
        console.log(error);
    }
}