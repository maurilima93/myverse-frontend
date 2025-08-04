import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, UserPlus, Check, X, MessageCircle, User } from 'lucide-react';

interface Friend {
  id: number;
  username: string;
  email: string;
  created_at: string;
  mutual_friends?: number;
  common_interests?: string[];
}

interface FriendRequest {
  id: number;
  sender_id: number;
  sender_username: string;
  sender_email: string;
  created_at: string;
  status: 'pending' | 'accepted' | 'rejected';
}

const FriendsPage: React.FC = () => {
  const navigate = useNavigate();
  const [friends, setFriends] = useState<Friend[]>([]);
  const [friendRequests, setFriendRequests] = useState<FriendRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'friends' | 'requests'>('friends');

  useEffect(() => {
    fetchFriends();
    fetchFriendRequests();
  }, []);

  const fetchFriends = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${import.meta.env.VITE_API_URL}/friends`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setFriends(data.friends || []);
      }
    } catch (error) {
      console.error('Erro ao buscar amigos:', error);
    }
  };

  const fetchFriendRequests = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${import.meta.env.VITE_API_URL}/friends/requests`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setFriendRequests(data.requests || []);
      }
    } catch (error) {
      console.error('Erro ao buscar solicitações:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAcceptRequest = async (requestId: number) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${import.meta.env.VITE_API_URL}/friends/requests/${requestId}/accept`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        // Atualizar listas
        fetchFriends();
        fetchFriendRequests();
        // Toast de sucesso
        const toast = document.createElement('div');
        toast.className = 'fixed top-4 right-4 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg z-50';
        toast.textContent = 'Solicitação aceita!';
        document.body.appendChild(toast);
        setTimeout(() => document.body.removeChild(toast), 3000);
      }
    } catch (error) {
      console.error('Erro ao aceitar solicitação:', error);
    }
  };

  const handleRejectRequest = async (requestId: number) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${import.meta.env.VITE_API_URL}/friends/requests/${requestId}/reject`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        fetchFriendRequests();
        // Toast de sucesso
        const toast = document.createElement('div');
        toast.className = 'fixed top-4 right-4 bg-red-500 text-white px-4 py-2 rounded-lg shadow-lg z-50';
        toast.textContent = 'Solicitação rejeitada';
        document.body.appendChild(toast);
        setTimeout(() => document.body.removeChild(toast), 3000);
      }
    } catch (error) {
      console.error('Erro ao rejeitar solicitação:', error);
    }
  };

  const handleRemoveFriend = async (friendId: number) => {
    if (!confirm('Tem certeza que deseja remover este amigo?')) return;

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${import.meta.env.VITE_API_URL}/friends/${friendId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        fetchFriends();
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto mb-4"></div>
          <p>Carregando amigos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-3">
            <Users className="h-8 w-8 text-purple-500" />
            <h1 className="text-3xl font-bold">Meus Amigos</h1>
          </div>
          <button
            onClick={() => navigate('/add-friends')}
            className="flex items-center space-x-2 bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded-lg transition-colors"
          >
            <UserPlus className="h-5 w-5" />
            <span>Adicionar Amigos</span>
          </button>
        </div>

        {/* Tabs */}
        <div className="flex space-x-1 mb-6">
          <button
            onClick={() => setActiveTab('friends')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              activeTab === 'friends'
                ? 'bg-purple-600 text-white'
                : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
            }`}
          >
            Amigos ({friends.length})
          </button>
          <button
            onClick={() => setActiveTab('requests')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors relative ${
              activeTab === 'requests'
                ? 'bg-purple-600 text-white'
                : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
            }`}
          >
            Solicitações ({friendRequests.length})
            {friendRequests.length > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                {friendRequests.length}
              </span>
            )}
          </button>
        </div>

        {/* Content */}
        {activeTab === 'friends' ? (
          <div className="space-y-4">
            {friends.length === 0 ? (
              <div className="text-center py-12">
                <Users className="h-16 w-16 text-gray-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-400 mb-2">Nenhum amigo ainda</h3>
                <p className="text-gray-500 mb-4">Comece adicionando pessoas com gostos similares!</p>
                <button
                  onClick={() => navigate('/add-friends')}
                  className="bg-purple-600 hover:bg-purple-700 px-6 py-2 rounded-lg transition-colors"
                >
                  Buscar Amigos
                </button>
              </div>
            ) : (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {friends.map((friend) => (
                  <div key={friend.id} className="bg-gray-800 rounded-lg p-6 hover:bg-gray-750 transition-colors">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center">
                          <User className="h-6 w-6" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-lg">{friend.username}</h3>
                          <p className="text-gray-400 text-sm">{friend.email}</p>
                        </div>
                      </div>
                    </div>

                    {friend.common_interests && friend.common_interests.length > 0 && (
                      <div className="mb-4">
                        <p className="text-sm text-gray-400 mb-2">Interesses em comum:</p>
                        <div className="flex flex-wrap gap-1">
                          {friend.common_interests.slice(0, 3).map((interest, index) => (
                            <span
                              key={index}
                              className="bg-purple-600/20 text-purple-300 px-2 py-1 rounded text-xs"
                            >
                              {interest}
                            </span>
                          ))}
                          {friend.common_interests.length > 3 && (
                            <span className="text-gray-400 text-xs">
                              +{friend.common_interests.length - 3} mais
                            </span>
                          )}
                        </div>
                      </div>
                    )}

                    <div className="flex space-x-2">
                      <button
                        onClick={() => navigate(`/profile/${friend.id}`)}
                        className="flex-1 bg-purple-600 hover:bg-purple-700 px-3 py-2 rounded text-sm transition-colors"
                      >
                        Ver Perfil
                      </button>
                      <button
                        onClick={() => handleRemoveFriend(friend.id)}
                        className="px-3 py-2 bg-gray-700 hover:bg-red-600 rounded text-sm transition-colors"
                      >
                        Remover
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {friendRequests.length === 0 ? (
              <div className="text-center py-12">
                <MessageCircle className="h-16 w-16 text-gray-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-400 mb-2">Nenhuma solicitação</h3>
                <p className="text-gray-500">Você não tem solicitações de amizade pendentes.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {friendRequests.map((request) => (
                  <div key={request.id} className="bg-gray-800 rounded-lg p-6 flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center">
                        <User className="h-6 w-6" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg">{request.sender_username}</h3>
                        <p className="text-gray-400 text-sm">{request.sender_email}</p>
                        <p className="text-gray-500 text-xs">
                          Enviado em {new Date(request.created_at).toLocaleDateString('pt-BR')}
                        </p>
                      </div>
                    </div>

                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleAcceptRequest(request.id)}
                        className="flex items-center space-x-1 bg-green-600 hover:bg-green-700 px-4 py-2 rounded transition-colors"
                      >
                        <Check className="h-4 w-4" />
                        <span>Aceitar</span>
                      </button>
                      <button
                        onClick={() => handleRejectRequest(request.id)}
                        className="flex items-center space-x-1 bg-red-600 hover:bg-red-700 px-4 py-2 rounded transition-colors"
                      >
                        <X className="h-4 w-4" />
                        <span>Rejeitar</span>
                      </button>
                    </div>
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

export default FriendsPage;

