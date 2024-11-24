import { create } from 'zustand';
import { faker } from '@faker-js/faker';
import { User, Post, Comment, SearchResult } from '../types';

interface AppState {
  currentUser: User | null;
  users: User[];
  posts: Post[];
  comments: Comment[];
  initializeData: () => void;
  addPost: (post: Omit<Post, 'id' | 'createdAt' | 'likes'>) => void;
  addComment: (comment: Omit<Comment, 'id' | 'createdAt' | 'likes'>) => void;
  toggleLike: (type: 'post' | 'comment', id: string) => void;
  toggleFriend: (userId: string) => void;
  updateUser: (user: Partial<User>) => void;
  searchContent: (query: string) => SearchResult[];
}

interface LocalStorageData {
  users: User[];
  posts: Post[];
  comments: Comment[];
}

const STORAGE_KEY = 'social_network_data';

const generateInitialData = () => {
  const users: User[] = Array.from({ length: 50 }, () => ({
    id: faker.string.uuid(),
    name: faker.person.fullName(),
    avatar: faker.image.avatarGitHub(),
    coverImage: faker.image.url({ width: 1200, height: 400 }),
    title: faker.person.jobTitle(),
    friends: [],
  }));

  // Create random friendships
  users.forEach((user) => {
    const friendCount = faker.number.int({ min: 5, max: 15 });
    const potentialFriends = users.filter((u) => u.id !== user.id);
    const friends = faker.helpers.arrayElements(potentialFriends, friendCount);

    user.friends = friends.map((f) => f.id);

    // Тут ми додаємо поточного користувача user до друзів у всіх його друзів
    friends.forEach((friend) => {
      if (!friend.friends.includes(user.id)) {
        friend.friends.push(user.id);
      }
    });
  });

  const posts: Post[] = Array.from({ length: 100 }, () => {
    // Вибираємо випадкового користувача
    const user = faker.helpers.arrayElement(users);

    // Пост може бути або текстовим або зображенням або обома, але не може бути порожнім
    const text = Math.random() > 0.5 ? faker.lorem.paragraph() : '';
    const image = Math.random() > 0.5 || !text ? faker.image.url({ width: 800, height: 600 }) : '';

    return {
      id: faker.string.uuid(),
      userId: user.id,
      text,
      image,
      createdAt: faker.date.past().getTime(),
      likes: faker.helpers.arrayElements(users, { min: 0, max: 20 }).map((u) => u.id),
    } as Post;
  });

  const comments: Comment[] = posts.flatMap((post) => 
    Array.from({ length: faker.number.int({ min: 0, max: 5 }) }, () => ({
      id: faker.string.uuid(),
      postId: post.id,
      userId: faker.helpers.arrayElement(users).id,
      text: faker.lorem.sentence(),
      createdAt: faker.date.past().getTime(),
      likes: faker.helpers.arrayElements(users, faker.number.int({ min: 0, max: 10 })).map((u) => u.id),
    }))
  );

  return { users, posts, comments };
};

const loadFromStorage = (): LocalStorageData => {
  const data = localStorage.getItem(STORAGE_KEY);

  if (data) {
    return JSON.parse(data);
  }

  const initialData = generateInitialData();

  localStorage.setItem(STORAGE_KEY, JSON.stringify(initialData));

  return initialData;
};

const saveToStorage = (data: Partial<{ users: User[], posts: Post[], comments: Comment[] }>) => {
  const currentData = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');

  localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...currentData, ...data }));
};

export const useAppStore = create<AppState>((set, get) => ({
  currentUser: null,
  users: [],
  posts: [],
  comments: [],
  
  initializeData: () => {
    const data = loadFromStorage();

    set({
      users: data.users,
      posts: data.posts,
      comments: data.comments,
      currentUser: data.users[0]
    });
  },

  addPost: (postData) => {
    const newPost: Post = {
      id: faker.string.uuid(),
      createdAt: Date.now(),
      likes: [],
      ...postData,
    };

    set(state => {
      const newPosts = [newPost, ...state.posts];

      saveToStorage({ posts: newPosts });

      return { posts: newPosts };
    });
  },

  addComment: (commentData) => {
    const newComment: Comment = {
      id: faker.string.uuid(),
      createdAt: Date.now(),
      likes: [],
      ...commentData,
    };

    set(state => {
      const newComments = [newComment, ...state.comments];

      saveToStorage({ comments: newComments });

      return { comments: newComments };
    });
  },

  toggleLike: (type, id) => {
    const { currentUser } = get();

    if (!currentUser) return;

    set(state => {
      if (type === 'post') {
        const newPosts = state.posts.map(post => {
          if (post.id === id) {
            const likes = post.likes.includes(currentUser.id)
              ? post.likes.filter(userId => userId !== currentUser.id)
              : [...post.likes, currentUser.id];
            return { ...post, likes };
          }
          return post;
        });

        saveToStorage({ posts: newPosts });

        return { posts: newPosts };
      } else {
        const newComments = state.comments.map(comment => {
          if (comment.id === id) {
            const likes = comment.likes.includes(currentUser.id)
              ? comment.likes.filter(userId => userId !== currentUser.id)
              : [...comment.likes, currentUser.id];
            return { ...comment, likes };
          }
          return comment;
        });

        saveToStorage({ comments: newComments });

        return { comments: newComments };
      }
    });
  },

  toggleFriend: (userId) => {
    set(state => {
      if (!state.currentUser) return state;

      const newUsers = state.users.map(user => {
        if (user.id === state.currentUser?.id) {
          const friends = user.friends.includes(userId)
            ? user.friends.filter(id => id !== userId)
            : [...user.friends, userId];

          return { ...user, friends };
        }
        if (user.id === userId) {
          const friends = user.friends.includes(state.currentUser?.id || '')
            ? user.friends.filter(id => id !== state.currentUser?.id)
            : [...user.friends, state.currentUser?.id || ''];
          return { ...user, friends };
        }
        return user;
      });

      saveToStorage({ users: newUsers });

      return {
        users: newUsers,
        currentUser: newUsers.find(u => u.id === state.currentUser?.id) || null
      };
    });
  },

  updateUser: (userData) => {
    set(state => {
      if (!state.currentUser) return state;

      const newUsers = state.users.map(user => 
        user.id === state.currentUser?.id
          ? { ...user, ...userData }
          : user
      );

      saveToStorage({ users: newUsers });

      return {
        users: newUsers,
        currentUser: newUsers.find(u => u.id === state.currentUser?.id) || null
      };
    });
  },

  searchContent: (query) => {
    const { users, posts } = get();
    const results: SearchResult[] = [];
    const lowercaseQuery = query.toLowerCase();

    // Search users
    users.forEach(user => {
      if (
        user.name.toLowerCase().includes(lowercaseQuery) ||
        user.title.toLowerCase().includes(lowercaseQuery)
      ) {
        results.push({ type: 'user', item: user });
      }
    });

    // Search posts
    posts.forEach(post => {
      if (post.text?.toLowerCase().includes(lowercaseQuery)) {
        results.push({ type: 'post', item: post });
      }
    });

    return results;
  },
}));