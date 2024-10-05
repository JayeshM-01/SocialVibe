const express = require('express');
const mongo = require('mongodb');
const cors = require('cors');
const app = express();
require('dotenv').config({ path: '../.env' });  
const mongoose = require('mongoose');
const User = require('./Models/usermodel'); // Import the User model


const mongo_uri = process.env.MONGO_URI;

// Middleware
app.use(cors()); // Enable CORS for cross-origin requests
app.use(express.json()); // Parse incoming JSON requests

// Initialize MongoDB Client
const MongoClient = mongo.MongoClient;
const url = mongo_uri; // Your MongoDB connection string
const dbName = 'SocialVibe'; // Database name

let db; // This will hold the reference to your database

// Connect to MongoDB
// Connect to MongoDB using Mongoose
mongoose.connect(mongo_uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log('Connected to MongoDB with Mongoose');
    app.listen(3001, () => {
      console.log('Server is running on port 3001');
    });
}).catch(err => {
    console.error('MongoDB connection error:', err);
});

// Example route
app.get('/', (req, res) => {
    res.send('Welcome to the Express server');
});

app.post('/user', async (req, res) => {
    const { username, useremail } = req.body;

    if (!username || !useremail) {
        return res.status(400).json({ message: 'Username and email are required.' });
    }

    try {
        const newUser = new User({ username, useremail });
        
        // console.log("Trying to save user: ", newUser); // Debugging line
        
        const result = await newUser.save();
        console.log(newUser);
        

        res.status(201).json({ message: 'User added successfully', user: result });
    } catch (err) {
        console.error('Error details:', err); // Add this to capture the full error details

        if (err.code === 11000) {
            return res.status(400).json({ message: 'Username or email already exists' });
        }
        res.status(500).json({ message: 'Error adding user to MongoDB', error: err });
    }
});
