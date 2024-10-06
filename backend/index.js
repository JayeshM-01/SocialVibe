if(process.env.NODE_ENV !== 'production'){
    require('dotenv').config({ path: '../.env' });
}

const express = require('express');
const cors = require('cors');
const app = express();
const mongoose = require('mongoose');
const User = require('./Models/usermodel'); // Import the User model
const uploadRoutes = require('./routes/upload'); // Import the upload routes
const multer = require('multer');

const mongo_uri = process.env.MONGO_URI;

// Middleware
app.use(cors()); // Enable CORS for cross-origin requests
app.use(express.json()); // Parse incoming JSON requests
app.use('/api', uploadRoutes); // Use upload routes under /api
console.log(mongo_uri);


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

// User creation route
app.post('/user', async (req, res) => {
    const { username, useremail } = req.body;

    if (!username || !useremail) {
        return res.status(400).json({ message: 'Username and email are required.' });
    }

    try {
        const newUser = new User({ username, useremail });
        
        const result = await newUser.save();
        console.log('User created:', newUser);
        
        res.status(201).json({ message: 'User added successfully', user: result });
    } catch (err) {
        // console.error('Error details:', err);

        if (err.code === 11000) {
            return res.status(400).json({ message: 'Username or email already exists' });
        }
        res.status(500).json({ message: 'Error adding user to MongoDB', error: err });
    }
});

module.exports = app; // Export the app for testing
