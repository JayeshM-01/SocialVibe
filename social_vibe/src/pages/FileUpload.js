import React, { useState } from 'react';
import axios from 'axios';
import { useAuth0 } from "@auth0/auth0-react";

const FileUpload = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadStatus, setUploadStatus] = useState('');
  const [fileUrl, setFileUrl] = useState('');

  const { user, isAuthenticated, isLoading } = useAuth0();

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      alert('Please select a file');
      return;
    }

    const formData = new FormData();
    formData.append('file', selectedFile);

    try {
      setUploadStatus('Uploading...');

      // Send file and user info to backend for Cloudinary upload
      const response = await axios.post('http://localhost:3001/api', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'username': user.name,  // Pass username from Auth0
          'email': user.email,    // Pass email from Auth0
        },
      });

      const { url, type } = response.data;
      setFileUrl(url);
      setUploadStatus(`File uploaded successfully as ${type}.`);
    } catch (error) {
      console.error('Error uploading file:', error);
      setUploadStatus('Failed to upload file.');
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    isAuthenticated ? (
      <div style={{ textAlign: 'center', marginTop: '50px' }}>
        <h1>Upload Image or Video</h1>
        <input type="file" onChange={handleFileChange} />
        <br />
        <button onClick={handleUpload} style={{ marginTop: '20px' }}>
          Upload
        </button>

        {uploadStatus && <p>{uploadStatus}</p>}
        {fileUrl && (
          <div>
            <p>File URL:</p>
            <a href={fileUrl} target="_blank" rel="noopener noreferrer">
              {fileUrl}
            </a>
          </div>
        )}
      </div>
    ) : (
      <div>Please log in to upload files.</div>
    )
  );
};

export default FileUpload;
