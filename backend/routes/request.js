const express = require('express');
const router = express.Router();
const User = require('../Models/usermodel'); // Import User model
const Friends = require('../Models/Friends'); // Import Friends model
const Request = require('../Models/Request'); // Import Request model

// Fetch all users except the current user
router.get('/users', async (req, res) => {
    const useremail = req.query.email;

    try {
        const users = await User.find({ useremail: { $ne: useremail } }, 'username useremail userimage');
        res.status(200).json(users);
    } catch (err) {
        console.error('Error fetching users:', err);
        res.status(500).json({ message: 'Error fetching users', error: err });
    }
});

// Send a friend request
router.post('/', async (req, res) => {
    const { from, to } = req.body;
    
    
    if (!from || !to) {
        return res.status(400).json({ message: 'Both sender and recipient emails are required.' });
    }
    
    try {
        
        const existingRequest = await Request.findOne({ from, to });
        console.log(existingRequest);
        
        if (existingRequest) {
            return res.status(400).json({ message: 'Friend request already sent' });
        }
        
        const newRequest = new Request({ from, to });
        await newRequest.save();
        res.status(201).json({ message: 'Friend request sent successfully.' });
    } catch (err) {
        console.error('Error sending friend request:', err);
        res.status(500).json({ message: 'Error sending friend request', error: err });
    }
});

// Fetch all pending requests for the current user
router.get('/', async (req, res) => {
    const useremail = req.query.email;
    
    try {
        const requests = await Request.find({ to: useremail, status: 'pending' });
        res.status(200).json(requests);
    } catch (err) {
        console.error('Error fetching requests:', err);
        res.status(500).json({ message: 'Error fetching requests', error: err });
    }
});

// Accept or reject a friend request
router.post('/respond', async (req, res) => {
    const { requestId, action } = req.body;

    if (!requestId || !action || !['accept', 'reject'].includes(action)) {
        return res.status(400).json({ message: 'Invalid request or action.' });
    }
    
    try {
        const request = await Request.findById(requestId);
        
        if (!request) {
            return res.status(404).json({ message: 'Request not found.' });
        }
        
        if (action === 'accept') {
            // Check if the user is already in the Friends model
            let user = await Friends.findOne({ useremail: request.from });

            // If the user is not found, create a new entry for them
            if (!user) {
                user = new Friends({ useremail: request.to, friendsList: [] });
                await user.save();
            }

            // Add the friend to the friends list
            user.friendsList.push(request.to);
            await user.save();

            // Update request status to accepted
            request.status = 'accepted';
        } else {
            // Update request status to rejected
            request.status = 'rejected';
        }

        await request.save();
        res.status(200).json({ message: `Friend request ${action}ed successfully.` });
    } catch (err) {
        console.error('Error responding to request:', err);
        res.status(500).json({ message: 'Error responding to request', error: err });
    }
});

module.exports = router;
