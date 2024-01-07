const express = require("express");
const app = express();
const User = require("./models/user");
const passport = require("passport");
const mongoose = require("mongoose");
const LocalStrategy = require("passport-local");
const session = require("express-session");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const destinationRouter = require('./routes/destination')
const reivewsRouter = require('./routes/review')

app.use(cors());
require("dotenv").config();

const PORT = process.env.PORT || 3000;

const dbUrl = process.env.DB_URL || "mongodb://localhost:27017/wanderHub";

mongoose.connect(dbUrl);

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
  console.log("Database connected");
});

app.use(
  session({
    secret: "secret-key",
    resave: false,
  })
);

app.use(express.json()); // Added JSON parsing middleware
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.post("/register", async (req, res) => {
  try {
    const { email, username, password } = req.body;
    const user = new User({ email, username });
    const newUser = await User.register(user, password);
    res.status(200).json(newUser)
    // Redirect after successful registration
  } catch (e) {
    // Handle registration error
    res.status(400).json({ error: 'Registration failed', details: e.message });
  }
});

app.post('/login', function(req, res, next) {
  passport.authenticate('local', function(err, user) {
    if (err) {
      // Handle unexpected errors (e.g., database error)
      return res.status(500).json({ error: 'Internal Server Error' });
    }

    if (!user) {
      // Authentication failed: user credentials are incorrect
      return res.status(401).json({ error: 'Authentication failed. Invalid username or password.' });
    }

    // Authentication successful
    req.logIn(user, function(err) {
      if (err) {
        // Handle login error
        return res.status(500).json({ error: 'Internal Server Error' });
      }

      // Generate a JWT
      const token = jwt.sign({ userId: user.id }, 'secret-key', { expiresIn: '24h' });

      // Send the JWT in the response
      res.status(200).json({ token: token, userId: user.id });
    });
  })(req, res, next);
});

app.use("/destinations", destinationRouter);
app.use('/destinations/reviews', reivewsRouter)


app.listen(PORT, () => {
  console.log(`running at http://localhost:${PORT}`);
});
