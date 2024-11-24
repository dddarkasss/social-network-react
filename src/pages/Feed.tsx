import React, { useState } from 'react';
import { useAppStore } from '../store';
import Post from '../components/Post';

export default function Feed() {
  const { currentUser, posts, addPost } = useAppStore();
  const [newPostText, setNewPostText] = useState('');
  const [newPostImage, setNewPostImage] = useState('');

  // Vue альтернатива:
  // const newPostText = ref('');
  // const newPostImage = ref('');
  //
  // const setNewPostText = (value) => {
  //   newPostText.value = value;
  // };
  //
  // const setNewPostImage = (value) => {
  //   newPostImage.value = value;
  // };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser || (!newPostText.trim() && !newPostImage.trim())) return;

    addPost({
      userId: currentUser.id,
      text: newPostText.trim() || undefined,
      image: newPostImage.trim() || undefined
    });

    setNewPostText('');
    setNewPostImage('');
  };

  return (
    <div>
      <div className="bg-white rounded-lg shadow-md mb-6 p-4">
        <form onSubmit={handleSubmit}>
          <textarea
            value={newPostText}
            onChange={(e) => setNewPostText(e.target.value)}
            placeholder="What's on your mind?"
            className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows={3}
          />
          <div className="flex items-center mt-3 space-x-3">
            <div className="flex-1">
              <input
                type="text"
                value={newPostImage}
                onChange={(e) => setNewPostImage(e.target.value)}
                placeholder="Image URL (optional)"
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <button
              type="submit"
              disabled={!newPostText.trim() && !newPostImage.trim()}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              Post
            </button>
          </div>
        </form>
      </div>

      <div className="space-y-6">
        {posts
          .sort((a, b) => b.createdAt - a.createdAt)
          .filter(post => currentUser?.friends.includes(post.userId) || post.userId === currentUser?.id)
          .map(post => (
            <Post key={post.id} post={post} />
          ))}
      </div>
    </div>
  );
}