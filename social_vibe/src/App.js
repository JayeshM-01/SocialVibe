import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import { Home } from './pages/Home';
import UploadComponent from './pages/UploadComponent';
import { Sidebar } from './components/Sidebar';
import ImageGallery from './pages/ImageGallery';
import FriendsPage from './pages/FriendsPage';
import { SocketChat } from './pages/SocketChat';
import FileUpload from './pages/FileUpload';
import Loader from './components/Loader';
import SocialFeed from './pages/SocialFeed';
import { Profile } from './pages/Profile';

function App() {
  return (
    <Router>
      <div className="App">
        <Sidebar/>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/upload" element={<UploadComponent />} />
          <Route path="/reels" element={<ImageGallery />} />
          <Route path="/friends" element={<FriendsPage />} />
          <Route path="/chat" element={<SocketChat />} />
          <Route path="/fileupload" element={<FileUpload />} />
          <Route path="/load" element={<Loader />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/infinite" element={<SocialFeed />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
