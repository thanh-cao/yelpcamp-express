const { connect, connection } = require('mongoose');
const { config } = require('dotenv');

module.exports = () => {
    config(); //invoking the dotenv config here
    const uri = process.env.MONGO_URI;

    connect(uri, {
        dbName: process.env.MONGO_DBNAME,
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
        .then(() => {
            console.log('Connection estabislished with MongoDB');
        })
        .catch(error => console.error(error.message));

    connection.on('connected', () => {
        console.log('Mongoose connected to DB Cluster');
    })

    connection.on('error', (error) => {
        console.error(error.message);
    })

    connection.on('disconnected', () => {
        console.log('Mongoose Disconnected');
    })
}

