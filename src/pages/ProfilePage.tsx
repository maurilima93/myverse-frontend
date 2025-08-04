import React, { useState, useEffect } from 'react';
import { User, Heart, Users, Trophy, TrendingUp, Calendar, Star } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

interface UserProfile {
  id: number;
  username: string;
  email: string;
  joinDate: string;
  favoriteCount: number;
  forumPosts: number;
  friendsCount: number;
  achievements: string[];
}

interface Favorite {
  id: number;
  content_id: string;
  content_type: string;
  title: string;
  poster_url: string | null;
  rating: number;
  genres: string[];
  created_at: string;
}

interface ActivityData {
  month: string;
  favorites: number;
  posts: number;
}

interface ContentDistribution {
  type: string;
  count: number;
  percentage: number;
}

const ProfilePage: React.FC = () => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [favorites, setFavorites] = useState<Favorite[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [activityData, setActivityData] = useState<ActivityData[]>([]);
  const [contentDistribution, setContentDistribution] = useState<ContentDistribution[]>([]);

  useEffect(() => {
    fetchProfile();
    fetchFavorites();
  }, []);

  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem('token');
      const username = localStorage.getItem('username');
      
      if (!token || !username) {
        return;
      }

      // Simular dados do perfil
      const mockProfile: UserProfile = {
        id: 1,
        username: username,
        email: 'usuario@exemplo.com',
        joinDate: '2024-01-15',
        favoriteCount: 0,
        forumPosts: 0,
        friendsCount: 12,
        achievements: ['Primeiro Favorito', 'Cinéfilo', 'Gamer', 'Crítico']
      };

      setProfile(mockProfile);
    } catch (error) {
      console.error('Erro ao buscar perfil:', error);
    }
  };

  const fetchFavorites = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      const response = await fetch(`${import.meta.env.VITE_API_URL}/content/favorites`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setFavorites(data.favorites || []);
        
        // Atualizar contagem no perfil
        if (profile) {
          setProfile({
            ...profile,
            favoriteCount: data.favorites?.length || 0
          });
        }

        // Gerar dados de atividade
        generateActivityData(data.favorites || []);
        generateContentDistribution(data.favorites || []);
      }
    } catch (error) {
      console.error('Erro ao buscar favoritos:', error);
    } finally {
      setLoading(false);
    }
  };

  const generateActivityData = (favs: Favorite[]) => {
    const monthlyData: { [key: string]: { favorites: number; posts: number } } = {};
    
    // Últimos 6 meses
    for (let i = 5; i >= 0; i--) {
      const date = new Date();
      date.setMonth(date.getMonth() - i);
      const monthKey = date.toLocaleDateString('pt-BR', { month: 'short' });
      monthlyData[monthKey] = { favorites: 0, posts: 0 };
    }

    // Contar favoritos por mês
    favs.forEach(fav => {
      const date = new Date(fav.created_at);
      const monthKey = date.toLocaleDateString('pt-BR', { month: 'short' });
      if (monthlyData[monthKey]) {
        monthlyData[monthKey].favorites++;
      }
    });

    // Simular posts do fórum
    Object.keys(monthlyData).forEach(month => {
      monthlyData[month].posts = Math.floor(Math.random() * 5);
    });

    const data = Object.entries(monthlyData).map(([month, counts]) => ({
      month,
      favorites: counts.favorites,
      posts: counts.posts
    }));

    setActivityData(data);
  };

  const generateContentDistribution = (favs: Favorite[]) => {
    const distribution: { [key: string]: number } = {
      movie: 0,
      tv: 0,
      game: 0
    };

    favs.forEach(fav => {
      if (distribution[fav.content_type] !== undefined) {
        distribution[fav.content_type]++;
      }
    });

    const total = Object.values(distribution).reduce((sum, count) => sum + count, 0);
    
    const data = Object.entries(distribution).map(([type, count]) => ({
      type: type === 'movie' ? 'Filmes' : type === 'tv' ? 'Séries' : 'Jogos',
      count,
      percentage: total > 0 ? Math.round((count / total) * 100) : 0
    }));

    setContentDistribution(data);
  };

  const getTopGenres = () => {
    const genreCount: { [key: string]: number } = {};
    
    favorites.forEach(fav => {
      fav.genres.forEach(genre => {
        if (genre && genre.trim()) {
          genreCount[genre] = (genreCount[genre] || 0) + 1;
        }
      });
    });

    return Object.entries(genreCount)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5)
      .map(([genre, count]) => ({ genre, count }));
  };

  const getCompatibilityScore = () => {
    // Simular score de compatibilidade com amigos
    return Math.floor(Math.random() * 30) + 70; // 70-100%
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white text-xl">Carregando perfil...</div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white text-xl">Erro ao carregar perfil</div>
      </div>
    );
  }

  const COLORS = ['#8B5CF6', '#06B6D4', '#10B981', '#F59E0B'];

  const renderCustomizedLabel = ({ type, percentage }: ContentDistribution) => {
  return `${type}: ${percentage}%`;
};

  return (
    <div className="min-h-screen bg-gray-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header do Perfil */}
        <div className="bg-gray-800 rounded-lg p-6 mb-8">
          <div className="flex items-center space-x-6">
            <div className="w-24 h-24 bg-purple-600 rounded-full flex items-center justify-center">
              <User className="w-12 h-12 text-white" />
            </div>
            
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-white mb-2">{profile.username}</h1>
              <p className="text-gray-400 mb-4">Membro desde {new Date(profile.joinDate).toLocaleDateString('pt-BR')}</p>
              
              <div className="flex space-x-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-400">{profile.favoriteCount}</div>
                  <div className="text-gray-400 text-sm">Favoritos</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-400">{profile.forumPosts}</div>
                  <div className="text-gray-400 text-sm">Posts</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-400">{profile.friendsCount}</div>
                  <div className="text-gray-400 text-sm">Amigos</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-yellow-400">{getCompatibilityScore()}%</div>
                  <div className="text-gray-400 text-sm">Compatibilidade</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Navegação por Abas */}
        <div className="bg-gray-800 rounded-lg mb-8">
          <div className="flex border-b border-gray-700">
            {[
              { id: 'overview', label: 'Visão Geral', icon: TrendingUp },
              { id: 'activity', label: 'Atividade', icon: Calendar },
              { id: 'favorites', label: 'Favoritos', icon: Heart },
              { id: 'achievements', label: 'Conquistas', icon: Trophy }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 px-6 py-4 font-medium transition-colors ${
                  activeTab === tab.id
                    ? 'text-purple-400 border-b-2 border-purple-400'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                <tab.icon className="w-5 h-5" />
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Conteúdo das Abas */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Distribuição de Conteúdo */}
            <div className="bg-gray-800 rounded-lg p-6">
              <h3 className="text-xl font-bold text-white mb-4">Distribuição de Conteúdo</h3>
              {contentDistribution.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={contentDistribution}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={renderCustomizedLabel}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="count"
                    >
                      {contentDistribution.map((_, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="text-gray-400 text-center py-8">
                  Adicione favoritos para ver a distribuição
                </div>
              )}
            </div>

            {/* Gêneros Favoritos */}
            <div className="bg-gray-800 rounded-lg p-6">
              <h3 className="text-xl font-bold text-white mb-4">Gêneros Favoritos</h3>
              <div className="space-y-3">
                {getTopGenres().map((item, index) => (
                  <div key={item.genre} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center text-white text-sm font-bold">
                        {index + 1}
                      </div>
                      <span className="text-white">{item.genre}</span>
                    </div>
                    <span className="text-gray-400">{item.count} itens</span>
                  </div>
                ))}
                {getTopGenres().length === 0 && (
                  <div className="text-gray-400 text-center py-8">
                    Adicione favoritos para ver seus gêneros preferidos
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'activity' && (
          <div className="bg-gray-800 rounded-lg p-6">
            <h3 className="text-xl font-bold text-white mb-4">Atividade dos Últimos 6 Meses</h3>
            <ResponsiveContainer width="100%" height={400}>
              <BarChart data={activityData}>
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
                <Bar dataKey="favorites" fill="#8B5CF6" name="Favoritos" />
                <Bar dataKey="posts" fill="#06B6D4" name="Posts" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}

        {activeTab === 'favorites' && (
          <div className="bg-gray-800 rounded-lg p-6">
            <h3 className="text-xl font-bold text-white mb-4">Favoritos Recentes</h3>
            {favorites.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {favorites.slice(0, 12).map(favorite => (
                  <div key={favorite.id} className="bg-gray-700 rounded-lg p-3">
                    {favorite.poster_url ? (
                      <img
                        src={favorite.poster_url}
                        alt={favorite.title}
                        className="w-full h-32 object-cover rounded-lg mb-2"
                      />
                    ) : (
                      <div className="w-full h-32 bg-gray-600 rounded-lg mb-2 flex items-center justify-center">
                        <span className="text-gray-400 text-xs text-center">{favorite.title}</span>
                      </div>
                    )}
                    <h4 className="text-white text-sm font-medium truncate">{favorite.title}</h4>
                    <div className="flex items-center justify-between mt-1">
                      <span className="text-xs text-gray-400 capitalize">{favorite.content_type}</span>
                      {favorite.rating && (
                        <div className="flex items-center space-x-1">
                          <Star className="w-3 h-3 text-yellow-400" />
                          <span className="text-xs text-gray-400">{favorite.rating.toFixed(1)}</span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-gray-400 text-center py-8">
                <Heart className="w-16 h-16 mx-auto mb-4 text-gray-600" />
                <p>Você ainda não tem favoritos</p>
                <p className="text-sm mt-2">Explore conteúdos e adicione aos seus favoritos!</p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'achievements' && (
          <div className="bg-gray-800 rounded-lg p-6">
            <h3 className="text-xl font-bold text-white mb-4">Conquistas</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {profile.achievements.map((achievement, index) => (
                <div key={index} className="bg-gray-700 rounded-lg p-4 flex items-center space-x-3">
                  <div className="w-12 h-12 bg-yellow-500 rounded-full flex items-center justify-center">
                    <Trophy className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h4 className="text-white font-medium">{achievement}</h4>
                    <p className="text-gray-400 text-sm">Conquista desbloqueada</p>
                  </div>
                </div>
              ))}
              
              {/* Conquistas bloqueadas */}
              <div className="bg-gray-700 rounded-lg p-4 flex items-center space-x-3 opacity-50">
                <div className="w-12 h-12 bg-gray-600 rounded-full flex items-center justify-center">
                  <Trophy className="w-6 h-6 text-gray-400" />
                </div>
                <div>
                  <h4 className="text-gray-400 font-medium">Colecionador</h4>
                  <p className="text-gray-500 text-sm">Tenha 50 favoritos</p>
                </div>
              </div>
              
              <div className="bg-gray-700 rounded-lg p-4 flex items-center space-x-3 opacity-50">
                <div className="w-12 h-12 bg-gray-600 rounded-full flex items-center justify-center">
                  <Users className="w-6 h-6 text-gray-400" />
                </div>
                <div>
                  <h4 className="text-gray-400 font-medium">Social</h4>
                  <p className="text-gray-500 text-sm">Tenha 25 amigos</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;

