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
            const response = await fetch(`${import.meta.env.VITE_API_URL}/content/favorites/check`, {
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

      const response = await fetch(`${import.meta.env.VITE_API_URL}/content/favorites`, {
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
      const favoritesResponse = await fetch(`${import.meta.env.VITE_API_URL}/content/favorites`, {
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

      // Remover o favorito
      const deleteResponse = await fetch(`${import.meta.env.VITE_API_URL}/content/favorites/${favorite.id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!deleteResponse.ok) {
        throw new Error('Erro ao remover dos favoritos');
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
        return <Film className="w-4 h-4" />;
      case 'tv':
        return <Tv className="w-4 h-4" />;
      case 'game':
        return <Gamepad2 className="w-4 h-4" />;
      default:
        return <Play className="w-4 h-4" />;
    }
  };

  const getTypeBadgeColor = (type: string) => {
    switch (type) {
      case 'movie':
        return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'tv':
        return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'game':
        return 'bg-purple-500/20 text-purple-400 border-purple-500/30';
      default:
        return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
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
        return type;
    }
  };

  const formatRating = (rating: number) => {
    return rating ? rating.toFixed(1) : 'N/A';
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return 'N/A';
    try {
      return new Date(dateString).getFullYear().toString();
    } catch {
      return 'N/A';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 text-white">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-500 mx-auto mb-4"></div>
              <p className="text-gray-400">Pesquisando...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-6">Pesquisar Conteúdo</h1>
          
          <form onSubmit={handleSearch} className="flex gap-4 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Pesquisar filmes, séries, jogos..."
                className="w-full pl-10 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
              />
            </div>
            <Button type="submit" className="bg-yellow-500 hover:bg-yellow-600 text-black px-6">
              Pesquisar
            </Button>
          </form>
        </div>

        {error && (
          <div className="bg-red-500/20 border border-red-500/30 text-red-400 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        {query && (
          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-4">
              Resultados para "{query}" ({results.length} encontrados)
            </h2>
          </div>
        )}

        {results.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {results.map((item) => {
              const isFavorite = favoriteIds.has(item.id);
              const isAdding = addingToFavorites.has(item.id);

              return (
                <Card key={`${item.type}-${item.id}`} className="bg-gray-800 border-gray-700 hover:border-gray-600 transition-colors">
                  <div className="relative">
                    {item.poster_url ? (
                      <img
                        src={item.poster_url}
                        alt={item.title}
                        className="w-full h-64 object-cover rounded-t-lg"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = '/placeholder-poster.jpg';
                        }}
                      />
                    ) : (
                      <div className="w-full h-64 bg-gray-700 rounded-t-lg flex items-center justify-center">
                        {getTypeIcon(item.type)}
                      </div>
                    )}
                    
                    <div className="absolute top-2 left-2">
                      <Badge className={`${getTypeBadgeColor(item.type)} border`}>
                        <span className="flex items-center gap-1">
                          {getTypeIcon(item.type)}
                          {getTypeLabel(item.type)}
                        </span>
                      </Badge>
                    </div>

                    {user && (
                      <div className="absolute top-2 right-2">
                        <Button
                          size="sm"
                          variant={isFavorite ? "default" : "outline"}
                          onClick={() => isFavorite ? removeFromFavorites(item) : addToFavorites(item)}
                          disabled={isAdding}
                          className={`w-8 h-8 p-0 ${
                            isFavorite 
                              ? 'bg-yellow-500 hover:bg-yellow-600 text-black' 
                              : 'bg-gray-800/80 hover:bg-gray-700 border-gray-600'
                          }`}
                        >
                          {isAdding ? (
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current"></div>
                          ) : isFavorite ? (
                            <Check className="w-4 h-4" />
                          ) : (
                            <Plus className="w-4 h-4" />
                          )}
                        </Button>
                      </div>
                    )}
                  </div>

                  <CardContent className="p-4">
                    <CardTitle className="text-lg mb-2 line-clamp-2">{item.title}</CardTitle>
                    
                    <div className="flex items-center gap-4 mb-3 text-sm text-gray-400">
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 text-yellow-500" />
                        <span>{formatRating(item.rating)}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        <span>{formatDate(item.release_date)}</span>
                      </div>
                    </div>

                    {item.genres && item.genres.length > 0 && (
                      <div className="flex flex-wrap gap-1 mb-3">
                        {item.genres.slice(0, 3).map((genre, index) => (
                          <Badge key={index} variant="outline" className="text-xs border-gray-600 text-gray-300">
                            {genre}
                          </Badge>
                        ))}
                        {item.genres.length > 3 && (
                          <Badge variant="outline" className="text-xs border-gray-600 text-gray-300">
                            +{item.genres.length - 3}
                          </Badge>
                        )}
                      </div>
                    )}

                    {item.platforms && item.platforms.length > 0 && (
                      <div className="flex flex-wrap gap-1 mb-3">
                        {item.platforms.slice(0, 2).map((platform, index) => (
                          <Badge key={index} variant="outline" className="text-xs border-purple-600 text-purple-300">
                            {platform}
                          </Badge>
                        ))}
                        {item.platforms.length > 2 && (
                          <Badge variant="outline" className="text-xs border-purple-600 text-purple-300">
                            +{item.platforms.length - 2}
                          </Badge>
                        )}
                      </div>
                    )}

                    <CardDescription className="text-gray-400 text-sm line-clamp-3">
                      {item.overview || 'Sem descrição disponível.'}
                    </CardDescription>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        ) : query && !loading ? (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <Search className="w-16 h-16 mx-auto mb-4 opacity-50" />
              <p className="text-lg">Nenhum resultado encontrado para "{query}"</p>
              <p className="text-sm">Tente pesquisar com termos diferentes</p>
            </div>
          </div>
        ) : !query ? (
          <div className="text-center py-12">
            <div className="text-gray-400">
              <Search className="w-16 h-16 mx-auto mb-4 opacity-50" />
              <p className="text-lg">Digite algo para pesquisar</p>
              <p className="text-sm">Encontre filmes, séries e jogos</p>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default SearchPage;

