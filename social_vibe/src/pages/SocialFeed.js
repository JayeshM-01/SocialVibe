import React, { useState, useEffect } from "react";
import axios from "axios";
import { PostCard } from "../components/PostCard";

const SocialFeed = () => {
  const [posts, setPosts] = useState([]);
  const [page, setPage] = useState(1); // To track pagination
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true); // To stop fetching when no more data

  useEffect(() => {
    // Fetch initial data
    fetchPosts();
    
    // Add scroll event listener
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (page > 1) {
      fetchPosts();
    }
  }, [page]);

  const fetchPosts = async () => {
    if (loading) return;
    setLoading(true);

    try {
      const res = await axios.get(`/api/posts?page=${page}`);
      setPosts((prevPosts) => [...prevPosts, ...res.data.posts]);
      setHasMore(res.data.hasMore); // Check if more data is available
    } catch (error) {
      console.error("Failed to load posts", error);
    } finally {
      setLoading(false);
    }
  };

  const handleScroll = () => {
    if (window.innerHeight + document.documentElement.scrollTop !== document.documentElement.offsetHeight || loading) {
      return;
    }
    if (hasMore) {
      setPage((prevPage) => prevPage + 1);
    }
  };

  return (
    <div>
      {posts.map((post) => (
        <PostCard key={post.id} post={post} />
      ))}
      {loading && <p>Loading...</p>}
      {!hasMore && <p>No more posts to load.</p>}
    </div>
  );
};

export default SocialFeed;
