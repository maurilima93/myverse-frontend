import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, User, Heart, MessageCircle, Calendar, Star, Film, Tv, Gamepad2, UserMinus, UserPlus } from 'lucide-react';

interface UserProfile {
  id: number;
  username: string;
  email: string;
  created_at: string;
  total_favorites: number;
  total_posts: number;
  favorite_genres: string[];
  recent_favorites: Array<{
    id: number;
    title: string;
    type: 'movie' | 'tv' | 'game';
    poster_url?: string;
    rating?: number;
  }>;
  friendship_status: 'none' | 'pending' | 'friends' | 'sent';
  mutual_friends: number;
  common_interests: string[];
}

const FriendProfilePage: React.FC = () => {
  const { userId } = useParams<{ userId: string }>();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (userId) {
      fetchUserProfile(parseInt(userId));
    }
  }, [userId]);

  const fetchUserProfile = async (id: number) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${import.meta.env.VITE_API_URL}/users/${id}/profile`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setProfile(data.profile);
      } else {
        // Usuário não encontrado ou erro
        navigate('/friends');
      }
    } catch (error) {
      console.error('Erro ao buscar perfil:', error);
      navigate('/friends');
    } finally {
      setLoading(false);
    }
  };

  const handleSendFriendRequest = async () => {
    if (!profile) return;

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${import.meta.env.VITE_API_URL}/friends/request`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ user_id: profile.id }),
      });

      if (response.ok) {
        setProfile(prev => prev ? { ...prev, friendship_status: 'sent' } : null);
        
        // Toast de sucesso
        const toast = document.createElement('div');
        toast.className = 'fixed top-4 right-4 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg z-50';
        toast.textContent = 'Solicitação enviada!';
        document.body.appendChild(toast);
        setTimeout(() => document.body.removeChild(toast), 3000);
      }
    } catch (error) {
      console.error('Erro ao enviar solicitação:', error);
    }
  };

  const handleRemoveFriend = async () => {
    if (!profile || !confirm('Tem certeza que deseja remover este amigo?')) return;

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${import.meta.env.VITE_API_URL}/friends/${profile.id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        setProfile(prev => prev ? { ...prev, friendship_status: 'none' } : null);
        
        // Toast de sucesso
        const toast = document.createElement('div');
        toast.className = 'fixed top-4 right-4 bg-orange-500 text-white px-4 py-2 rounded-lg shadow-lg z-50';
        toast.textContent = 'Amigo removido';
        document.body.appendChild(toast);
        setTimeout(() => document.body.removeChild(toast), 3000);
      }
    } catch (error) {
      console.error('Erro ao remover amigo:', error);
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'movie': return <Film className="h-4 w-4" />;
      case 'tv': return <Tv className="h-4 w-4" />;
      case 'game': return <Gamepad2 className="h-4 w-4" />;
      default: return <Heart className="h-4 w-4" />;
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'movie': return 'Filme';
      case 'tv': return 'Série';
      case 'game': return 'Jogo';
      default: return 'Conteúdo';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto mb-4"></div>
          <p>Carregando perfil...</p>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <div className="text-center">
          <User className="h-16 w-16 text-gray-600 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-400 mb-2">Perfil não encontrado</h3>
          <button
            onClick={() => navigate('/friends')}
            className="bg-purple-600 hover:bg-purple-700 px-6 py-2 rounded-lg transition-colors"
          >
            Voltar aos Amigos
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={() => navigate('/friends')}
            className="flex items-center space-x-2 text-gray-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
            <span>Voltar aos Amigos</span>
          </button>
        </div>

        {/* Profile Header */}
        <div className="bg-gray-800 rounded-lg p-8 mb-8">
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-6">
              <div className="w-20 h-20 bg-purple-600 rounded-full flex items-center justify-center">
                <User className="h-10 w-10" />
              </div>
              <div>
                <h1 className="text-3xl font-bold mb-2">{profile.username}</h1>
                <p className="text-gray-400 mb-4">{profile.email}</p>
                <div className="flex items-center space-x-6 text-sm text-gray-400">
                  <div className="flex items-center space-x-1">
                    <Calendar className="h-4 w-4" />
                    <span>Membro desde {new Date(profile.created_at).toLocaleDateString('pt-BR')}</span>
                  </div>
                  {profile.mutual_friends > 0 && (
                    <div className="flex items-center space-x-1">
                      <User className="h-4 w-4" />
                      <span>{profile.mutual_friends} amigos em comum</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="flex flex-col space-y-2">
              {profile.friendship_status === 'friends' ? (
                <button
                  onClick={handleRemoveFriend}
                  className="flex items-center space-x-2 bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg transition-colors"
                >
                  <UserMinus className="h-4 w-4" />
                  <span>Remover Amigo</span>
                </button>
              ) : profile.friendship_status === 'sent' ? (
                <span className="flex items-center space-x-2 bg-yellow-600 px-4 py-2 rounded-lg">
                  <span>Solicitação enviada</span>
                </span>
              ) : profile.friendship_status === 'pending' ? (
                <span className="flex items-center space-x-2 bg-blue-600 px-4 py-2 rounded-lg">
                  <span>Solicitação recebida</span>
                </span>
              ) : (
                <button
                  onClick={handleSendFriendRequest}
                  className="flex items-center space-x-2 bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded-lg transition-colors"
                >
                  <UserPlus className="h-4 w-4" />
                  <span>Adicionar Amigo</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-gray-800 rounded-lg p-6 text-center">
            <Heart className="h-8 w-8 text-purple-500 mx-auto mb-2" />
            <div className="text-2xl font-bold text-white">{profile.total_favorites}</div>
            <div className="text-gray-400">Favoritos</div>
          </div>
          <div className="bg-gray-800 rounded-lg p-6 text-center">
            <MessageCircle className="h-8 w-8 text-blue-500 mx-auto mb-2" />
            <div className="text-2xl font-bold text-white">{profile.total_posts}</div>
            <div className="text-gray-400">Posts no Fórum</div>
          </div>
          <div className="bg-gray-800 rounded-lg p-6 text-center">
            <Star className="h-8 w-8 text-yellow-500 mx-auto mb-2" />
            <div className="text-2xl font-bold text-white">{profile.favorite_genres.length}</div>
            <div className="text-gray-400">Gêneros Favoritos</div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Interesses em Comum */}
          {profile.common_interests.length > 0 && (
            <div className="bg-gray-800 rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-4 flex items-center space-x-2">
                <Star className="h-5 w-5 text-purple-500" />
                <span>Interesses em Comum</span>
              </h2>
              <div className="flex flex-wrap gap-2">
                {profile.common_interests.map((interest, index) => (
                  <span
                    key={index}
                    className="bg-purple-600/20 text-purple-300 px-3 py-1 rounded-full text-sm"
                  >
                    {interest}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Gêneros Favoritos */}
          {profile.favorite_genres.length > 0 && (
            <div className="bg-gray-800 rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-4 flex items-center space-x-2">
                <Heart className="h-5 w-5 text-red-500" />
                <span>Gêneros Favoritos</span>
              </h2>
              <div className="flex flex-wrap gap-2">
                {profile.favorite_genres.map((genre, index) => (
                  <span
                    key={index}
                    className="bg-gray-700 text-gray-300 px-3 py-1 rounded-full text-sm"
                  >
                    {genre}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Favoritos Recentes */}
        {profile.recent_favorites.length > 0 && (
          <div className="bg-gray-800 rounded-lg p-6 mt-8">
            <h2 className="text-xl font-semibold mb-6 flex items-center space-x-2">
              <Heart className="h-5 w-5 text-red-500" />
              <span>Favoritos Recentes</span>
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {profile.recent_favorites.map((favorite) => (
                <div key={favorite.id} className="group">
                  <div className="aspect-[2/3] bg-gray-700 rounded-lg overflow-hidden mb-2">
                    {favorite.poster_url ? (
                      <img
                        src={favorite.poster_url}
                        alt={favorite.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        {getTypeIcon(favorite.type)}
                      </div>
                    )}
                  </div>
                  <div className="text-sm">
                    <div className="flex items-center space-x-1 text-gray-400 mb-1">
                      {getTypeIcon(favorite.type)}
                      <span className="text-xs">{getTypeLabel(favorite.type)}</span>
                    </div>
                    <h3 className="font-medium text-white truncate">{favorite.title}</h3>
                    {favorite.rating && (
                      <div className="flex items-center space-x-1 mt-1">
                        <Star className="h-3 w-3 text-yellow-500" />
                        <span className="text-xs text-gray-400">{favorite.rating.toFixed(1)}</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FriendProfilePage;

