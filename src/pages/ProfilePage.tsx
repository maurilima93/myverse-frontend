import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  User, 
  Heart, 
  MessageCircle, 
  Calendar, 
  Star, 
  Film, 
  Tv, 
  Gamepad2, 
  Users, 
  TrendingUp,
  Award,
  Target,
  BarChart3,
  PieChart,
  Activity
} from 'lucide-react';
import { PieChart as RechartsPieChart, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, LineChart, Line } from 'recharts';

interface UserStats {
  id: number;
  username: string;
  email: string;
  created_at: string;
  total_favorites: number;
  total_posts: number;
  total_friends: number;
  favorite_genres: string[];
  monthly_activity: Array<{
    month: string;
    favorites: number;
    posts: number;
  }>;
  content_distribution: Array<{
    type: string;
    count: number;
    percentage: number;
  }>;
  genre_preferences: Array<{
    genre: string;
    count: number;
  }>;
  recent_favorites: Array<{
    id: number;
    title: string;
    type: 'movie' | 'tv' | 'game';
    poster_url?: string;
    rating?: number;
    added_at: string;
  }>;
  achievements: Array<{
    id: string;
    title: string;
    description: string;
    icon: string;
    unlocked_at: string;
  }>;
  compatibility_scores: Array<{
    friend_username: string;
    score: number;
  }>;
}

const ProfilePage: React.FC = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState<UserStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'activity' | 'favorites' | 'achievements'>('overview');

  useEffect(() => {
    fetchUserStats();
  }, []);

  const fetchUserStats = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${import.meta.env.VITE_API_URL}/users/profile/stats`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setStats(data.stats);
      }
    } catch (error) {
      console.error('Erro ao buscar estatísticas:', error);
    } finally {
      setLoading(false);
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
      case 'movie': return 'Filmes';
      case 'tv': return 'Séries';
      case 'game': return 'Jogos';
      default: return 'Conteúdo';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'movie': return '#8B5CF6'; // Purple
      case 'tv': return '#06B6D4'; // Cyan
      case 'game': return '#10B981'; // Green
      default: return '#6B7280'; // Gray
    }
  };

  const getAchievementIcon = (iconName: string) => {
    switch (iconName) {
      case 'star': return <Star className="h-6 w-6" />;
      case 'heart': return <Heart className="h-6 w-6" />;
      case 'users': return <Users className="h-6 w-6" />;
      case 'award': return <Award className="h-6 w-6" />;
      case 'target': return <Target className="h-6 w-6" />;
      default: return <Award className="h-6 w-6" />;
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

  if (!stats) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <div className="text-center">
          <User className="h-16 w-16 text-gray-600 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-400 mb-2">Erro ao carregar perfil</h3>
          <button
            onClick={() => navigate('/dashboard')}
            className="bg-purple-600 hover:bg-purple-700 px-6 py-2 rounded-lg transition-colors"
          >
            Voltar ao Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-8">
        {/* Profile Header */}
        <div className="bg-gray-800 rounded-lg p-8 mb-8">
          <div className="flex items-center space-x-6 mb-6">
            <div className="w-24 h-24 bg-purple-600 rounded-full flex items-center justify-center">
              <User className="h-12 w-12" />
            </div>
            <div>
              <h1 className="text-4xl font-bold mb-2">{stats.username}</h1>
              <p className="text-gray-400 mb-4">{stats.email}</p>
              <div className="flex items-center space-x-6 text-sm text-gray-400">
                <div className="flex items-center space-x-1">
                  <Calendar className="h-4 w-4" />
                  <span>Membro desde {new Date(stats.created_at).toLocaleDateString('pt-BR')}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="flex items-center justify-center mb-2">
                <Heart className="h-6 w-6 text-red-500" />
              </div>
              <div className="text-2xl font-bold text-white">{stats.total_favorites}</div>
              <div className="text-gray-400 text-sm">Favoritos</div>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center mb-2">
                <MessageCircle className="h-6 w-6 text-blue-500" />
              </div>
              <div className="text-2xl font-bold text-white">{stats.total_posts}</div>
              <div className="text-gray-400 text-sm">Posts</div>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center mb-2">
                <Users className="h-6 w-6 text-green-500" />
              </div>
              <div className="text-2xl font-bold text-white">{stats.total_friends}</div>
              <div className="text-gray-400 text-sm">Amigos</div>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center mb-2">
                <Star className="h-6 w-6 text-yellow-500" />
              </div>
              <div className="text-2xl font-bold text-white">{stats.favorite_genres.length}</div>
              <div className="text-gray-400 text-sm">Gêneros</div>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex space-x-1 mb-8">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              activeTab === 'overview'
                ? 'bg-purple-600 text-white'
                : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
            }`}
          >
            Visão Geral
          </button>
          <button
            onClick={() => setActiveTab('activity')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              activeTab === 'activity'
                ? 'bg-purple-600 text-white'
                : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
            }`}
          >
            Atividade
          </button>
          <button
            onClick={() => setActiveTab('favorites')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              activeTab === 'favorites'
                ? 'bg-purple-600 text-white'
                : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
            }`}
          >
            Favoritos
          </button>
          <button
            onClick={() => setActiveTab('achievements')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              activeTab === 'achievements'
                ? 'bg-purple-600 text-white'
                : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
            }`}
          >
            Conquistas
          </button>
        </div>

        {/* Tab Content */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Content Distribution */}
            <div className="bg-gray-800 rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-4 flex items-center space-x-2">
                <PieChart className="h-5 w-5 text-purple-500" />
                <span>Distribuição de Conteúdo</span>
              </h2>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <RechartsPieChart>
                    <Pie
                      data={stats.content_distribution}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      dataKey="count"
                      label={({ type, percentage }) => `${getTypeLabel(type)}: ${percentage}%`}
                    >
                      {stats.content_distribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={getTypeColor(entry.type)} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </RechartsPieChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Top Genres */}
            <div className="bg-gray-800 rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-4 flex items-center space-x-2">
                <BarChart3 className="h-5 w-5 text-purple-500" />
                <span>Gêneros Favoritos</span>
              </h2>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={stats.genre_preferences.slice(0, 8)}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis 
                      dataKey="genre" 
                      stroke="#9CA3AF"
                      fontSize={12}
                      angle={-45}
                      textAnchor="end"
                      height={80}
                    />
                    <YAxis stroke="#9CA3AF" />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: '#1F2937', 
                        border: '1px solid #374151',
                        borderRadius: '8px'
                      }}
                    />
                    <Bar dataKey="count" fill="#8B5CF6" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Compatibility with Friends */}
            {stats.compatibility_scores.length > 0 && (
              <div className="bg-gray-800 rounded-lg p-6">
                <h2 className="text-xl font-semibold mb-4 flex items-center space-x-2">
                  <TrendingUp className="h-5 w-5 text-purple-500" />
                  <span>Compatibilidade com Amigos</span>
                </h2>
                <div className="space-y-3">
                  {stats.compatibility_scores.slice(0, 5).map((score, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <span className="text-gray-300">{score.friend_username}</span>
                      <div className="flex items-center space-x-2">
                        <div className="w-24 bg-gray-700 rounded-full h-2">
                          <div 
                            className="bg-purple-500 h-2 rounded-full" 
                            style={{ width: `${score.score}%` }}
                          ></div>
                        </div>
                        <span className="text-sm text-gray-400 w-12">{score.score}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Quick Actions */}
            <div className="bg-gray-800 rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-4">Ações Rápidas</h2>
              <div className="space-y-3">
                <button
                  onClick={() => navigate('/search')}
                  className="w-full flex items-center space-x-3 bg-purple-600 hover:bg-purple-700 p-3 rounded-lg transition-colors"
                >
                  <Heart className="h-5 w-5" />
                  <span>Adicionar Favoritos</span>
                </button>
                <button
                  onClick={() => navigate('/forum')}
                  className="w-full flex items-center space-x-3 bg-blue-600 hover:bg-blue-700 p-3 rounded-lg transition-colors"
                >
                  <MessageCircle className="h-5 w-5" />
                  <span>Participar do Fórum</span>
                </button>
                <button
                  onClick={() => navigate('/add-friends')}
                  className="w-full flex items-center space-x-3 bg-green-600 hover:bg-green-700 p-3 rounded-lg transition-colors"
                >
                  <Users className="h-5 w-5" />
                  <span>Encontrar Amigos</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'activity' && (
          <div className="space-y-8">
            {/* Monthly Activity Chart */}
            <div className="bg-gray-800 rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-4 flex items-center space-x-2">
                <Activity className="h-5 w-5 text-purple-500" />
                <span>Atividade Mensal</span>
              </h2>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={stats.monthly_activity}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis dataKey="month" stroke="#9CA3AF" />
                    <YAxis stroke="#9CA3AF" />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: '#1F2937', 
                        border: '1px solid #374151',
                        borderRadius: '8px'
                      }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="favorites" 
                      stroke="#8B5CF6" 
                      strokeWidth={3}
                      name="Favoritos"
                    />
                    <Line 
                      type="monotone" 
                      dataKey="posts" 
                      stroke="#06B6D4" 
                      strokeWidth={3}
                      name="Posts"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'favorites' && (
          <div className="space-y-8">
            {/* Recent Favorites */}
            <div className="bg-gray-800 rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-6 flex items-center space-x-2">
                <Heart className="h-5 w-5 text-red-500" />
                <span>Favoritos Recentes</span>
              </h2>
              {stats.recent_favorites.length === 0 ? (
                <div className="text-center py-12">
                  <Heart className="h-16 w-16 text-gray-600 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-400 mb-2">Nenhum favorito ainda</h3>
                  <p className="text-gray-500 mb-4">Comece explorando filmes, séries e jogos!</p>
                  <button
                    onClick={() => navigate('/search')}
                    className="bg-purple-600 hover:bg-purple-700 px-6 py-2 rounded-lg transition-colors"
                  >
                    Explorar Conteúdo
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                  {stats.recent_favorites.map((favorite) => (
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
                          <span className="text-xs">{getTypeLabel(favorite.type).slice(0, -1)}</span>
                        </div>
                        <h3 className="font-medium text-white truncate">{favorite.title}</h3>
                        {favorite.rating && (
                          <div className="flex items-center space-x-1 mt-1">
                            <Star className="h-3 w-3 text-yellow-500" />
                            <span className="text-xs text-gray-400">{favorite.rating.toFixed(1)}</span>
                          </div>
                        )}
                        <p className="text-xs text-gray-500 mt-1">
                          {new Date(favorite.added_at).toLocaleDateString('pt-BR')}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'achievements' && (
          <div className="space-y-8">
            {/* Achievements */}
            <div className="bg-gray-800 rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-6 flex items-center space-x-2">
                <Award className="h-5 w-5 text-yellow-500" />
                <span>Conquistas</span>
              </h2>
              {stats.achievements.length === 0 ? (
                <div className="text-center py-12">
                  <Award className="h-16 w-16 text-gray-600 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-400 mb-2">Nenhuma conquista ainda</h3>
                  <p className="text-gray-500">Continue usando o MyVerse para desbloquear conquistas!</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {stats.achievements.map((achievement) => (
                    <div key={achievement.id} className="bg-gray-700 rounded-lg p-4 flex items-center space-x-4">
                      <div className="w-12 h-12 bg-yellow-500 rounded-full flex items-center justify-center">
                        {getAchievementIcon(achievement.icon)}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-white">{achievement.title}</h3>
                        <p className="text-sm text-gray-400">{achievement.description}</p>
                        <p className="text-xs text-gray-500 mt-1">
                          Desbloqueado em {new Date(achievement.unlocked_at).toLocaleDateString('pt-BR')}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;

