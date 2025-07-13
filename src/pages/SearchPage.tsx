import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, Star, Calendar, Play, Gamepad2, Tv, Film, Plus, Check } from 'lucide-react';
import { Card, CardContent, CardDescription, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'react-hot-toast';
import api from '../lib/api';

interface SearchResult {
  id: string;
  title: string;
  type: 'movie' | 'tv' | 'game';
  overview: string;
  poster_url: string;
  rating: number;
  release_date: string;
  genre_ids?: number[];
  genres?: string[];
  platforms?: string[];
}

interface SearchResponse {
  query: string;
  results: SearchResult[];
  total: number;
}

const SearchPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [favoriteIds, setFavoriteIds] = useState<Set<string>>(new Set());
  const [addingToFavorites, setAddingToFavorites] = useState<Set<string>>(new Set());
  const { user } = useAuth();

  const query = searchParams.get('q') || '';

  useEffect(() => {
    if (query) {
      setSearchQuery(query);
      performSearch(query);
    }
  }, [query]);

  useEffect(() => {
    if (user && results.length > 0) {
      checkFavorites();
    }
  }, [user, results]);

  const performSearch = async (searchTerm: string) => {
    if (!searchTerm.trim()) return;

    setLoading(true);
    setError(null);

    try {
      const response = await api.get<SearchResponse>(`/content/search?q=${encodeURIComponent(searchTerm)}`);
      setResults(response.data.results || []);
    } catch (err: any) {
      console.error('Erro na pesquisa:', err);
      setError('Erro ao buscar conteúdo. Tente novamente.');
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  const checkFavorites = async () => {
    if (!user || results.length === 0) return;

    try {
      const token = localStorage.getItem('myverse_token');
      if (!token) return;

      const favoriteChecks = await Promise.all(
        results.map(async (item) => {
          try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/content/favorites/check`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
              },
              body: JSON.stringify({
                content_id: item.id,
                content_type: item.type
              })
            });

            if (response.ok) {
              const data = await response.json();
              return { id: item.id, isFavorite: data.is_favorite };
            }
            return { id: item.id, isFavorite: false };
          } catch {
            return { id: item.id, isFavorite: false };
          }
        })
      );

      const newFavoriteIds = new Set<string>();
      favoriteChecks.forEach(({ id, isFavorite }) => {
        if (isFavorite) {
          newFavoriteIds.add(id);
        }
      });

      setFavoriteIds(newFavoriteIds);
    } catch (error) {
      console.error('Erro ao verificar favoritos:', error);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setSearchParams({ q: searchQuery.trim() });
    }
  };

  const addToFavorites = async (item: SearchResult) => {
    if (!user) {
      toast.error('Faça login para adicionar aos favoritos');
      return;
    }

    const itemKey = item.id;
    setAddingToFavorites(prev => new Set(prev).add(itemKey));

    try {
      const token = localStorage.getItem('myverse_token');
      if (!token) {
        throw new Error('Token de autenticação não encontrado');
      }

      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/content/favorites`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          content_id: item.id,
          content_type: item.type,
          title: item.title,
          poster_url: item.poster_url,
          rating: item.rating,
          release_date: item.release_date,
          overview: item.overview,
          genres: item.genres || []
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        if (response.status === 409) {
          toast.error('Item já está nos favoritos');
          setFavoriteIds(prev => new Set(prev).add(itemKey));
          return;
        }
        throw new Error(errorData.error || 'Erro ao adicionar aos favoritos');
      }

      setFavoriteIds(prev => new Set(prev).add(itemKey));
      toast.success('Adicionado aos favoritos!');
    } catch (err: any) {
      console.error('Erro ao adicionar aos favoritos:', err);
      toast.error(err.message || 'Erro ao adicionar aos favoritos');
    } finally {
      setAddingToFavorites(prev => {
        const newSet = new Set(prev);
        newSet.delete(itemKey);
        return newSet;
      });
    }
  };

  const removeFromFavorites = async (item: SearchResult) => {
    if (!user) return;

    const itemKey = item.id;
    setAddingToFavorites(prev => new Set(prev).add(itemKey));

    try {
      const token = localStorage.getItem('myverse_token');
      if (!token) {
        throw new Error('Token de autenticação não encontrado');
      }

      // Primeiro, buscar o ID do favorito
      const favoritesResponse = await fetch(`${import.meta.env.VITE_API_URL}/api/content/favorites`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!favoritesResponse.ok) {
        throw new Error('Erro ao buscar favoritos');
      }

      const favoritesData = await favoritesResponse.json();
      const favorite = favoritesData.favorites.find((fav: any) => 
        fav.content_id === item.id && fav.content_type === item.type
      );

      if (!favorite) {
        throw new Error('Favorito não encontrado');
      }

      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/content/favorites/${favorite.id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Erro ao remover dos favoritos');
      }

      setFavoriteIds(prev => {
        const newSet = new Set(prev);
        newSet.delete(itemKey);
        return newSet;
      });
      toast.success('Removido dos favoritos!');
    } catch (err: any) {
      console.error('Erro ao remover dos favoritos:', err);
      toast.error(err.message || 'Erro ao remover dos favoritos');
    } finally {
      setAddingToFavorites(prev => {
        const newSet = new Set(prev);
        newSet.delete(itemKey);
        return newSet;
      });
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'movie':
        return <Film className="h-4 w-4" />;
      case 'tv':
        return <Tv className="h-4 w-4" />;
      case 'game':
        return <Gamepad2 className="h-4 w-4" />;
      default:
        return <Play className="h-4 w-4" />;
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'movie':
        return 'Filme';
      case 'tv':
        return 'Série';
      case 'game':
        return 'Jogo';
      default:
        return 'Conteúdo';
    }
  };

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).getFullYear().toString();
    } catch {
      return dateString;
    }
  };

  const renderStars = (rating: number) => {
    const stars = Math.round(rating / 2); // Converter de 10 para 5 estrelas
    return (
      <div className="flex items-center">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            className={`h-4 w-4 ${
              i < stars ? 'text-yellow-400 fill-current' : 'text-gray-400'
            }`}
          />
        ))}
        <span className="ml-1 text-sm text-gray-400">
          {rating ? rating.toFixed(1) : 'N/A'}
        </span>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="myverse-container myverse-section">
        {/* Search Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-4">Pesquisar Conteúdo</h1>
          
          {/* Search Form */}
          <form onSubmit={handleSearch} className="relative max-w-2xl">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Pesquisar filmes, séries, jogos..."
                className="block w-full pl-10 pr-3 py-3 border border-gray-600 rounded-lg bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>
            <Button 
              type="submit" 
              className="absolute right-2 top-2 bottom-2"
              disabled={loading}
            >
              {loading ? 'Pesquisando...' : 'Pesquisar'}
            </Button>
          </form>
        </div>

        {/* Results */}
        {query && (
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-white mb-4">
              Resultados para "{query}"
            </h2>
            
            {loading && (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
                <p className="mt-4 text-gray-400">Pesquisando...</p>
              </div>
            )}

            {error && (
              <div className="text-center py-8">
                <p className="text-red-400 mb-4">{error}</p>
                <Button 
                  onClick={() => performSearch(query)}
                  variant="outline"
                >
                  Tentar Novamente
                </Button>
              </div>
            )}

            {!loading && !error && results.length === 0 && query && (
              <div className="text-center py-8">
                <p className="text-gray-400">Nenhum resultado encontrado para "{query}"</p>
              </div>
            )}

            {!loading && !error && results.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {results.map((item) => {
                  const isFavorite = favoriteIds.has(item.id);
                  const isAdding = addingToFavorites.has(item.id);
                  
                  return (
                    <Card key={`${item.type}-${item.id}`} className="bg-gray-800 border-gray-700 hover:border-primary transition-colors">
                      <CardContent className="p-4">
                        {/* Poster */}
                        <div className="relative mb-4">
                          <img
                            src={item.poster_url || '/placeholder-poster.jpg'}
                            alt={item.title}
                            className="w-full h-64 object-cover rounded-lg"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.src = '/placeholder-poster.jpg';
                            }}
                          />
                          
                          {/* Type Badge */}
                          <Badge 
                            variant="secondary" 
                            className="absolute top-2 left-2 bg-primary text-primary-foreground"
                          >
                            {getTypeIcon(item.type)}
                            <span className="ml-1">{getTypeLabel(item.type)}</span>
                          </Badge>

                          {/* Favorite Button */}
                          {user && (
                            <Button
                              size="sm"
                              variant={isFavorite ? "default" : "outline"}
                              className="absolute top-2 right-2"
                              onClick={() => isFavorite ? removeFromFavorites(item) : addToFavorites(item)}
                              disabled={isAdding}
                            >
                              {isAdding ? (
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current" />
                              ) : isFavorite ? (
                                <Check className="h-4 w-4" />
                              ) : (
                                <Plus className="h-4 w-4" />
                              )}
                            </Button>
                          )}
                        </div>

                        {/* Content */}
                        <div className="space-y-2">
                          <CardTitle className="text-white text-lg line-clamp-2">
                            {item.title}
                          </CardTitle>
                          
                          {/* Rating and Year */}
                          <div className="flex items-center justify-between">
                            {renderStars(item.rating)}
                            {item.release_date && (
                              <div className="flex items-center text-gray-400 text-sm">
                                <Calendar className="h-4 w-4 mr-1" />
                                {formatDate(item.release_date)}
                              </div>
                            )}
                          </div>

                          {/* Genres */}
                          {item.genres && item.genres.length > 0 && (
                            <div className="flex flex-wrap gap-1">
                              {item.genres.slice(0, 3).map((genre, index) => (
                                <Badge key={index} variant="outline" className="text-xs">
                                  {genre}
                                </Badge>
                              ))}
                              {item.genres.length > 3 && (
                                <Badge variant="outline" className="text-xs">
                                  +{item.genres.length - 3}
                                </Badge>
                              )}
                            </div>
                          )}

                          {/* Platforms (for games) */}
                          {item.platforms && item.platforms.length > 0 && (
                            <div className="flex flex-wrap gap-1">
                              {item.platforms.slice(0, 3).map((platform, index) => (
                                <Badge key={index} variant="outline" className="text-xs">
                                  {platform}
                                </Badge>
                              ))}
                              {item.platforms.length > 3 && (
                                <Badge variant="outline" className="text-xs">
                                  +{item.platforms.length - 3}
                                </Badge>
                              )}
                            </div>
                          )}

                          {/* Overview */}
                          {item.overview && (
                            <CardDescription className="text-gray-400 text-sm line-clamp-3">
                              {item.overview}
                            </CardDescription>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchPage;

