import { useParams, Navigate } from 'react-router-dom';
import { useAppStore } from '../store';
import Post from '../components/Post';

export default function PostDetail() {
  const { postId } = useParams<{ postId: string }>();
  const posts = useAppStore(state => state.posts);
  
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