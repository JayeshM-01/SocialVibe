import React, { useState } from 'react';
import { useAuth0 } from "@auth0/auth0-react";
import axios from 'axios';
import Loader from '../components/Loader';
import ImageGallery from './ImageGallery';

export const Home = () => {
    const { user, isAuthenticated, isLoading } = useAuth0();
    
    
    // Handle form submission
    // Ensure form submission only if user is authenticated
    if (isLoading) {
        return <Loader/>; // Optional: Loading state
    }

    return (
        <div>
            <ImageGallery/>
        </div>
    );
};
