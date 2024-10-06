import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth0 } from '@auth0/auth0-react';
import { PostCard } from '../components/PostCard';

const ImageGallery = () => {
  const { user, isLoading } = useAuth0(); // Get user info and loading state from Auth0
  const [images, setImages] = useState([]); // State to store fetched images
  const [loading, setLoading] = useState(true); // State for loading indicator
  const [error, setError] = useState(null); // State for any errors

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const response = await axios.get(`http://localhost:3001/api/images/${user.email}`);
        setImages(response.data); // Set the fetched images to state
      } catch (err) {
        console.error('Error fetching images:', err);
        setError('Error fetching images');
      } finally {
        setLoading(false); // Set loading to false after fetch completes
      }
    };

    if (user) {
      fetchImages(); // Only fetch images if user is logged in
    }
  }, [user]); // Fetch images when user changes

  if (isLoading) {
    return <p>Loading user data...</p>; // Show loading message while fetching user data
  }

  if (!user) {
    return <p>Please log in to see your uploaded images.</p>; // Prompt user to log in if not authenticated
  }

  if (loading) {
    return <p>Loading images...</p>; // Show loading message
  }

  if (error) {
    return <p>{error}</p>; // Show error message if any
  }

  return (
    <div >
      <div className='flex flex-col' style={{ display: 'flex', flexWrap: 'wrap' }}>
        {images.map((image) => (
          <div key={image._id} style={{ margin: '10px' }}>
            <PostCard images={image.imageUrl}/>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ImageGallery;
