const mongoose = require('mongoose');

module.exports = async function () {
    try {
        const databaseConnection = await mongoose.connect(process.env.DATABASE_CONNECTION_URL, {
            useUnifiedTopology: true,
            useNewUrlParser: true,
            useCreateIndex: true
        });
        console.log('Connected to Database : ' + databaseConnection.connection.host);
    } catch (error) {
        console.log(error);
        process.exit(1);
    }
}