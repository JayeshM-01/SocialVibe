const mongoose = require('mongoose');

const RequestSchema = new mongoose.Schema({
    from: {
        type: String, // Email of the sender (user sending the friend request)
        required: true
    },
    to: {
        type: String, // Email of the recipient (user receiving the friend request)
        required: true
    },
    status: {
        type: String,
        enum: ['pending', 'accepted', 'rejected'], // Status of the request
        default: 'pending'
    }
}, { timestamps: true });



const Request = mongoose.model('Request', RequestSchema);

module.exports = Request;
