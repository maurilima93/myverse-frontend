import axios from 'axios';
import toast from 'react-hot-toast';

// Configuração base da API
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para adicionar token de autorização
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('myverse_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para tratar respostas e erros
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      // Token expirado ou inválido
      localStorage.removeItem('myverse_token');
      localStorage.removeItem('myverse_user');
      window.location.href = '/login';
    }
    
    // Mostrar erro para o utilizador
    const message = error.response?.data?.error || 'Erro de conexão';
    toast.error(message);
    
    return Promise.reject(error);
  }
);

// Tipos TypeScript
export interface User {
  id: number;
  username: string;
  email: string;
  created_at: string;
  updated_at: string;
  is_active: boolean;
  avatar_url?: string;
  bio?: string;
  preferences?: UserPreferences;
}

export interface UserPreferences {
  id: number;
  user_id: number;
  categories: string[];
  genres: string[];
  created_at: string;
  updated_at: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface RegisterData {
  username: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  message: string;
  access_token: string;
  user: User;
}

export interface ContentItem {
  id: string;
  title: string;
  overview: string;
  poster_path?: string;
  backdrop_path?: string;
  release_date: string;
  vote_average: number;
  vote_count: number;
  type: 'movie' | 'series' | 'game';
  genres?: string[];
  platforms?: string[];
}

export interface SearchResponse {
  results: ContentItem[];
  total_results: number;
  query: string;
}

export interface ForumCategory {
  id: number;
  name: string;
  description: string;
  icon: string;
  color: string;
  post_count: number;
  created_at: string;
}

export interface ForumPost {
  id: number;
  title: string;
  content: string;
  author: User;
  category: ForumCategory;
  is_pinned: boolean;
  is_locked: boolean;
  views_count: number;
  comments_count: number;
  created_at: string;
  updated_at: string;
}

export interface ForumComment {
  id: number;
  content: string;
  author: User;
  post_id: number;
  parent_id?: number;
  replies_count: number;
  created_at: string;
  updated_at: string;
}

// Serviços de Autenticação
export const authService = {
  async login(data: LoginData): Promise<AuthResponse> {
    const response = await api.post('/auth/login', data);
    return response.data;
  },

  async register(data: RegisterData): Promise<AuthResponse> {
    const response = await api.post('/auth/register', data);
    return response.data;
  },

  async getCurrentUser(): Promise<{ user: User }> {
    const response = await api.get('/auth/me');
    return response.data;
  },

  async updateProfile(data: Partial<User>): Promise<{ user: User }> {
    const response = await api.put('/auth/update-profile', data);
    return response.data;
  },

  async changePassword(data: { current_password: string; new_password: string }): Promise<{ message: string }> {
    const response = await api.put('/auth/change-password', data);
    return response.data;
  },

  async savePreferences(data: { categories: string[]; genres: string[] }): Promise<{ preferences: UserPreferences }> {
    const response = await api.post('/auth/preferences', data);
    return response.data;
  },

  async getPreferences(): Promise<{ preferences: UserPreferences | null }> {
    const response = await api.get('/auth/preferences');
    return response.data;
  },
};

// Serviços de Conteúdo
export const contentService = {
  async search(query: string, type: string = 'all', page: number = 1): Promise<SearchResponse> {
    const response = await api.get('/content/search', {
      params: { q: query, type, page }
    });
    return response.data;
  },

  async getTrending(type: string = 'all', timeWindow: string = 'week'): Promise<{ results: ContentItem[] }> {
    const response = await api.get('/content/trending', {
      params: { type, time_window: timeWindow }
    });
    return response.data;
  },

  async getRecommendations(): Promise<{ results: ContentItem[] }> {
    const response = await api.get('/content/recommendations');
    return response.data;
  },

  async addFavorite(data: {
    content_type: string;
    content_id: string;
    content_title: string;
    content_poster?: string;
    content_data?: any;
  }): Promise<{ message: string }> {
    const response = await api.post('/content/favorites', data);
    return response.data;
  },

  async getFavorites(): Promise<{ favorites: any[] }> {
    const response = await api.get('/content/favorites');
    return response.data;
  },

  async removeFavorite(favoriteId: number): Promise<{ message: string }> {
    const response = await api.delete(`/content/favorites/${favoriteId}`);
    return response.data;
  },
};

// Serviços de Fórum
export const forumService = {
  async getCategories(): Promise<{ categories: ForumCategory[] }> {
    const response = await api.get('/forum/categories');
    return response.data;
  },

  async getPosts(categoryId?: number, page: number = 1, sortBy: string = 'created_at'): Promise<{
    posts: ForumPost[];
    pagination: any;
  }> {
    const response = await api.get('/forum/posts', {
      params: { category_id: categoryId, page, sort_by: sortBy }
    });
    return response.data;
  },

  async getPost(postId: number): Promise<{ post: ForumPost & { comments: ForumComment[] } }> {
    const response = await api.get(`/forum/posts/${postId}`);
    return response.data;
  },

  async createPost(data: {
    title: string;
    content: string;
    category_id: number;
  }): Promise<{ post: ForumPost }> {
    const response = await api.post('/forum/posts', data);
    return response.data;
  },

  async updatePost(postId: number, data: { title?: string; content?: string }): Promise<{ post: ForumPost }> {
    const response = await api.put(`/forum/posts/${postId}`, data);
    return response.data;
  },

  async deletePost(postId: number): Promise<{ message: string }> {
    const response = await api.delete(`/forum/posts/${postId}`);
    return response.data;
  },

  async createComment(postId: number, data: {
    content: string;
    parent_id?: number;
  }): Promise<{ comment: ForumComment }> {
    const response = await api.post(`/forum/posts/${postId}/comments`, data);
    return response.data;
  },

  async updateComment(commentId: number, data: { content: string }): Promise<{ comment: ForumComment }> {
    const response = await api.put(`/forum/comments/${commentId}`, data);
    return response.data;
  },

  async deleteComment(commentId: number): Promise<{ message: string }> {
    const response = await api.delete(`/forum/comments/${commentId}`);
    return response.data;
  },

  async getStats(): Promise<{
    stats: { total_posts: number; total_comments: number; total_users: number };
    popular_posts: ForumPost[];
    recent_posts: ForumPost[];
  }> {
    const response = await api.get('/forum/stats');
    return response.data;
  },
};

export default api;

