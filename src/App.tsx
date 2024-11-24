import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useEffect } from 'react';
import { useAppStore } from './store';
import Navbar from './components/Navbar';
import Feed from './pages/Feed';
import Friends from './pages/Friends';
import Search from './pages/Search';
import UserProfile from './pages/UserProfile';
import PostDetail from './pages/PostDetail';
import Settings from './pages/Settings';

export default function App() {
  const {initializeData} = useAppStore();

  // Vue альтернатива:
  // onMounted(() => {
  //   initializeData();
  // });

  // Як тільки додаток стартує, ініціалізуємо дані
  useEffect(() => {
    initializeData();
  }, []);

  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-100">
        <Navbar />
        <main className="container mx-auto px-4 py-8 max-w-4xl">
          <Routes>
            <Route path="/" element={<Feed />} />
            <Route path="/friends" element={<Friends />} />
            <Route path="/search" element={<Search />} />
            <Route path="/user/:userId" element={<UserProfile />} />
            <Route path="/post/:postId" element={<PostDetail />} />
            <Route path="/settings" element={<Settings />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}
