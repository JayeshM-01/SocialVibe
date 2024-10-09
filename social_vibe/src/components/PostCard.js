import axios from 'axios';
import React, { useState } from 'react';
import socketIOClient from 'socket.io-client';
import { SocketChat } from '../pages/SocketChat';

export const PostCard = ({ mediaUrl, mediaType, name, id, senderName, senderEmail }) => {
  const [isModalOpen, setIsModalOpen] = useState(false); // State for media modal
  const [isCommentModalOpen, setIsCommentModalOpen] = useState(false); // State for comment modal
  const [newComment, setNewComment] = useState(''); // State for new comment input
  const socket = socketIOClient('http://localhost:3001'); // Connect to the backend

  // Handle opening the media modal
  const handleMediaClick = () => {
    setIsModalOpen(true);
  };

  // Handle closing the media modal
  const closeModal = () => {
    setIsModalOpen(false);
  };

  // Handle opening the comment modal
  const openCommentModal = () => {
    setIsCommentModalOpen(true);
  };

  // Handle closing the comment modal
  const closeCommentModal = () => {
    setIsCommentModalOpen(false);
  };

  // Handle submitting a new comment
  const handleCommentSubmit = (e) => {
    e.preventDefault();
    if (newComment.trim() !== '') {
      // Send the comment data to the server via socket.io
      socket.emit('newMessage', {
        senderName,
        senderEmail,
        mediaUrl,
        mediaId: id,
        ownerName: name, // Owner of the media post
        message: newComment,
      });

      // Clear input after submission
      setNewComment('');

      // Refresh the page to reflect the new comment
      window.location.reload(); // Refresh the page
    }
  };

  return (
    <div>
      <div className="container mx-auto px-20">
        <div>
          <div className="p-3 px-6 min-h-48 flex justify-center items-center border-black" style={{ cursor: 'auto' }}>
            <div className="rounded-md shadow-md sm:w-96 bg-white text-coolGray-100">
              <div className="flex items-center justify-between p-3" style={{ cursor: 'auto' }}>
                <div className="flex items-center space-x-2" style={{ cursor: 'auto' }}>
                  <img
                    src="https://stackdiary.com/140x100.png"
                    alt=""
                    className="object-cover object-center w-8 h-8 rounded-full shadow-sm bg-coolGray-500 border-coolGray-700"
                    style={{ cursor: 'auto' }}
                  />
                  <div className="-space-y-1" style={{ cursor: 'auto' }}>
                    <h2 className="text-sm font-semibold leading-none" style={{ cursor: 'auto' }}>
                      {name}
                    </h2>
                  </div>
                </div>
              </div>

              {/* Conditional rendering based on media type */}
              {mediaType === 'image' ? (
                <img
                  src={mediaUrl}
                  alt=""
                  className="object-contain object-center w-full min-h-80 h-full bg-coolGray-500 cursor-pointer"
                  onClick={handleMediaClick}
                />
              ) : (
                <video
                  src={mediaUrl}
                  className="object-contain object-center w-full min-h-80 h-full bg-coolGray-500 cursor-pointer"
                  controls
                  onClick={handleMediaClick}
                />
              )}

              <div className="p-3" style={{ cursor: 'auto' }}>
                <div className="flex items-center justify-between" style={{ cursor: 'auto' }}>
                  <div className="flex items-center space-x-3">
                    <button type="button" title="Like post" className="flex items-center justify-center">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" className="w-5 h-5 fill-current"></svg>
                    </button>

                    {/* Comment Button */}
                    <button
                      type="button"
                      title="Add a comment"
                      className="flex items-center justify-center"
                      onClick={openCommentModal} // Open comment modal
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" className="w-5 h-5 fill-current">
                        <path d="M496,496H480a273.39,273.39,0,0,1-179.025-66.782l-16.827-14.584C274.814,415.542,265.376,416,256,416c-63.527,0-123.385-20.431-168.548-57.529C41.375,320.623,16,270.025,16,216S41.375,111.377,87.452,73.529C132.615,36.431,192.473,16,256,16S379.385,36.431,424.548,73.529C470.625,111.377,496,161.975,496,216a171.161,171.161,0,0,1-21.077,82.151,201.505,201.505,0,0,1-47.065,57.537,285.22,285.22,0,0,0,63.455,97L496,457.373ZM294.456,381.222l27.477,23.814a241.379,241.379,0,0,0,135,57.86,317.5,317.5,0,0,1-62.617-105.583v0l-4.395-12.463,9.209-7.068C440.963,305.678,464,262.429,464,216c0-92.636-93.309-168-208-168S48,123.364,48,216s93.309,168,208,168a259.114,259.114,0,0,0,31.4-1.913Z"></path>
                      </svg>
                    </button>
                  </div>
                </div>
                <br />
                <div className="space-y-3" style={{ cursor: 'auto' }}>
                  <h2 className="block text-xs tracking-widest uppercase text-coolGray-900">by {name}</h2>
                </div>
              </div>
            </div>
          </div>

          {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="relative">

            {/* Display media based on type */}
            {mediaType === 'image' ? (
                  <img src={mediaUrl} alt="Selected media" className='max-w-full max-h-full'/>
                ) : (
                  <video className='max-w-full max-h-full' src={mediaUrl} controls />
                )}
            <button
              onClick={closeModal}
              className="absolute top-0 right-0 p-2 text-white bg-red-500 rounded-full"
            >
              &times; {/* Close button */}
            </button>
          </div>
        </div>
      )}

          {/* Comment Modal */}
          {isCommentModalOpen && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="relative">
  
              <SocketChat id={id} name={senderName} email={senderEmail} closeCommentModal={closeCommentModal}/>
            </div>
          </div>
          )}
        </div>
      </div>
    </div>
  );
};
