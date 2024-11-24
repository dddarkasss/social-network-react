import React from 'react';
import { Link } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';
import { Heart, MessageCircle } from 'lucide-react';
import { useAppStore } from '../store';
import type { Post as PostType } from '../types';

interface PostProps {
  post: PostType;
  showComments?: boolean;
}

export default function Post({ post, showComments = true }: PostProps) {
  const { users, comments, currentUser, toggleLike, addComment } = useAppStore();
  const [commentText, setCommentText] = React.useState('');
  
  const author = users.find(u => u.id === post.userId);
  const postComments = comments.filter(c => c.postId === post.id);
  const isLiked = post.likes.includes(currentUser?.id || '');

  const handleLike = () => {
    toggleLike('post', post.id);
  };

  const handleComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser || !commentText.trim()) return;

    addComment({
      postId: post.id,
      userId: currentUser.id,
      text: commentText.trim()
    });
    setCommentText('');
  };

  if (!author) return null;

  return (
    <div className="bg-white rounded-lg shadow-md mb-4 p-4">
      <div className="flex items-center mb-4">
        <Link to={`/user/${author.id}`}>
          <img src={author.avatar} alt={author.name} className="w-10 h-10 rounded-full" />
        </Link>
        <div className="ml-3">
          <Link to={`/user/${author.id}`} className="font-semibold text-gray-900 hover:underline">
            {author.name}
          </Link>
          <p className="text-gray-500 text-sm">
            {formatDistanceToNow(post.createdAt, { addSuffix: true })}
          </p>
        </div>
      </div>

      {post.text && (
        <p className="text-gray-800 mb-4">{post.text}</p>
      )}

      {post.image && (
        <img src={post.image} alt="Post content" className="rounded-lg mb-4 w-full" />
      )}

      <div className="flex items-center justify-between border-t border-gray-200 pt-3">
        <button
          onClick={handleLike}
          className={`flex items-center space-x-2 ${isLiked ? 'text-red-500' : 'text-gray-500'} hover:text-red-500`}
        >
          <Heart className={`w-5 h-5 ${isLiked ? 'fill-current' : ''}`} />
          <span>{post.likes.length}</span>
        </button>
        <Link to={`/post/${post.id}`} className="flex items-center space-x-2 text-gray-500 hover:text-gray-700">
          <MessageCircle className="w-5 h-5" />
          <span>{postComments.length}</span>
        </Link>
      </div>

      {showComments && (
        <div className="mt-4">
          <form onSubmit={handleComment} className="mb-4">
            <input
              type="text"
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder="Write a comment..."
              className="w-full px-4 py-2 rounded-full bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </form>

          <div className="space-y-3">
            {postComments.map(comment => {
              const commentAuthor = users.find(u => u.id === comment.userId);
              if (!commentAuthor) return null;

              return (
                <div key={comment.id} className="flex space-x-3">
                  <Link to={`/user/${commentAuthor.id}`}>
                    <img src={commentAuthor.avatar} alt={commentAuthor.name} className="w-8 h-8 rounded-full" />
                  </Link>
                  <div className="flex-1 bg-gray-100 rounded-lg p-3">
                    <Link to={`/user/${commentAuthor.id}`} className="font-semibold text-gray-900 hover:underline">
                      {commentAuthor.name}
                    </Link>
                    <p className="text-gray-800">{comment.text}</p>
                    <div className="flex items-center space-x-2 mt-2 text-sm text-gray-500">
                      <button
                        onClick={() => toggleLike('comment', comment.id)}
                        className={`hover:text-red-500 ${comment.likes.includes(currentUser?.id || '') ? 'text-red-500' : ''}`}
                      >
                        Like ({comment.likes.length})
                      </button>
                      <span>·</span>
                      <span>{formatDistanceToNow(comment.createdAt, { addSuffix: true })}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}