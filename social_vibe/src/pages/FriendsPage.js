import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth0 } from "@auth0/auth0-react";
import { useNavigate } from 'react-router-dom';

const FriendsPage = () => {
    const [users, setUsers] = useState([]);
    const [requests, setRequests] = useState([]);
    const [friends, setFriends] = useState([]);
    const { user , isAuthenticated , isLoading } = useAuth0();
    
    const navigate = useNavigate();

    // Fetch all users except the current user
    useEffect(() => {
        const fetchUsers = async () => {
            try {
                // Fetch all users
                const response = await axios.get(`http://localhost:3001/request/users?email=${user.email}`);
                const allUsers = response.data; // Array of objects with email attribute
        
                // Fetch friends list
                const friendsResponse = await axios.get(`http://localhost:3001/friends?email=${user.email}`);
                const friendsList = friendsResponse.data.friendsList;  // Array of strings (emails)
        
                // Filter the users array to exclude emails in the friendsList
                const filteredUsers = allUsers.filter(user2 => !friendsList.includes(user2.useremail));
        
                // console.log(allUsers); // This will give you the filtered array of users
                // console.log(friendsList); // This will give you the filtered array of users
                // console.log(filteredUsers); // This will give you the filtered array of users

                setUsers(filteredUsers)
                setFriends(friendsList)

                // console.log(friends);
                
        
            } catch (error) {
                console.error('Error fetching users:', error);
            }
        };
        
        const fetchRequests = async () => {
            try {
                const response = await axios.get(`http://localhost:3001/request?email=${user.email}`);
                setRequests(response.data);
            } catch (error) {
                console.error('Error fetching requests:', error);
            }
        };

        fetchUsers();
        fetchRequests();
    }, [user?.email]);

    // Send a friend request
    const sendFriendRequest = async (toEmail) => {
        try {
            
            console.log("HI");
            await axios.post('http://localhost:3001/request', { from: user.email, to: toEmail });
            alert('Friend request sent!');
        } catch (error) {
            console.error('Error sending friend request:', error);
        }
    };

    // Respond to a friend request
    const respondToRequest = async (requestId, action) => {
        try {
            await axios.post('http://localhost:3001/request/respond', { requestId, action });
            alert(`Friend request ${action}ed!`);
            // Update the requests list after accepting/rejecting
            setRequests(requests.filter(req => req._id !== requestId));
            navigate('/friends');
        } catch (error) {
            console.error(`Error ${action}ing friend request:`, error);
        }
    };

    return (
        <div className="friends-page p-4" style={{ textAlign: 'center', paddingTop: '5rem' }}>
            <h2 className="text-2xl font-bold mb-4">Friends Page</h2>

            <div className="friends-list mb-6">
                <h3 className="text-xl font-semibold">Your Friends</h3>
                <ul className="list-disc list-inside">
                    {Array.isArray(friends) && friends.length === 0 ? (
                        <li>No friends added yet.</li>
                    ) : (
                        friends.map(friend => (
                            <li key={friend} className="flex justify-center items-center py-2">
                                {friend}
                            </li>
                        ))
                    )}
                </ul>
            </div>

            <div className="users-list mb-6">
                <h3 className="text-xl font-semibold">All Users</h3>
                <ul className="list-disc list-inside">
                    {users.map(user => (
                        <li key={user.useremail} className="flex justify-center items-center py-2">
                            {user.username} ({user.useremail})
                            <button
                                onClick={() => sendFriendRequest(user.useremail)}
                                className="bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600 ml-10"
                            >
                                Add Friend
                            </button>
                        </li>
                    ))}
                </ul>
            </div>

            <div className="requests-list">
                <h3 className="text-xl font-semibold">Friend Requests</h3>
                <ul className="list-disc list-inside">
                    {requests.map(request => (
                        <li key={request._id} className="flex justify-center items-center py-2">
                            {request.from} wants to be your friend.
                            <div>
                                <button
                                    onClick={() => respondToRequest(request._id, 'accept')}
                                    className="bg-green-500 text-white px-2 py-1 rounded hover:bg-green-600 mr-2"
                                >
                                    Accept
                                </button>
                                <button
                                    onClick={() => respondToRequest(request._id, 'reject')}
                                    className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
                                >
                                    Reject
                                </button>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default FriendsPage;
