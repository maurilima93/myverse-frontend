import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, Star, Heart, Calendar, Play, Gamepad2, Tv, Film } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { useAuth } from '../contexts/AuthContext';
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
  const { user } = useAuth();

  const query = searchParams.get('q') || '';

  useEffect(() => {
    if (query) {
      setSearchQuery(query);
      performSearch(query);
    }
  }, [query]);

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

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setSearchParams({ q: searchQuery.trim() });
    }
  };

  const addToFavorites = async (item: SearchResult) => {
    if (!user) {
      alert('Faça login para adicionar aos favoritos');
      return;
    }

    try {
      await api.post('/user/favorites', {
        content_id: item.id,
        content_type: item.type,
        title: item.title,
        poster_url: item.poster_url,
        rating: item.rating
      });
      alert('Adicionado aos favoritos!');
    } catch (err) {
      console.error('Erro ao adicionar aos favoritos:', err);
      alert('Erro ao adicionar aos favoritos');
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
                className="imdb-input w-full pl-10 pr-4 py-3 text-lg"
                placeholder="Pesquisar filmes, séries, jogos..."
              />
            </div>
            <Button 
              type="submit" 
              className="purple-button mt-4"
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
              Resultados para "{query}" {results.length > 0 && `(${results.length} encontrados)`}
            </h2>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500"></div>
            <p className="text-gray-400 mt-4">Pesquisando conteúdo...</p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <Card className="myverse-card border-red-500/20">
            <CardContent className="pt-6">
              <div className="text-center text-red-400">
                <p>{error}</p>
                <Button 
                  onClick={() => performSearch(query)} 
                  className="mt-4 purple-button"
                >
                  Tentar Novamente
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* No Results */}
        {!loading && !error && query && results.length === 0 && (
          <Card className="myverse-card">
            <CardContent className="pt-6">
              <div className="text-center text-gray-400">
                <Search className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p className="text-lg mb-2">Nenhum resultado encontrado</p>
                <p>Tente pesquisar com termos diferentes</p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Results Grid */}
        {!loading && results.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {results.map((item) => (
              <Card key={`${item.type}-${item.id}`} className="myverse-card group hover:scale-105 transition-transform duration-200">
                <div className="relative">
                  {/* Poster Image */}
                  <div className="aspect-[2/3] relative overflow-hidden rounded-t-lg">
                    {item.poster_url ? (
                      <img
                        src={item.poster_url}
                        alt={item.title}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = '/placeholder-poster.jpg';
                        }}
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-800 flex items-center justify-center">
                        {getTypeIcon(item.type)}
                      </div>
                    )}
                    
                    {/* Type Badge */}
                    <div className="absolute top-2 left-2">
                      <Badge variant="secondary" className="bg-black/70 text-white">
                        {getTypeIcon(item.type)}
                        <span className="ml-1">{getTypeLabel(item.type)}</span>
                      </Badge>
                    </div>

                    {/* Rating */}
                    {item.rating && (
                      <div className="absolute top-2 right-2">
                        <Badge variant="secondary" className="bg-yellow-600/90 text-white">
                          <Star className="h-3 w-3 mr-1 fill-current" />
                          {item.rating.toFixed(1)}
                        </Badge>
                      </div>
                    )}

                    {/* Favorite Button */}
                    {user && (
                      <div className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button
                          size="sm"
                          variant="secondary"
                          onClick={() => addToFavorites(item)}
                          className="bg-black/70 hover:bg-black/90 text-white"
                        >
                          <Heart className="h-4 w-4" />
                        </Button>
                      </div>
                    )}
                  </div>
                </div>

                <CardContent className="p-4">
                  <CardTitle className="text-lg font-semibold text-white mb-2 line-clamp-2">
                    {item.title}
                  </CardTitle>
                  
                  {/* Release Date */}
                  {item.release_date && (
                    <div className="flex items-center text-gray-400 text-sm mb-2">
                      <Calendar className="h-4 w-4 mr-1" />
                      {formatDate(item.release_date)}
                    </div>
                  )}

                  {/* Genres/Platforms */}
                  {(item.genres || item.platforms) && (
                    <div className="flex flex-wrap gap-1 mb-3">
                      {(item.genres || item.platforms || []).slice(0, 3).map((genre, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {genre}
                        </Badge>
                      ))}
                    </div>
                  )}

                  {/* Overview */}
                  {item.overview && (
                    <CardDescription className="text-gray-400 text-sm line-clamp-3">
                      {item.overview}
                    </CardDescription>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!query && !loading && (
          <Card className="myverse-card">
            <CardContent className="pt-6">
              <div className="text-center text-gray-400">
                <Search className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p className="text-lg mb-2">Pesquise por filmes, séries e jogos</p>
                <p>Use a barra de pesquisa acima para encontrar conteúdo</p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default SearchPage;

