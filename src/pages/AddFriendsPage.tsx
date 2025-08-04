import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, UserPlus, User, Heart, Star, Users, ArrowLeft } from 'lucide-react';

interface User {
  id: number;
  username: string;
  email: string;
  created_at: string;
  favorite_genres?: string[];
  total_favorites?: number;
  mutual_friends?: number;
  friendship_status?: 'none' | 'pending' | 'friends';
}

interface Suggestion {
  id: number;
  username: string;
  email: string;
  common_interests: string[];
  mutual_friends: number;
  compatibility_score: number;
}

const AddFriendsPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<User[]>([]);
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [loading, setLoading] = useState(false);
  const [suggestionsLoading, setSuggestionsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'search' | 'suggestions'>('suggestions');

  useEffect(() => {
    fetchSuggestions();
  }, []);

  const fetchSuggestions = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${import.meta.env.VITE_API_URL}/friends/suggestions`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setSuggestions(data.suggestions || []);
      }
    } catch (error) {
      console.error('Erro ao buscar sugestões:', error);
    } finally {
      setSuggestionsLoading(false);
    }
  };

  const handleSearch = async () => {
    if (!searchTerm.trim()) return;

    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${import.meta.env.VITE_API_URL}/friends/search?q=${encodeURIComponent(searchTerm)}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setSearchResults(data.users || []);
      }
    } catch (error) {
      console.error('Erro ao buscar usuários:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSendFriendRequest = async (userId: number) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${import.meta.env.VITE_API_URL}/friends/request`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ user_id: userId }),
      });

      if (response.ok) {
        // Atualizar status do usuário
        setSearchResults(prev => prev.map(user => 
          user.id === userId ? { ...user, friendship_status: 'pending' } : user
        ));
        setSuggestions(prev => prev.filter(suggestion => suggestion.id !== userId));

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

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const getCompatibilityColor = (score: number) => {
    if (score >= 80) return 'text-green-400';
    if (score >= 60) return 'text-yellow-400';
    return 'text-orange-400';
  };

  const getCompatibilityText = (score: number) => {
    if (score >= 80) return 'Alta compatibilidade';
    if (score >= 60) return 'Boa compatibilidade';
    return 'Compatibilidade moderada';
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-3">
            <button
              onClick={() => navigate('/friends')}
              className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
            >
              <ArrowLeft className="h-6 w-6" />
            </button>
            <UserPlus className="h-8 w-8 text-purple-500" />
            <h1 className="text-3xl font-bold">Adicionar Amigos</h1>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex space-x-1 mb-6">
          <button
            onClick={() => setActiveTab('suggestions')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              activeTab === 'suggestions'
                ? 'bg-purple-600 text-white'
                : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
            }`}
          >
            Sugestões ({suggestions.length})
          </button>
          <button
            onClick={() => setActiveTab('search')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              activeTab === 'search'
                ? 'bg-purple-600 text-white'
                : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
            }`}
          >
            Buscar Usuários
          </button>
        </div>

        {/* Content */}
        {activeTab === 'search' ? (
          <div>
            {/* Search Bar */}
            <div className="flex space-x-4 mb-8">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Buscar por nome de usuário ou email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="w-full pl-10 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-purple-500 text-white"
                />
              </div>
              <button
                onClick={handleSearch}
                disabled={loading || !searchTerm.trim()}
                className="px-6 py-3 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-700 disabled:cursor-not-allowed rounded-lg transition-colors"
              >
                {loading ? 'Buscando...' : 'Buscar'}
              </button>
            </div>

            {/* Search Results */}
            <div className="space-y-4">
              {searchResults.length === 0 && !loading && searchTerm && (
                <div className="text-center py-12">
                  <Search className="h-16 w-16 text-gray-600 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-400 mb-2">Nenhum usuário encontrado</h3>
                  <p className="text-gray-500">Tente buscar por outro nome ou email.</p>
                </div>
              )}

              {searchResults.map((user) => (
                <div key={user.id} className="bg-gray-800 rounded-lg p-6 flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center">
                      <User className="h-6 w-6" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">{user.username}</h3>
                      <p className="text-gray-400 text-sm">{user.email}</p>
                      <div className="flex items-center space-x-4 mt-1">
                        {user.total_favorites && (
                          <div className="flex items-center space-x-1 text-xs text-gray-500">
                            <Heart className="h-3 w-3" />
                            <span>{user.total_favorites} favoritos</span>
                          </div>
                        )}
                        {user.mutual_friends && user.mutual_friends > 0 && (
                          <div className="flex items-center space-x-1 text-xs text-gray-500">
                            <Users className="h-3 w-3" />
                            <span>{user.mutual_friends} amigos em comum</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    {user.favorite_genres && user.favorite_genres.length > 0 && (
                      <div className="hidden md:flex flex-wrap gap-1 max-w-xs">
                        {user.favorite_genres.slice(0, 3).map((genre, index) => (
                          <span
                            key={index}
                            className="bg-purple-600/20 text-purple-300 px-2 py-1 rounded text-xs"
                          >
                            {genre}
                          </span>
                        ))}
                      </div>
                    )}

                    {user.friendship_status === 'friends' ? (
                      <span className="text-green-400 text-sm font-medium">Já são amigos</span>
                    ) : user.friendship_status === 'pending' ? (
                      <span className="text-yellow-400 text-sm font-medium">Solicitação enviada</span>
                    ) : (
                      <button
                        onClick={() => handleSendFriendRequest(user.id)}
                        className="flex items-center space-x-2 bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded-lg transition-colors"
                      >
                        <UserPlus className="h-4 w-4" />
                        <span>Adicionar</span>
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {suggestionsLoading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto mb-4"></div>
                <p>Buscando pessoas com gostos similares...</p>
              </div>
            ) : suggestions.length === 0 ? (
              <div className="text-center py-12">
                <Users className="h-16 w-16 text-gray-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-400 mb-2">Nenhuma sugestão disponível</h3>
                <p className="text-gray-500 mb-4">
                  Adicione mais filmes, séries e jogos aos seus favoritos para receber sugestões personalizadas!
                </p>
                <button
                  onClick={() => navigate('/search')}
                  className="bg-purple-600 hover:bg-purple-700 px-6 py-2 rounded-lg transition-colors"
                >
                  Explorar Conteúdo
                </button>
              </div>
            ) : (
              <div className="grid gap-4 md:grid-cols-2">
                {suggestions.map((suggestion) => (
                  <div key={suggestion.id} className="bg-gray-800 rounded-lg p-6 hover:bg-gray-750 transition-colors">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center">
                          <User className="h-6 w-6" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-lg">{suggestion.username}</h3>
                          <p className="text-gray-400 text-sm">{suggestion.email}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className={`flex items-center space-x-1 ${getCompatibilityColor(suggestion.compatibility_score)}`}>
                          <Star className="h-4 w-4" />
                          <span className="font-semibold">{suggestion.compatibility_score}%</span>
                        </div>
                        <p className={`text-xs ${getCompatibilityColor(suggestion.compatibility_score)}`}>
                          {getCompatibilityText(suggestion.compatibility_score)}
                        </p>
                      </div>
                    </div>

                    {suggestion.common_interests.length > 0 && (
                      <div className="mb-4">
                        <p className="text-sm text-gray-400 mb-2">Interesses em comum:</p>
                        <div className="flex flex-wrap gap-1">
                          {suggestion.common_interests.slice(0, 4).map((interest, index) => (
                            <span
                              key={index}
                              className="bg-purple-600/20 text-purple-300 px-2 py-1 rounded text-xs"
                            >
                              {interest}
                            </span>
                          ))}
                          {suggestion.common_interests.length > 4 && (
                            <span className="text-gray-400 text-xs">
                              +{suggestion.common_interests.length - 4} mais
                            </span>
                          )}
                        </div>
                      </div>
                    )}

                    {suggestion.mutual_friends > 0 && (
                      <div className="mb-4">
                        <div className="flex items-center space-x-1 text-sm text-gray-400">
                          <Users className="h-4 w-4" />
                          <span>{suggestion.mutual_friends} amigos em comum</span>
                        </div>
                      </div>
                    )}

                    <button
                      onClick={() => handleSendFriendRequest(suggestion.id)}
                      className="w-full flex items-center justify-center space-x-2 bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded-lg transition-colors"
                    >
                      <UserPlus className="h-4 w-4" />
                      <span>Enviar Solicitação</span>
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AddFriendsPage;

