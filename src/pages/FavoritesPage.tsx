import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { useAuth } from '../contexts/AuthContext';
import { Heart, Trash2, Film, Tv, Gamepad2, Star } from 'lucide-react';
import toast from 'react-hot-toast';

interface Favorite {
  id: number;
  content_type: string;
  content_id: string;
  title: string;
  poster_url?: string;
  created_at: string;
}

const FavoritesPage: React.FC = () => {
  const [favorites, setFavorites] = useState<Favorite[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState<string>('all');
  const { user } = useAuth();

  const fetchFavorites = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`${import.meta.env.VITE_API_URL}/content/favorites`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('myverse_token')}`
        }
      });

      if (!response.ok) {
        throw new Error('Erro ao carregar favoritos');
      }

      const data = await response.json();
      setFavorites(data.favorites || []);
    } catch (error) {
      console.error('Erro ao carregar favoritos:', error);
      toast.error('Erro ao carregar favoritos');
    } finally {
      setIsLoading(false);
    }
  };

  const removeFavorite = async (favoriteId: number) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/content/favorites/${favoriteId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('myverse_token')}`
        }
      });

      if (!response.ok) {
        throw new Error('Erro ao remover favorito');
      }

      setFavorites(prev => prev.filter(fav => fav.id !== favoriteId));
      toast.success('Removido dos favoritos');
    } catch (error) {
      console.error('Erro ao remover favorito:', error);
      toast.error('Erro ao remover favorito');
    }
  };

  useEffect(() => {
    fetchFavorites();
  }, []);

  const getIcon = (contentType: string) => {
    switch (contentType) {
      case 'movie':
        return <Film className="w-4 h-4" />;
      case 'tv':
        return <Tv className="w-4 h-4" />;
      case 'game':
        return <Gamepad2 className="w-4 h-4" />;
      default:
        return <Star className="w-4 h-4" />;
    }
  };

  const getTypeLabel = (contentType: string) => {
    switch (contentType) {
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

  const filteredFavorites = filter === 'all' 
    ? favorites 
    : favorites.filter(fav => fav.content_type === filter);

  const favoritesByType = favorites.reduce((acc, fav) => {
    acc[fav.content_type] = (acc[fav.content_type] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="myverse-container myverse-section">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-muted-foreground">Carregando favoritos...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="myverse-container myverse-section">
        <div className="mb-8">
          <h1 className="myverse-heading-2 mb-2">Meus Favoritos</h1>
          <p className="text-muted-foreground">
            Gerencie sua coleção de filmes, séries e jogos favoritos
          </p>
        </div>

        {/* Estatísticas */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Heart className="w-5 h-5 text-red-500" />
                <div>
                  <p className="text-sm font-medium">Total</p>
                  <p className="text-2xl font-bold">{favorites.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Film className="w-5 h-5 text-blue-500" />
                <div>
                  <p className="text-sm font-medium">Filmes</p>
                  <p className="text-2xl font-bold">{favoritesByType.movie || 0}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Tv className="w-5 h-5 text-green-500" />
                <div>
                  <p className="text-sm font-medium">Séries</p>
                  <p className="text-2xl font-bold">{favoritesByType.tv || 0}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Gamepad2 className="w-5 h-5 text-purple-500" />
                <div>
                  <p className="text-sm font-medium">Jogos</p>
                  <p className="text-2xl font-bold">{favoritesByType.game || 0}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filtros */}
        <div className="flex flex-wrap gap-2 mb-6">
          <Button
            variant={filter === 'all' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilter('all')}
          >
            Todos ({favorites.length})
          </Button>
          <Button
            variant={filter === 'movie' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilter('movie')}
          >
            <Film className="w-4 h-4 mr-1" />
            Filmes ({favoritesByType.movie || 0})
          </Button>
          <Button
            variant={filter === 'tv' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilter('tv')}
          >
            <Tv className="w-4 h-4 mr-1" />
            Séries ({favoritesByType.tv || 0})
          </Button>
          <Button
            variant={filter === 'game' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilter('game')}
          >
            <Gamepad2 className="w-4 h-4 mr-1" />
            Jogos ({favoritesByType.game || 0})
          </Button>
        </div>

        {/* Lista de Favoritos */}
        {filteredFavorites.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <Heart className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">
                {filter === 'all' ? 'Nenhum favorito ainda' : `Nenhum ${getTypeLabel(filter).toLowerCase()} favoritado`}
              </h3>
              <p className="text-muted-foreground mb-4">
                Comece a explorar e adicione conteúdo aos seus favoritos
              </p>
              <Button onClick={() => window.location.href = '/search'}>
                Explorar Conteúdo
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredFavorites.map((favorite) => (
              <Card key={favorite.id} className="group hover:shadow-lg transition-shadow">
                <CardContent className="p-0">
                  {/* Poster */}
                  <div className="aspect-[2/3] bg-muted rounded-t-lg overflow-hidden relative">
                    {favorite.poster_url ? (
                      <img
                        src={favorite.poster_url}
                        alt={favorite.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        {getIcon(favorite.content_type)}
                      </div>
                    )}
                    
                    {/* Remove button */}
                    <Button
                      size="sm"
                      variant="destructive"
                      className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={() => removeFavorite(favorite.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                  
                  {/* Info */}
                  <div className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <Badge variant="secondary" className="text-xs">
                        {getIcon(favorite.content_type)}
                        <span className="ml-1">{getTypeLabel(favorite.content_type)}</span>
                      </Badge>
                    </div>
                    
                    <h3 className="font-semibold text-sm mb-2 line-clamp-2">
                      {favorite.title}
                    </h3>
                    
                    <p className="text-xs text-muted-foreground">
                      Adicionado em {new Date(favorite.created_at).toLocaleDateString('pt-BR')}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default FavoritesPage;

