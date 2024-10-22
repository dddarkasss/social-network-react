import React from 'react';
import { Link } from 'react-router-dom';
import { useStore } from '../store';
import { UserMinus, MessageCircle } from 'lucide-react';

export default function Friends() {
  const { currentUser, users, toggleFriend } = useStore();
  
  if (!currentUser) return null;

  const friends = users.filter(user => 
    currentUser.friends.includes(user.id)
  );

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {friends.map(friend => (
        <div key={friend.id} className="bg-white rounded-lg shadow-md p-4">
          <div className="flex items-center space-x-4">
            <Link to={`/user/${friend.id}`}>
              <img
                src={friend.avatar}
                alt={friend.name}
                className="w-16 h-16 rounded-full"
              />
            </Link>
            <div className="flex-1">
              <Link
                to={`/user/${friend.id}`}
                className="font-semibold text-lg text-gray-900 hover:underline"
              >
                {friend.name}
              </Link>
              <p className="text-gray-500">{friend.title}</p>
            </div>
          </div>
          
          <div className="flex justify-end space-x-2 mt-4">
            <button
              onClick={() => toggleFriend(friend.id)}
              className="flex items-center space-x-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg"
            >
              <UserMinus className="w-5 h-5" />
              <span>Unfriend</span>
            </button>
            <Link
              to={`/messages/${friend.id}`}
              className="flex items-center space-x-2 px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-lg"
            >
              <MessageCircle className="w-5 h-5" />
              <span>Message</span>
            </Link>
          </div>
        </div>
      ))}
    </div>
  );
}