import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { useAuth } from '../contexts/AuthContext';
import { Plus, MessageCircle, User, Clock, TrendingUp } from 'lucide-react';
import toast from 'react-hot-toast';

interface ForumPost {
  id: number;
  title: string;
  content: string;
  author: {
    id: number;
    username: string;
  };
  created_at: string;
  updated_at: string;
  replies_count: number;
}

const ForumPage: React.FC = () => {
  const [posts, setPosts] = useState<ForumPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();
  const navigate = useNavigate();

  const fetchPosts = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`${import.meta.env.VITE_API_URL}/forum/posts`);
      
      if (!response.ok) {
        throw new Error('Erro ao carregar posts');
      }

      const data = await response.json();
      setPosts(data.posts || []);
    } catch (error) {
      console.error('Erro ao carregar posts:', error);
      toast.error('Erro ao carregar posts do fórum');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) {
      return 'Agora mesmo';
    } else if (diffInHours < 24) {
      return `${diffInHours}h atrás`;
    } else {
      const diffInDays = Math.floor(diffInHours / 24);
      if (diffInDays < 7) {
        return `${diffInDays}d atrás`;
      } else {
        return date.toLocaleDateString('pt-BR');
      }
    }
  };

  const truncateContent = (content: string, maxLength: number = 150) => {
    if (content.length <= maxLength) return content;
    return content.substring(0, maxLength) + '...';
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="myverse-container myverse-section">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-muted-foreground">Carregando fórum...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="myverse-container myverse-section">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
          <div>
            <h1 className="myverse-heading-2 mb-2">Fórum da Comunidade</h1>
            <p className="text-muted-foreground">
              Discuta filmes, séries, jogos e livros com a comunidade
            </p>
          </div>
          
          {user && (
            <Button 
              onClick={() => navigate('/forum/create')}
              className="mt-4 md:mt-0"
            >
              <Plus className="w-4 h-4 mr-2" />
              Criar Tópico
            </Button>
          )}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <MessageCircle className="w-5 h-5 text-blue-500" />
                <div>
                  <p className="text-sm font-medium">Total de Tópicos</p>
                  <p className="text-2xl font-bold">{posts.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <User className="w-5 h-5 text-green-500" />
                <div>
                  <p className="text-sm font-medium">Membros Ativos</p>
                  <p className="text-2xl font-bold">
                    {new Set(posts.map(post => post.author.id)).size}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <TrendingUp className="w-5 h-5 text-purple-500" />
                <div>
                  <p className="text-sm font-medium">Total de Respostas</p>
                  <p className="text-2xl font-bold">
                    {posts.reduce((sum, post) => sum + post.replies_count, 0)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Posts List */}
        {posts.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <MessageCircle className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Nenhum tópico ainda</h3>
              <p className="text-muted-foreground mb-4">
                Seja o primeiro a iniciar uma discussão na comunidade
              </p>
              {user ? (
                <Button onClick={() => navigate('/forum/create')}>
                  <Plus className="w-4 h-4 mr-2" />
                  Criar Primeiro Tópico
                </Button>
              ) : (
                <Button onClick={() => navigate('/login')}>
                  Fazer Login para Participar
                </Button>
              )}
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {posts.map((post) => (
              <Card 
                key={post.id} 
                className="hover:shadow-md transition-shadow cursor-pointer"
                onClick={() => navigate(`/forum/topic/${post.id}`)}
              >
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg mb-2 hover:text-primary transition-colors">
                        {post.title}
                      </h3>
                      
                      <p className="text-muted-foreground text-sm mb-4">
                        {truncateContent(post.content)}
                      </p>
                      
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center text-xs text-primary-foreground">
                            {post.author.username.charAt(0).toUpperCase()}
                          </div>
                          <span className="font-medium">{post.author.username}</span>
                        </div>
                        
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          <span>{formatDate(post.created_at)}</span>
                        </div>
                        
                        <div className="flex items-center gap-1">
                          <MessageCircle className="w-4 h-4" />
                          <span>{post.replies_count} respostas</span>
                        </div>
                      </div>
                    </div>
                    
                    {post.replies_count > 0 && (
                      <Badge variant="secondary" className="ml-4">
                        {post.replies_count}
                      </Badge>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Call to Action for Non-Logged Users */}
        {!user && posts.length > 0 && (
          <Card className="mt-8">
            <CardContent className="p-6 text-center">
              <h3 className="font-semibold mb-2">Junte-se à Discussão</h3>
              <p className="text-muted-foreground mb-4">
                Faça login para criar tópicos e participar das conversas
              </p>
              <div className="flex gap-2 justify-center">
                <Button onClick={() => navigate('/login')}>
                  Fazer Login
                </Button>
                <Button variant="outline" onClick={() => navigate('/register')}>
                  Criar Conta
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default ForumPage;

