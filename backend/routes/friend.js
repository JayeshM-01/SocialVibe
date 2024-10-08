const express = require('express');
const router = express.Router();
const Friends = require('../Models/Friends'); // Import the Friends model
const mongoose = require('mongoose');

// Route to get all usernames (emails) from the Friends model
router.get('/', async (req, res) => {
    const email  = req.query.email; // Extract email from query parameters

    if (!email) {
        return res.status(400).json({ message: 'User email is required' });
    }

    try {
        // Fetch the friend's list for the provided email
        const friendRecord = await Friends.findOne({ useremail: email });

        if (!friendRecord) {
            return res.status(404).json({ message: 'No friends found for this user' });
        }

        // Respond with the friend's list
        res.status(200).json({ friendsList: friendRecord.friendsList });
    } catch (err) {
        console.error('Error fetching friends:', err);
        res.status(500).json({ message: 'Error fetching friends', error: err });
    }
});

// Route to add a friend's email to the user's friends list
router.post('/add', async (req, res) => {
    const { useremail, friendEmail } = req.body;

    if (!useremail || !friendEmail) {
        return res.status(400).json({ message: 'Both useremail and friendEmail are required.' });
    }

    try {
        // Find the user by their email
        const user = await Friends.findOne({ useremail });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Check if the friendEmail is already in the user's friendsList
        if (user.friendsList.includes(friendEmail)) {
            return res.status(400).json({ message: 'Friend is already in the list' });
        }

        // Add friend's email to the user's friendsList
        user.friendsList.push(friendEmail);

        // Save the updated user document
        await user.save();

        res.status(200).json({ message: 'Friend added successfully', user });
    } catch (err) {
        console.error('Error adding friend:', err);
        res.status(500).json({ message: 'Error adding friend to list', error: err });
    }
});

module.exports = router;
