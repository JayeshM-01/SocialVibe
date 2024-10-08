const express = require('express');
const router = express.Router();
const UserImage = require('../Models/File'); 

// GET route to fetch all messages for an image
router.get('/:imageId', async (req, res) => {
    const { imageId } = req.params;

    try {
        // Find the image post by its ID and return the messages
        const imagePost = await UserImage.findOne({ _id: imageId });
        
        if (!imagePost) {
            return res.status(404).json({ message: 'Image not found' });
        }

        res.status(200).json(imagePost.messages);
    } catch (error) {
        console.error('Error fetching messages:', error);
        res.status(500).json({ message: 'Error fetching messages', error });
    }
});

module.exports = router;
