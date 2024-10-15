import React, { useState } from 'react';
import axios from 'axios';
import { useAuth0 } from "@auth0/auth0-react";
import Loader from '../components/Loader';

const FileUpload = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadStatus, setUploadStatus] = useState('');
  const [Status, setStatus] = useState(true);
  const [fileUrl, setFileUrl] = useState('');

  const { user, isAuthenticated, isLoading } = useAuth0();

  const [fileSelected, setFileSelected] = useState(false);
  
  const handleFileChange = (event) => {
    if (event.target.files.length > 0) {
      setFileSelected(true); // File is selected
    } else {
      setFileSelected(false); // No file selected
    }
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
      setFileUrl('');
      setUploadStatus(<Loader/>);
      setStatus(false);
      
      // Send file and user info to baSckend for Cloudinary upload
      const response = await axios.post('http://localhost:3001/api', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'username': user.name,  // Pass username from Auth0
          'email': user.email,    // Pass email from Auth0
        },
      });
      
      const { url, type } = response.data;
      setFileUrl(url);
      setUploadStatus((`File uploaded successfully as ${type}.`));
    } catch (error) {
      console.error('Error uploading file:', error);
      setUploadStatus('Failed to upload file.');
    }
    setStatus(true);
  };

  if (isLoading) {
    return <Loader/>;
  }

  return (
    isAuthenticated ? (
      <div style={{ textAlign: 'center', paddingTop: '5rem' }}>
          <div class="mx-auto max-w-xs">
      <label class="mb-1 block text-sm font-medium text-gray-700">Upload Image or Video</label>
      <label
        class={`flex w-full cursor-pointer appearance-none items-center justify-center rounded-md border-2 border-dashed p-6 transition-all ${
          fileSelected
            ? 'border-green-500 bg-green-50' // Change border and background if file is selected
            : 'border-gray-200 hover:border-primary-300'
        }`}
      >
        <div class="space-y-1 text-center">
          <div class="mx-auto inline-flex h-10 w-10 items-center justify-center rounded-full bg-gray-100">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="currentColor"
              class="h-6 w-6 text-gray-500"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M12 16.5V9.75m0 0l3 3m-3-3l-3 3M6.75 19.5a4.5 4.5 0 01-1.41-8.775 5.25 5.25 0 0110.233-2.33 3 3 0 013.758 3.848A3.752 3.752 0 0118 19.5H6.75z"
              />
            </svg>
          </div>
          <div class={`text-gray-600 ${fileSelected ? 'text-green-600' : ''}`}>
            <a href="#" class={`font-medium ${fileSelected ? 'text-green-500' : 'text-primary-500'} hover:text-primary-700`}>
              {fileSelected ? 'File ready to upload' : 'Click to upload'}
            </a> or drag and drop
          </div>
          <p class="text-sm text-gray-500">SVG, PNG, JPG or GIF (max. 800x400px)</p>
        </div>
        <input type="file" class="sr-only" onChange={handleFileChange} />
      </label>
    </div>

        <br />

    {Status && <button type="button" style={{ marginTop: '20px' }} onClick={handleUpload} class="text-gray-900 bg-gradient-to-r from-teal-200 to-lime-200 hover:bg-gradient-to-l hover:from-teal-200 hover:to-lime-200 focus:ring-4 focus:outline-none focus:ring-lime-200 dark:focus:ring-teal-700 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2">Upload</button>}

        {uploadStatus && <p class="mb-1 block text-m font-medium text-gray-700">{uploadStatus}</p>}

      </div>
    ) : (
      <div class="mb-1 block text-sm font-medium text-gray-700">Please log in to upload files.</div>
    )
  );
};

export default FileUpload;
