import React from 'react';
import { useParams } from 'react-router-dom';
import { useStore } from '../store';
import Post from '../components/Post';
import { UserPlus, UserMinus } from 'lucide-react';

export default function UserProfile() {
  const { userId } = useParams<{ userId: string }>();
  const { users, posts, currentUser, toggleFriend } = useStore();
  
  const user = users.find(u => u.id === userId);
  const userPosts = posts.filter(post => post.userId === userId);
  const isFriend = currentUser?.friends.includes(userId || '');
  const isCurrentUser = currentUser?.id === userId;

  if (!user) return <div>User not found</div>;

  return (
    <div>
      <div className="relative mb-6">
        <img
          src={user.coverImage}
          alt="Cover"
          className="w-full h-48 object-cover rounded-lg"
        />
        <div className="absolute -bottom-16 left-4">
          <img
            src={user.avatar}
            alt={user.name}
            className="w-32 h-32 rounded-full border-4 border-white"
          />
        </div>
      </div>

      <div className="mt-20 mb-6">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{user.name}</h1>
            <p className="text-gray-500">{user.title}</p>
            <p className="text-gray-600 mt-2">{user.friends.length} friends</p>
          </div>
          
          {!isCurrentUser && (
            <button
              onClick={() => toggleFriend(user.id)}
              className={`flex items-center space-x-2 px-6 py-2 rounded-lg ${
                isFriend
                  ? 'bg-red-50 text-red-600 hover:bg-red-100'
                  : 'bg-blue-50 text-blue-600 hover:bg-blue-100'
              }`}
            >
              {isFriend ? (
                <>
                  <UserMinus className="w-5 h-5" />
                  <span>Unfriend</span>
                </>
              ) : (
                <>
                  <UserPlus className="w-5 h-5" />
                  <span>Add Friend</span>
                </>
              )}
            </button>
          )}
        </div>
      </div>

      <div className="space-y-6">
        {userPosts
          .sort((a, b) => b.createdAt - a.createdAt)
          .map(post => (
            <Post key={post.id} post={post} />
          ))}

        {userPosts.length === 0 && (
          <p className="text-center text-gray-500 py-8">No posts yet</p>
        )}
      </div>
    </div>
  );
}