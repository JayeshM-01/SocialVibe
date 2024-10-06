import React, { useState } from 'react';
import axios from 'axios';
import { useAuth0 } from "@auth0/auth0-react";

export const UploadComponent = () => {
  const [file, setFile] = useState(null); // State to store the uploaded file
  const [loading, setLoading] = useState(false); // State to track loading status
  const { user } = useAuth0(); // Get user info from Auth0 (to get the email)

  const handleFileChange = (e) => {
    setFile(e.target.files[0]); // Storing the selected file in state
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!file) {
      alert('Please provide a file');
      return;
    }
    
    // Prepare form data
    const formData = new FormData();
    formData.append('file', file); // Add file to the form data
    formData.append('email', user.email); // Add user's email from Auth0 profile

    // Set loading to true when upload starts
    setLoading(true);

    try {
      // Send the form data using axios
      const response = await axios.post('http://localhost:3001/api/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      alert('File uploaded successfully!');
      console.log(response.data);
    } catch (error) {
      console.error('Error uploading file:', error);
      alert('Error uploading file');
    } finally {
      // Reset loading state after upload completes (successful or failed)
      setLoading(false);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Upload File:</label>
          <input 
            type="file" 
            onChange={handleFileChange} 
            required 
          />
        </div>
        <button type="submit" disabled={loading}>
          {loading ? 'Uploading...' : 'Upload'}
        </button>
      </form>
      {loading && <p>Loading...</p>} {/* Show loader text */}
    </div>
  );
};

export default UploadComponent;
