import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { useAuth } from '../contexts/AuthContext';
import { Calendar, User, ExternalLink, Plus, Filter } from 'lucide-react';
import toast from 'react-hot-toast';

interface NewsArticle {
  id: number;
  title: string;
  content: string;
  summary?: string;
  image_url?: string;
  source_url?: string;
  category: string;
  is_featured: boolean;
  author: {
    id: number;
    username: string;
  };
  created_at: string;
  published_at: string;
}

interface Pagination {
  page: number;
  pages: number;
  per_page: number;
  total: number;
  has_next: boolean;
  has_prev: boolean;
}

const NewsPage: React.FC = () => {
  const [news, setNews] = useState<NewsArticle[]>([]);
  const [featuredNews, setFeaturedNews] = useState<NewsArticle[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const { user } = useAuth();
  const navigate = useNavigate();

  const categories = [
    { id: 'all', name: 'Todas', icon: '📰' },
    { id: 'geral', name: 'Geral', icon: '🌟' },
    { id: 'movies', name: 'Filmes', icon: '🎬' },
    { id: 'tv', name: 'Séries', icon: '📺' },
    { id: 'games', name: 'Jogos', icon: '🎮' },
  ];

  const fetchNews = async (page: number = 1, category: string = 'all') => {
    try {
      setIsLoading(true);
      const params = new URLSearchParams({
        page: page.toString(),
        per_page: '6'
      });
      
      if (category !== 'all') {
        params.append('category', category);
      }

      const response = await fetch(`${import.meta.env.VITE_API_URL}/news?${params}`);
      
      if (!response.ok) {
        throw new Error('Erro ao carregar notícias');
      }

      const data = await response.json();
      setNews(data.news || []);
      setPagination(data.pagination);
    } catch (error) {
      console.error('Erro ao carregar notícias:', error);
      toast.error('Erro ao carregar notícias');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchFeaturedNews = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/news?featured=true&per_page=3`);
      
      if (!response.ok) {
        throw new Error('Erro ao carregar notícias em destaque');
      }

      const data = await response.json();
      setFeaturedNews(data.news || []);
    } catch (error) {
      console.error('Erro ao carregar notícias em destaque:', error);
    }
  };

  useEffect(() => {
    fetchNews(currentPage, selectedCategory);
    if (currentPage === 1) {
      fetchFeaturedNews();
    }
  }, [currentPage, selectedCategory]);

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    });
  };

  const getCategoryIcon = (category: string) => {
    const cat = categories.find(c => c.id === category);
    return cat?.icon || '📰';
  };

  const getCategoryName = (category: string) => {
    const cat = categories.find(c => c.id === category);
    return cat?.name || 'Geral';
  };

  const truncateText = (text: string, maxLength: number = 150) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  if (isLoading && currentPage === 1) {
    return (
      <div className="min-h-screen bg-background">
        <div className="myverse-container myverse-section">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-muted-foreground">Carregando notícias...</p>
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
            <h1 className="myverse-heading-2 mb-2">Notícias</h1>
            <p className="text-muted-foreground">
              Fique por dentro das últimas novidades do mundo do entretenimento
            </p>
          </div>
          
          {user && (
            <Button 
              onClick={() => navigate('/news/create')}
              className="mt-4 md:mt-0"
            >
              <Plus className="w-4 h-4 mr-2" />
              Criar Notícia
            </Button>
          )}
        </div>

        {/* Featured News */}
        {featuredNews.length > 0 && currentPage === 1 && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold mb-6">Em Destaque</h2>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {featuredNews.map((article, index) => (
                <Card 
                  key={article.id} 
                  className={`cursor-pointer hover:shadow-lg transition-shadow ${
                    index === 0 ? 'lg:col-span-2 lg:row-span-2' : ''
                  }`}
                  onClick={() => navigate(`/news/${article.id}`)}
                >
                  {article.image_url && (
                    <div className={`aspect-video bg-muted overflow-hidden ${
                      index === 0 ? 'lg:aspect-[2/1]' : ''
                    }`}>
                      <img
                        src={article.image_url}
                        alt={article.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  <CardContent className="p-6">
                    <div className="flex items-center gap-2 mb-3">
                      <Badge variant="secondary">
                        {getCategoryIcon(article.category)} {getCategoryName(article.category)}
                      </Badge>
                      <Badge variant="outline">Destaque</Badge>
                    </div>
                    
                    <h3 className={`font-bold mb-3 hover:text-primary transition-colors ${
                      index === 0 ? 'text-xl lg:text-2xl' : 'text-lg'
                    }`}>
                      {article.title}
                    </h3>
                    
                    {article.summary && (
                      <p className="text-muted-foreground text-sm mb-4">
                        {truncateText(article.summary, index === 0 ? 200 : 100)}
                      </p>
                    )}
                    
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <User className="w-4 h-4" />
                        <span>{article.author.username}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        <span>{formatDate(article.published_at)}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Category Filter */}
        <div className="flex flex-wrap gap-2 mb-8">
          {categories.map((category) => (
            <Button
              key={category.id}
              variant={selectedCategory === category.id ? 'default' : 'outline'}
              size="sm"
              onClick={() => handleCategoryChange(category.id)}
            >
              <span className="mr-1">{category.icon}</span>
              {category.name}
            </Button>
          ))}
        </div>

        {/* News Grid */}
        {news.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <div className="text-6xl mb-4">📰</div>
              <h3 className="text-lg font-semibold mb-2">Nenhuma notícia encontrada</h3>
              <p className="text-muted-foreground mb-4">
                {selectedCategory === 'all' 
                  ? 'Ainda não há notícias publicadas'
                  : `Não há notícias na categoria ${getCategoryName(selectedCategory)}`
                }
              </p>
              {user && (
                <Button onClick={() => navigate('/news/create')}>
                  <Plus className="w-4 h-4 mr-2" />
                  Criar Primeira Notícia
                </Button>
              )}
            </CardContent>
          </Card>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {news.map((article) => (
                <Card 
                  key={article.id} 
                  className="cursor-pointer hover:shadow-lg transition-shadow"
                  onClick={() => navigate(`/news/${article.id}`)}
                >
                  {article.image_url && (
                    <div className="aspect-video bg-muted overflow-hidden">
                      <img
                        src={article.image_url}
                        alt={article.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  <CardContent className="p-6">
                    <div className="flex items-center gap-2 mb-3">
                      <Badge variant="secondary">
                        {getCategoryIcon(article.category)} {getCategoryName(article.category)}
                      </Badge>
                      {article.is_featured && (
                        <Badge variant="outline">Destaque</Badge>
                      )}
                    </div>
                    
                    <h3 className="font-bold text-lg mb-3 hover:text-primary transition-colors">
                      {article.title}
                    </h3>
                    
                    {article.summary && (
                      <p className="text-muted-foreground text-sm mb-4">
                        {truncateText(article.summary)}
                      </p>
                    )}
                    
                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1">
                          <User className="w-4 h-4" />
                          <span>{article.author.username}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          <span>{formatDate(article.published_at)}</span>
                        </div>
                      </div>
                      
                      {article.source_url && (
                        <ExternalLink className="w-4 h-4" />
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Pagination */}
            {pagination && pagination.pages > 1 && (
              <div className="flex justify-center items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={!pagination.has_prev}
                >
                  Anterior
                </Button>
                
                <div className="flex gap-1">
                  {Array.from({ length: pagination.pages }, (_, i) => i + 1).map((page) => (
                    <Button
                      key={page}
                      variant={page === currentPage ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => handlePageChange(page)}
                    >
                      {page}
                    </Button>
                  ))}
                </div>
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={!pagination.has_next}
                >
                  Próxima
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default NewsPage;

