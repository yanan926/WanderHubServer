const express = require("express")
const app = express()
const userRoutes = require('./routes/users');
const flash = require('connect-flash');
const User = require('./models/user');
const passport = require('passport');
const mongoose = require('mongoose');
const LocalStrategy = require('passport-local');
const session = require('express-session');


require("dotenv").config();
app.use(flash());

const PORT = process.env.PORT || 3000;


const dbUrl = process.env.DB_URL || 'mongodb://localhost:27017/wanderHub';


mongoose.connect(dbUrl);

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});

app.use(
  session({
    secret: 'your-secret-key', // Replace with your own secret key
    resave: false,
    saveUninitialized: false,
  })
)

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
    res.locals.currentUser = req.user;
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
})
 app.get('/fakeUser', async(req, res)=>{
  const user = new User({email:'123@gmail.com', username: 'abc'})
  const newUser = await User.register(user, 'chicken')
  res.send(newUser)
 })

app.use('/', userRoutes);

app.listen(PORT, () => {
  console.log(`running at http://localhost:${PORT}`);
});