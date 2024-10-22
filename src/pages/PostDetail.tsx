import React from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { useStore } from '../store';
import Post from '../components/Post';

export default function PostDetail() {
  const { postId } = useParams<{ postId: string }>();
  const posts = useStore(state => state.posts);
  
  const post = posts.find(p => p.id === postId);

  if (!post) {
    return <Navigate to="/" replace />;
  }

  return (
    <div>
      <Post post={post} />
    </div>
  );
}