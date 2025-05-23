import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth0 } from '@auth0/auth0-react';
import { PostCard } from '../components/PostCard';
import Loader from '../components/Loader';
const PORT = "http://localhost:3001"
const ImageGallery = () => {
  const { user, isLoading } = useAuth0(); // Get user info and loading state from Auth0
  const [mediaItems, setMediaItems] = useState([]); // State to store fetched media (images/videos)
  const [loading, setLoading] = useState(true); // State for loading indicator
  const [error, setError] = useState(null); // State for any errors

  // Utility function to determine media type (image or video) based on URL extension
  const determineMediaType = (url) => {
    const imageExtensions = ['png', 'jpg', 'jpeg', 'gif']; // List of image extensions
    const extension = url.split('.').pop().toLowerCase(); // Extract file extension from URL

    return imageExtensions.includes(extension) ? 'image' : 'video'; // Return 'image' or 'video'
  };

  useEffect(() => {
    const fetchMediaItems = async () => {
      try {
        const response = await axios.get(`${PORT}/api/media/${user.email}`);

        // Map through the media and determine the type based on the URL extension
        const processedMedia = response.data.map((media) => ({
          ...media, // Keep all existing media properties
          type: determineMediaType(media.imageUrl), // Add the media type based on URL extension
        }));

        console.log(response.data);
        setMediaItems(processedMedia); // Set the processed media (with type) to state
      } catch (err) {
        console.error('Error fetching media:', err);
        setError('Error fetching media');
      } finally {
        setLoading(false); // Set loading to false after fetch completes
      }
    };

    if (user) {
      fetchMediaItems(); // Only fetch media if user is logged in
    }
  }, [user]); // Fetch media when user changes

  if (isLoading) {
    return <Loader/>; // Show loading message while fetching user data
  }

  if (!user) {
    return <p>Please log in to see your uploaded media.</p>; // Prompt user to log in if not authenticated
  }

  if (loading) {
    return <Loader/>; // Show loading message
  }

  if (error) {
    return <p>{error}</p>; // Show error message if any
  }

  return (
    <div className="overflow-y-auto hide-scrollbar h-screen py-10">
      {/* Scrollable gallery section */}
      <div className="flex flex-col">
        {mediaItems.map((media) => (
          <div key={media._id} className="w-full h-full flex items-center justify-center">
            <PostCard
              mediaUrl={media.imageUrl}
              mediaType={media.type} // Pass the determined media type (image or video)
              name={media.name}
              id={media._id}
              senderName={user.name}
              senderEmail={user.email}
            />
          </div>
        ))}
      </div>
      
      {/* Custom CSS for the scroll effect */}
      <style jsx>{`
        .hide-scrollbar::-webkit-scrollbar {
          display: none; // Hide scrollbar for webkit browsers
        }
        .hide-scrollbar {
          -ms-overflow-style: none; // IE and Edge
          scrollbar-width: none; // Firefox
        }
      `}</style>
    </div>
  );
};

export default ImageGallery;
