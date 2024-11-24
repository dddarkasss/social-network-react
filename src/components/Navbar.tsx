import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAppStore } from '../store';
import { Home, Users, Search as SearchIcon, Settings } from 'lucide-react';

export default function Navbar() {
  const [searchQuery, setSearchQuery] = useState('');

  // Vue виглядала б так:
  // const searchQuery = ref('');
  // const setSearchQuery = (value) => {
  //   searchQuery.value = value;
  // };

  const navigate = useNavigate(); // Vue аналог: const router = useRouter();
  const {currentUser} = useAppStore();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`); // Vue аналог: router.push(`/search?q=${encodeURIComponent(searchQuery.value)}`);
    }
  };

  return (
    <nav className="bg-white shadow-md">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-4">
            <Link to="/" className="text-blue-600 hover:text-blue-800">
              <Home className="w-6 h-6" />
            </Link>
            <Link to="/friends" className="text-gray-600 hover:text-gray-800">
              <Users className="w-6 h-6" />
            </Link>
          </div>

          <form onSubmit={handleSearch} className="flex-1 max-w-md mx-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-2 rounded-full bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button type="submit" className="absolute right-3 top-2.5 text-gray-500">
                <SearchIcon className="w-5 h-5" />
              </button>
            </div>
          </form>

          <div className="flex items-center space-x-4">
            <Link to="/settings" className="text-gray-600 hover:text-gray-800">
              <Settings className="w-6 h-6" />
            </Link>
            {currentUser && (
              <Link to={`/user/${currentUser.id}`} className="flex items-center space-x-2">
                <img
                  src={currentUser.avatar}
                  alt={currentUser.name}
                  className="w-8 h-8 rounded-full"
                />
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}