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
        </Routes>
      </div>
    </Router>
  );
}

export default App;
