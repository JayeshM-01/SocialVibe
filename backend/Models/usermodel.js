const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [true, 'Username is required']
    },
    useremail: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        match: [/.+\@.+\..+/, 'Please enter a valid email address']
    },
    userimage: {
        type: String,
        required: [true, 'Email is required']
    }
}, {
    timestamps: true
});

const User = mongoose.models.User || mongoose.model('User', UserSchema);

module.exports = User;
