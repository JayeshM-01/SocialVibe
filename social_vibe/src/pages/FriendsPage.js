import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth0 } from "@auth0/auth0-react";
import { useNavigate } from 'react-router-dom';

const FriendsPage = () => {
    const [users, setUsers] = useState([]);
    const [requests, setRequests] = useState([]);
    const [friends, setFriends] = useState([]);
    const [list1, setList1] = useState(true);
    const [list2, setList2] = useState(false);
    const [list3, setList3] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [searchTermUsers, setSearchTermUsers] = useState("");
    const [searchTermRequests, setSearchTermRequests] = useState("");

    const { user , isAuthenticated , isLoading } = useAuth0();
    const PORT = "http://localhost:3001"
    const navigate = useNavigate();

    // Fetch all users except the current user
    useEffect(() => {
        const fetchUsers = async () => {
            try {
                // Fetch all users
                const response = await axios.get(`${PORT}/request/users?email=${user.email}`);
                const allUsers = response.data; // Array of objects with email attribute
        
                // Fetch friends list
                const friendsResponse = await axios.get(`${PORT}/friends?email=${user.email}`);
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
                const response = await axios.get(`${PORT}/request?email=${user.email}`);
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
            await axios.post(`${PORT}/request`, { from: user.email, to: toEmail });
            alert('Friend request sent!');
        } catch (error) {
            console.error('Error sending friend request:', error);
        }
    };

    // Respond to a friend request
    const respondToRequest = async (requestId, action) => {
        try {
            await axios.post(`${PORT}/request/respond`, { requestId, action });
            alert(`Friend request ${action}ed!`);
            // Update the requests list after accepting/rejecting
            setRequests(requests.filter(req => req._id !== requestId));
            navigate('/friends');
        } catch (error) {
            console.error(`Error ${action}ing friend request:`, error);
        }
    };

    console.log(users);


    return (
        <div className="friends-page p-4" style={{ textAlign: 'center', paddingTop: '5rem' }}>

            

            <ul className="flex items-center justify-around md:justify-center space-x-12 uppercase tracking-widest font-semibold text-xs text-gray-600 border-t">
                <li className="md:border-t md:border-gray-700 md:-mt-px md:text-gray-700">
                  <a className="inline-block p-3" href="#">
                    <i className="fas fa-th-large text-xl md:text-xs"></i>
                    <span 
                    className={`hidden text-xl md:inline ${list1 ? "font-bold" : ""}`} 
                    onClick={()=>{setList1(true);setList2(false);setList3(false)}}>
                        Your Friends
                    </span>
                  </a>
                  <a className="inline-block p-3" href="#">
                    <i className="fas fa-th-large text-xl md:text-xs"></i>
                    <span 
                    className={`hidden text-xl md:inline ${list2 ? "font-bold" : ""}`}  
                    onClick={()=>{setList1(false);setList2(true);setList3(false)}}>
                        All Users
                    </span>
                  </a>
                  <a className="inline-block p-3" href="#">
                    <i className="fas fa-th-large text-xl md:text-xs"></i>
                    <span 
                    className={`hidden text-xl md:inline ${list3 ? "font-bold" : ""}`} 
                    onClick={() => {setList1(false); setList2(false); setList3(true)}}
                    >
                    Friend Requests
                    </span>
                  </a>
                </li>
              </ul>

              {/* Scrollable posts section in vertical direction */}
              {list1 && (
                <div className="overflow-y-auto hide-scrollbar h-[34rem] px-3 md:px-0">
                    <div className="friends-list mb-6">
                    <h3 className="text-xl font-semibold">Your Friends</h3>
                    
                    {/* Search Bar */}
                    <input
                        type="text"
                        placeholder="Search friends"
                        className="border rounded-md px-2 py-1 my-4 w-[20rem]"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />

                    <ul className="list-disc list-inside">
                        {Array.isArray(friends) && friends.length === 0 ? (
                        <li>No friends added yet.</li>
                        ) : (
                        // Filter friends based on search term
                        friends
                            .filter(friend => friend.toLowerCase().includes(searchTerm.toLowerCase()))
                            .map(friend => (
                            <li key={friend} className="flex justify-center items-center py-2">
                                {friend}
                            </li>
                            ))
                        )}
                    </ul>
                    </div>
                </div>
                )}

                {list2 && (
                <div className="overflow-y-auto hide-scrollbar h-[34rem] px-3 md:px-0">
                    <div className="users-list mb-6">
                    <h3 className="text-xl font-semibold">All Users</h3>
                    
                    {/* Search Bar for Users */}
                    <input
                        type="text"
                        placeholder="Search users"
                        className="border rounded-md px-2 py-1 my-4 w-[20rem]"
                        value={searchTermUsers}
                        onChange={(e) => setSearchTermUsers(e.target.value)}
                    />

<ul className="list-disc list-inside">
  {users
    .filter(user => user.username.toLowerCase().includes(searchTermUsers.toLowerCase()))
    .map(user => (
      <li key={user.useremail} className="flex justify-between items-center py-2 px-[31rem]">
        
        {/* User Image */}
        <img 
          src={user.userimage} 
          referrerPolicy="no-referrer"
          alt={`${user.username} 's profile`} 
          className="w-10 h-10 rounded-full object-cover mr-4"
        />
        
        {/* Username and Email */}
        <div className="flex-1">
          {user.username} ({user.useremail})
        </div>
        
        {/* Add Friend Button */}
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
                </div>
                )}

                {list3 && (
                <div className="overflow-y-auto hide-scrollbar h-[34rem] px-3 md:px-0">
                    <div className="requests-list">
                    <h3 className="text-xl font-semibold">Friend Requests</h3>

                    {/* Search Bar for Friend Requests */}
                    <input
                        type="text"
                        placeholder="Search friend requests"
                        className="border rounded-md px-2 py-1 my-4 w-[20rem]"
                        value={searchTermRequests}
                        onChange={(e) => setSearchTermRequests(e.target.value)}
                    />

                    <ul className="list-disc list-inside">
                        {requests
                        .filter(request => request.from.toLowerCase().includes(searchTermRequests.toLowerCase()))
                        .map(request => (
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
                )}

              <style jsx>{`
        .pb-full {
          padding-bottom: 100%;
        }
        .search-bar:focus + .fa-search {
          display: none;
        }
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none; /* IE and Edge */
          scrollbar-width: none; /* Firefox */
        }
        @media screen and (min-width: 768px) {
          .post:hover .overlay {
            display: block;
          }
        }
      `}</style>

        </div>
    );
};

export default FriendsPage;
