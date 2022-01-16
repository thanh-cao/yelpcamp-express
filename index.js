// import PACKAGES
const express = require('express');
const ejsMate = require('ejs-mate');
const path = require('path');
const methodOverride = require('method-override');
const session = require('express-session');
const flash = require('connect-flash');
const passport = require('passport');
const LocalStrategy = require('passport-local');

const User = require('./models/user');
const ExpressError = require('./utils/ExpressError')

require('dotenv').config();
const PORT = process.env.PORT;

// import ROUTES
const campgroundRouters = require('./routes/campground');
const reviewRouters = require('./routes/review');
const userRouters = require('./routes/users');

// initialize express app and database
const app = express();
require('./initDB')(); //Initialize DB

// set up view engine
app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')));

const sessionConfig = {
    secret: process.env.SECRET_KEY,
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7, // expires in 7 days
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
};

app.use(session(sessionConfig));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
// LocalStrategy is a built-in passport-local strategy
// User.authenticate(), User.serializeUser() and User.deserializerUer() are methods from the User model from passport-local-mongoose
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
    res.locals.currentUser = req.user; // allow access to currentUser in all views
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
});

// use ROUTES
app.use('/', userRouters);
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