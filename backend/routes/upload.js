const express = require('express');
const router = express.Router();
const multer = require('multer');
const { storage } = require('../cloudinary'); // Import cloudinary storage configuration
const upload = multer({ storage }); // Use multer to upload files to Cloudinary
const mongoose = require('mongoose');

// Import your MongoDB User model (adjust according to your schema)
const UserImage = require('../Models/File');

// Route to handle image upload
router.post('/upload', upload.single('file'), async (req, res) => {
  try {
    console.log('Uploaded File:', req.file); // Log the entire file object
    console.log('Request Body:', req.body); // Log the body to see the email

    const { email } = req.body; // Get the user's email from the form data
    const imageUrl = req.file ? req.file.path : undefined; // Cloudinary image URL
    console.log('Image URL:', imageUrl); // Log the Cloudinary image URL

    if (!email || !imageUrl) {
      return res.status(400).json({ message: 'Email and image are required.' });
    }

    // Create a new document to store the email and image URL in MongoDB
    const newUserImage = new UserImage({
      email: email,
      imageUrl: imageUrl,
    });

    // Save the document to MongoDB
    await newUserImage.save();

    // Respond with success message and the saved data
    res.status(200).json({ message: 'File uploaded and saved successfully.', newUserImage });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'An error occurred while uploading the file.' });
  }
});

router.get('/images/:email', async (req, res) => {
  try {
    const { email } = req.params; // Get the email from the URL parameters
    const images = await UserImage.find({ email: email }); // Fetch images for that email

    if (!images || images.length === 0) {
      return res.status(404).json({ message: 'No images found for this email.' });
    }

    // Respond with the images
    res.status(200).json(images);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'An error occurred while fetching images.' });
  }
});


module.exports = router;
