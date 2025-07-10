import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Heart, MessageCircle, TrendingUp, Settings, Star, Film, Tv, Gamepad2, Users, Calendar, Trophy, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';

interface UserStats {
  favorites_count: number;
  posts_count: number;
  comments_count: number;
  member_since: string;
  favorites_by_type: {
    movie?: number;
    tv?: number;
    game?: number;
  };
}

const DashboardPage: React.FC = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState<UserStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchUserStats = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/user/stats`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('myverse_token')}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setStats(data.stats);
      }
    } catch (error) {
      console.error('Erro ao carregar estatísticas:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchUserStats();
    }
  }, [user]);

  const quickActions = [
    {
      title: 'Explorar Conteúdo',
      description: 'Descubra novos filmes, séries e jogos',
      icon: TrendingUp,
      href: '/search',
      gradient: 'from-purple-600 to-purple-800',
      iconColor: 'text-purple-100',
    },
    {
      title: 'Meus Favoritos',
      description: 'Veja seus conteúdos salvos',
      icon: Heart,
      href: '/favorites',
      gradient: 'from-pink-600 to-purple-700',
      iconColor: 'text-pink-100',
    },
    {
      title: 'Fórum',
      description: 'Participe das discussões',
      icon: MessageCircle,
      href: '/forum',
      gradient: 'from-indigo-600 to-purple-700',
      iconColor: 'text-indigo-100',
    },
    {
      title: 'Notícias',
      description: 'Últimas novidades',
      icon: Zap,
      href: '/news',
      gradient: 'from-violet-600 to-purple-800',
      iconColor: 'text-violet-100',
    },
  ];

  const formatMemberSince = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', {
      month: 'long',
      year: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
      <div className="myverse-container myverse-section">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full flex items-center justify-center text-2xl font-bold text-white shadow-lg">
              {user?.username?.charAt(0).toUpperCase()}
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white mb-1 text-center">
                Bem-vindo de volta, {user?.username}! 👋
              </h1>
              <p className="text-purple-200 text-center">
                Aqui está o que está acontecendo no seu MyVerse
              </p>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        {!isLoading && stats && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <Card className="bg-gradient-to-br from-purple-800/50 to-purple-900/50 border-purple-700/50 backdrop-blur-sm">
              <CardContent className="p-4">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-purple-600/30 rounded-lg">
                    <Heart className="w-5 h-5 text-purple-300" />
                  </div>
                  <div>
                    <p className="text-sm text-purple-200">Favoritos</p>
                    <p className="text-2xl font-bold text-white">{stats.favorites_count}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-indigo-800/50 to-indigo-900/50 border-indigo-700/50 backdrop-blur-sm">
              <CardContent className="p-4">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-indigo-600/30 rounded-lg">
                    <MessageCircle className="w-5 h-5 text-indigo-300" />
                  </div>
                  <div>
                    <p className="text-sm text-indigo-200">Posts</p>
                    <p className="text-2xl font-bold text-white">{stats.posts_count}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-pink-800/50 to-pink-900/50 border-pink-700/50 backdrop-blur-sm">
              <CardContent className="p-4">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-pink-600/30 rounded-lg">
                    <Users className="w-5 h-5 text-pink-300" />
                  </div>
                  <div>
                    <p className="text-sm text-pink-200">Comentários</p>
                    <p className="text-2xl font-bold text-white">{stats.comments_count}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-violet-800/50 to-violet-900/50 border-violet-700/50 backdrop-blur-sm">
              <CardContent className="p-4">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-violet-600/30 rounded-lg">
                    <Calendar className="w-5 h-5 text-violet-300" />
                  </div>
                  <div>
                    <p className="text-sm text-violet-200">Membro desde</p>
                    <p className="text-sm font-bold text-white">
                      {formatMemberSince(stats.member_since)}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Quick Actions Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {quickActions.map((action, index) => (
            <Link key={index} to={action.href}>
              <Card className="bg-gradient-to-br from-slate-800/80 to-slate-900/80 border-slate-700/50 backdrop-blur-sm hover:scale-105 transition-all duration-300 cursor-pointer group hover:shadow-2xl hover:shadow-purple-500/20">
                <CardHeader className="pb-3">
                  <div className={`w-12 h-12 bg-gradient-to-br ${action.gradient} rounded-lg flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                    <action.icon className={`w-6 h-6 ${action.iconColor}`} />
                  </div>
                  <CardTitle className="text-lg text-white group-hover:text-purple-200 transition-colors">
                    {action.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-slate-300">
                    {action.description}
                  </CardDescription>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Favorites Breakdown */}
          {stats && stats.favorites_count > 0 && (
            <Card className="bg-gradient-to-br from-slate-800/80 to-slate-900/80 border-slate-700/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-white">
                  <Trophy className="w-5 h-5 text-yellow-400" />
                  <span>Seus Favoritos</span>
                </CardTitle>
                <CardDescription className="text-slate-300">
                  Distribuição por categoria
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {stats.favorites_by_type.movie && (
                    <div className="flex items-center justify-between p-3 bg-gradient-to-r from-blue-900/30 to-blue-800/30 rounded-lg border border-blue-700/30">
                      <div className="flex items-center gap-3">
                        <Film className="w-5 h-5 text-blue-400" />
                        <span className="text-white font-medium">Filmes</span>
                      </div>
                      <Badge className="bg-blue-600/30 text-blue-200 border-blue-500/30">
                        {stats.favorites_by_type.movie}
                      </Badge>
                    </div>
                  )}
                  
                  {stats.favorites_by_type.tv && (
                    <div className="flex items-center justify-between p-3 bg-gradient-to-r from-green-900/30 to-green-800/30 rounded-lg border border-green-700/30">
                      <div className="flex items-center gap-3">
                        <Tv className="w-5 h-5 text-green-400" />
                        <span className="text-white font-medium">Séries</span>
                      </div>
                      <Badge className="bg-green-600/30 text-green-200 border-green-500/30">
                        {stats.favorites_by_type.tv}
                      </Badge>
                    </div>
                  )}
                  
                  {stats.favorites_by_type.game && (
                    <div className="flex items-center justify-between p-3 bg-gradient-to-r from-purple-900/30 to-purple-800/30 rounded-lg border border-purple-700/30">
                      <div className="flex items-center gap-3">
                        <Gamepad2 className="w-5 h-5 text-purple-400" />
                        <span className="text-white font-medium">Jogos</span>
                      </div>
                      <Badge className="bg-purple-600/30 text-purple-200 border-purple-500/30">
                        {stats.favorites_by_type.game}
                      </Badge>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Recommendations */}
          <Card className="bg-gradient-to-br from-slate-800/80 to-slate-900/80 border-slate-700/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-white">
                <Star className="w-5 h-5 text-yellow-400" />
                <span>Recomendações</span>
              </CardTitle>
              <CardDescription className="text-slate-300">
                Baseado nas suas preferências
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-gradient-to-br from-purple-600 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Settings className="w-8 h-8 text-white" />
                  </div>
                  <p className="text-slate-300 mb-4">
                    Complete suas preferências para receber recomendações personalizadas
                  </p>
                  <Link to="/onboarding">
                    <Button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white border-0 shadow-lg">
                      Configurar Preferências
                    </Button>
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Profile Completion */}
        <Card className="bg-gradient-to-br from-slate-800/80 to-slate-900/80 border-slate-700/50 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-white">Complete seu perfil</CardTitle>
            <CardDescription className="text-slate-300">
              Adicione mais informações para uma experiência personalizada
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-4 sm:space-y-0">
              <div className="space-y-3">
                <p className="text-sm text-slate-300">
                  Perfil 30% completo
                </p>
                <div className="w-64 h-3 bg-slate-700 rounded-full overflow-hidden">
                  <div className="w-1/3 h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"></div>
                </div>
              </div>
              <div className="flex space-x-3">
                <Link to="/profile">
                  <Button variant="outline" size="sm" className="border-slate-600 text-slate-300 hover:bg-slate-700 hover:text-white">
                    Editar Perfil
                  </Button>
                </Link>
                <Link to="/onboarding">
                  <Button size="sm" className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white border-0 shadow-lg">
                    Configurar Preferências
                  </Button>
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DashboardPage;

