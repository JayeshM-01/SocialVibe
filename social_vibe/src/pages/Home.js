import React, { useState } from 'react';
import { useAuth0 } from "@auth0/auth0-react";
import { Sidebar } from '../components/Sidebar';
import { PostCard } from '../components/PostCard';
import axios from 'axios';

export const Home = () => {
    const { user, isAuthenticated, isLoading } = useAuth0();
    
    
    // Handle form submission
    // Ensure form submission only if user is authenticated
    if (isLoading) {
        return <div>Loading...</div>; // Optional: Loading state
    }

    return (
        <div>
            <PostCard/>
        </div>
    );
};
