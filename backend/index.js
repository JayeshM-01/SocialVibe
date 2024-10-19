if(process.env.NODE_ENV !== 'production'){
    require('dotenv').config({ path: '../.env' });
}

const express = require('express');
const cors = require('cors');
const app = express();
const http = require('http');
const mongoose = require('mongoose');
const User = require('./Models/usermodel'); // Import the User model
const Friends = require('./Models/Friends'); 
const UserImage = require('./Models/File'); 
const friendsRoutes = require('./routes/friend'); // Import the friends routes
const requestRoutes = require('./routes/request'); // Import the friends routes
const messageRoutes = require('./routes/message'); // Import message routes
const uploadRouter = require('./routes/uploadfile'); // Import message routes
const multer = require('multer');
const { Server } = require('socket.io');

const mongo_uri = process.env.MONGO_URI;

const server = http.createServer(app); // Create an HTTP server
const io = new Server(server, {
    cors: {
      origin: 'http://localhost:3000', // Client origin, replace with your actual client URL
      methods: ['GET', 'POST']
    }
  });
  
// Middleware
app.use(cors()); // Enable CORS for cross-origin requests
app.use(express.json()); // Parse incoming JSON requests

app.use('/friends', friendsRoutes); // Use friends routes under /friend
app.use('/request', requestRoutes); // Use friends routes under /friend
app.use('/messages', messageRoutes); // Add the message route
app.use('/api', uploadRouter);


// Connect to MongoDB using Mongoose
mongoose.connect(mongo_uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log('Connected to MongoDB with Mongoose');
    server.listen(3001, () => {
        console.log('Server is running on port 3001');
    });    
}).catch(err => {
    console.error('MongoDB connection error:', err);
});

io.on("connection", (socket) => {
  console.log(`User Connected: ${socket.id}`);

  socket.on("join_room", (data) => {
    socket.join(data);
    
    console.log(`User with ID: ${socket.id} joined room: ${data}`);
  });

  socket.on("send_message", async(data) => {
    socket.to(data.room).emit("receive_message", data);
    const { room, author, email, message, time, date } = data;
  
        // Find the image post by ID and update with new message
        let post = await UserImage.findOne({ _id: room });
  
        if (!post) {
          return socket.emit('error', 'Post not found');
        }
        
        // Add the new message to the messages array
        post.messages.push({
          username: author,
          useremail: email,
          message,
          date,
          time,
        });
  
        await post.save(); // Save the updated document
  });

  socket.on("disconnect", () => {
    console.log("User Disconnected", socket.id);
  });
});




// io.on('connection', (socket) => {
//     console.log('A user connected');
    
//     // Handle new message event
//     socket.on('newMessage', async (data) => {
//         try {
//         //   console.log("hi");
//         const { senderName, senderEmail, imageUrl, imageId, ownerName, message } = data;
  
//         // Find the image post by ID and update with new message
//         let post = await UserImage.findOne({ _id: imageId });
  
//         if (!post) {
//           return socket.emit('error', 'Post not found');
//         }
        
//         // Add the new message to the messages array
//         post.messages.push({
//           username: senderName,
//           useremail: senderEmail,
//           message,
//         });
  
//         await post.save(); // Save the updated document
  
//         // Emit back to all clients the updated messages
//         io.emit('messageSaved', post.messages);
//       } catch (err) {
//         console.error('Error saving message:', err);
//         socket.emit('error', 'Error saving message');
//       }
//     });
  
//     socket.on('disconnect', () => {
//       console.log('A user disconnected');
//     });
//   });
  


// User creation route
app.post('/user', async (req, res) => {
    const { username, useremail,userimage } = req.body;

    if (!username || !useremail) {
        return res.status(400).json({ message: 'Username and email are required.' });
    }

    try {
        // Check if a user with the same email or username already exists
        const existingUser = await User.findOne({ useremail });
        console.log(existingUser);
        

        if (existingUser) {
            return res.status(400).json({ message: 'Username or email already exists' });
        }

        const newUser = new User({ username, useremail,userimage });
        const newfriend = new Friends({ useremail });
        console.log(newUser);
        
        const result = await newUser.save();
        const result1 = await newfriend.save();
        
        console.log('User created:', newUser);
        
        res.status(201).json({ message: 'User added successfully', users: result });
    } catch (err) {
        console.error('Error details:', err);
        
        res.status(500).json({ message: 'Error adding user to MongoDB', error: err });
    }
});

module.exports = app; // Export the app for testing
