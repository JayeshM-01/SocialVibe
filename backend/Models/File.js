const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define a schema to store the email and image URL
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
}, { timestamps: true });

// Create the model based on the schema
const UserImage = mongoose.model('UserImage', UserImageSchema);

module.exports = UserImage;



