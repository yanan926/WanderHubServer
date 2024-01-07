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
// Import the Cloudinary package
const cloudinary = require('cloudinary').v2;
const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');

// Configure Cloudinary with your cloud name, API key, and API secret
cloudinary.config({
  cloud_name: "dhwbxnjb8",
  api_key: "538548839227719",
  api_secret: "8Dlr2_GzoolTKB_nk0vSm2SGdVE",
});

// Configure multer to use Cloudinary as storage
const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'uploads', // specify the folder in Cloudinary where you want to store the images
    format: async (req, file) => 'png', // supports promises as well
    public_id: (req, file) => 'computed-filename-using-request',
  },
});
const upload = multer({ storage: storage });

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
  } catch (e) {
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

app.post('/upload', upload.single('file'), (req, res) => {
  try {
    // Access the Cloudinary URL from the req.file object
    const imageUrl = req.file.path;
    res.json({ imageUrl });
  } catch (error) {
    console.error('Error uploading file:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.use("/destinations", destinationRouter);
app.use('/destinations/reviews', reivewsRouter)
app.listen(PORT, () => {
  console.log(`running at http://localhost:${PORT}`);
});
