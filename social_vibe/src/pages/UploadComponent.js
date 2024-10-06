import React, { useState } from 'react';
import axios from 'axios';
import { useAuth0 } from "@auth0/auth0-react";

export const UploadComponent = () => {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth0();

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!file) {
      alert('Please provide a file');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('email', user.email);
    formData.append('name', user.name);

    setLoading(true);

    try {
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
            accept="image/*,video/*" // Allow both images and videos
          />
        </div>
        <button type="submit" disabled={loading}>
          {loading ? 'Uploading...' : 'Upload'}
        </button>
      </form>
      {loading && <p>Loading...</p>}
    </div>
  );
};

export default UploadComponent;
