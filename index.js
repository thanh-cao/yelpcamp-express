const express = require('express');
const ejsMate = require('ejs-mate');
const path = require('path');
const methodOverride = require('method-override');

const ExpressError = require('./utils/ExpressError')

require('dotenv').config();
const PORT = process.env.PORT;

const campgroundRouters = require('./routes/campground');
const reviewRouters = require('./routes/review');

const app = express();
require('./initDB')(); //Initialize DB

app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));


app.use('/campgrounds', campgroundRouters);
app.use('/campgrounds/:id/reviews', reviewRouters);

app.get('/', (req, res) => {
    res.render('home');
});

app.all('*', (req, res, next) => {
    next(new ExpressError('Page Not Found', 404))
});

app.use((err, req, res, next) => {
    const { statusCode = 500 } = err;
    if (!err.message) err.message = 'Oh No, Something Went Wrong!';
    res.status(statusCode).render('error', { err });
});

app.listen(PORT, () => {
    console.log('Serving on port', PORT);
});