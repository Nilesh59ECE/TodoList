const express = require('express');
const mongoose = require('mongoose');
const authRoutes = require('./routes/auth');
const dotenv = require('dotenv');
const cors = require('cors');
const bodyParser = require('body-parser');
const session = require('express-session');
const passport = require('passport');

dotenv.config(); // Load environment variables

// Check for required Google OAuth environment variables
if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET || !process.env.GOOGLE_CALLBACK_URL) {
    throw new Error('Google OAuth environment variables are not defined');
}

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(bodyParser.json());
app.use(cors());

app.use(session({
    secret: process.env.SESSION_SECRET || 'default_secret', // Use environment variable for secret
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false } // Change to true if using HTTPS in production
}));

app.use(passport.initialize());
app.use(passport.session());

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.error('Failed to connect to MongoDB:', err));

// Handle API routes
app.use('/api', authRoutes);

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
