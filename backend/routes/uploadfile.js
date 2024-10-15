const express = require('express');
const fileUpload = require('express-fileupload');
const cloudinary = require('cloudinary').v2;
const fs = require('fs');
const router = express.Router();

router.use(fileUpload());
const UserImage = require('../Models/File');
const Friends = require('../Models/Friends');

// Cloudinary config
cloudinary.config({
  cloud_name: 'daex3gj8h',
  api_key: '958145775471671',
  api_secret: 'xDAo03nnULj6YHAjSEx9aO2HjFw',
});

// Upload to Cloudinary
async function uploadToCloudinary(fileBuffer, resourceType) {
  return new Promise((resolve, reject) => {
    cloudinary.uploader.upload_stream(
      { resource_type: resourceType },
      (error, result) => {
        if (error) {
          reject(error);
        }
        resolve(result);
      }
    ).end(fileBuffer);  // Send file buffer directly
  });
}

// Endpoint for file uploads
router.post('/', async (req, res) => {
  if (!req.files || Object.keys(req.files).length === 0) {
    return res.status(400).send('No file uploaded.');
  }

  const uploadedFile = req.files.file;
  const { username, email } = req.headers;

  
  // Determine if it's an image or video
  let resourceType = 'image';
  if (uploadedFile.mimetype.startsWith('video/')) {
    resourceType = 'video';
  }

  try {
    // Pass file data (buffer) directly to Cloudinary
    const result = await uploadToCloudinary(uploadedFile.data, resourceType);

 
      const newUserImage = new UserImage({
        email: email,
        name: username,
        imageUrl: result.secure_url,
      });
  
      // Save the document to MongoDB
      await newUserImage.save();

    res.json({
      success: true,
      url: result.secure_url,
      type: resourceType,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.get('/media/:email', async (req, res) => {
    try {
      const { email } = req.params; // Get the email from the URL parameters
  
      // Step 1: Fetch the user's friends list from the Friends model
      const userFriends = await Friends.findOne({ useremail: email });
  
      if (!userFriends) {
        return res.status(404).json({ message: 'User or friends not found.' });
      }
  
      // Step 2: Get the user's email and their friends' emails
      const emailsToFetch = [email, ...userFriends.friendsList]; // Combine user's email and their friends' emails
  
      // Step 3: Fetch images for the user and their friends
      const images = await UserImage.find({ email: { $in: emailsToFetch } });
  
      if (!images || images.length === 0) {
        return res.status(404).json({ message: 'No images found for this user or their friends.' });
      }
  
      // Step 4: Respond with the images
      res.status(200).json(images);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'An error occurred while fetching images.' });
    }
  });

router.get('/media1/:email', async (req, res) => {
    try {
      const { email } = req.params; // Get the email from the URL parameters
  
      // Step 1: Fetch the user's friends list from the Friends model
      const userFriends = await Friends.findOne({ useremail: email });
  
      if (!userFriends) {
        return res.status(404).json({ message: 'User or friends not found.' });
      }
  
      // Step 2: Get the user's email and their friends' emails
      const emailsToFetch = [email]; // Combine user's email and their friends' emails
  
      // Step 3: Fetch images for the user and their friends
      const images = await UserImage.find({ email: { $in: emailsToFetch } });
  
      if (!images || images.length === 0) {
        return res.status(404).json({ message: 'No images found for this user or their friends.' });
      }
  
      // Step 4: Respond with the images
      res.status(200).json(images);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'An error occurred while fetching images.' });
    }
  });

router.get('/media', async (req, res) => {
  try {
    // Step 1: Fetch all images from the UserImage model
    const images = await UserImage.find({}); // Fetch all images without any filter

    // Step 2: Check if any images were found
    if (!images || images.length === 0) {
      return res.status(404).json({ message: 'No images found.' });
    }

    // Step 3: Respond with the images
    res.status(200).json(images);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'An error occurred while fetching images.' });
  }
});
  

module.exports = router;
