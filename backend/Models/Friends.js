const mongoose = require('mongoose');

const FriendsSchema = new mongoose.Schema({
    useremail: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        match: [/.+\@.+\..+/, 'Please enter a valid email address']
    },
    friendsList: {
        type: [String], // Array of strings
        default: [] // Default value is an empty array
    }
}, {
    timestamps: true
});

const Friends = mongoose.models.Friends || mongoose.model('Friends', FriendsSchema);

module.exports = Friends;
