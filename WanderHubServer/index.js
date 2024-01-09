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
require("dotenv").config();

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUDIDARY_API_KEY,
  api_secret: process.env.CLOUDIDARY_API_SECRET,
});

// Configure multer to use Cloudinary as storage
const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'uploads', 
    public_id: (req, file) => 'computed-filename-using-request',
  },
});
const upload = multer({ storage: storage, limits: {
  fieldSize: 10 * 1024 * 1024, // Adjust as needed
}, });

app.use(cors());

const PORT = process.env.PORT || 8080;

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


//user register
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

//user login
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

//user upload their own images
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
