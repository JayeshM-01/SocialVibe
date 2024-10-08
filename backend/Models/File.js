const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define a schema to store the email, image URL, and an array of messages
const UserImageSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  imageUrl: {
    type: String,
    required: true,
  },
  messages: [{
    username: {
      type: String,
      required: true
    },
    useremail: {
      type: String,
      required: true
    },
    message: {
      type: String,
      required: true
    },
    date: {
      type: Date,
      default: Date.now
    },
    time: {
      type: String, // Optional: You could store time separately, or handle it in the frontend based on date
    }
  }]
}, { timestamps: true });

// Create the model based on the schema
const UserImage = mongoose.model('UserImage', UserImageSchema);

module.exports = UserImage;
