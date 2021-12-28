const express = require('express');
const path = require('path');
const methodOverride = require('method-override');
require('dotenv').config();
const PORT = process.env.PORT;

const db = require('./initDB')(); //Initialize DB
const app = express();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));


app.listen(PORT, () => {
    console.log('Serving on port', PORT);
})