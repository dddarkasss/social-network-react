export interface User {
  id: string;
  name: string;
  avatar: string;
  coverImage: string;
  title: string;
  friends: string[];
}

export interface Post {
  id: string;
  userId: string;
  text?: string;
  image?: string;
  createdAt: number;
  likes: string[];
}

export interface Comment {
  id: string;
  postId: string;
  userId: string;
  text: string;
  createdAt: number;
  likes: string[];
}

export interface SearchResult {
  type: 'user' | 'post';
  item: User | Post;
}