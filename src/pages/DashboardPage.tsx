import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Heart, MessageCircle, TrendingUp, Settings } from 'lucide-react';
import { Link } from 'react-router-dom';

const DashboardPage: React.FC = () => {
  const { user } = useAuth();

  const quickActions = [
    {
      title: 'Explorar Conteúdo',
      description: 'Descubra novos filmes, séries e jogos',
      icon: TrendingUp,
      href: '/search',
      color: 'bg-blue-500',
    },
    {
      title: 'Meus Favoritos',
      description: 'Veja seus conteúdos salvos',
      icon: Heart,
      href: '/favorites',
      color: 'bg-red-500',
    },
    {
      title: 'Fórum',
      description: 'Participe das discussões',
      icon: MessageCircle,
      href: '/forum',
      color: 'bg-green-500',
    },
    {
      title: 'Configurações',
      description: 'Gerir perfil e preferências',
      icon: Settings,
      href: '/profile',
      color: 'bg-purple-500',
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="myverse-container myverse-section">
        {/* Header */}
        <div className="mb-8">
          <h1 className="myverse-heading-2 mb-2">
            Bem-vindo de volta, {user?.username}! 👋
          </h1>
          <p className="myverse-body-large text-muted-foreground">
            Aqui está o que está a acontecer no seu MyVerse
          </p>
        </div>

        {/* Quick Actions Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {quickActions.map((action, index) => (
            <Link key={index} to={action.href}>
              <Card className="myverse-card hover:scale-105 transition-transform cursor-pointer">
                <CardHeader className="pb-3">
                  <div className={`w-12 h-12 ${action.color} rounded-lg myverse-flex-center mb-3`}>
                    <action.icon className="w-6 h-6 text-white" />
                  </div>
                  <CardTitle className="text-lg">{action.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>{action.description}</CardDescription>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        {/* Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recommendations */}
          <Card className="myverse-card">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <TrendingUp className="w-5 h-5 text-primary" />
                <span>Recomendações para Si</span>
              </CardTitle>
              <CardDescription>
                Baseado nas suas preferências
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="text-center py-8">
                  <p className="text-muted-foreground mb-4">
                    Complete o seu perfil para receber recomendações personalizadas
                  </p>
                  <Link to="/onboarding">
                    <Button className="myverse-button">
                      Configurar Preferências
                    </Button>
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Forum Activity */}
          <Card className="myverse-card">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <MessageCircle className="w-5 h-5 text-primary" />
                <span>Atividade do Fórum</span>
              </CardTitle>
              <CardDescription>
                Discussões recentes da comunidade
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="text-center py-8">
                  <p className="text-muted-foreground mb-4">
                    Nenhuma atividade recente no fórum
                  </p>
                  <Link to="/forum">
                    <Button variant="outline" className="myverse-button-secondary">
                      Explorar Fórum
                    </Button>
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Profile Completion */}
        <Card className="myverse-card mt-8">
          <CardHeader>
            <CardTitle>Complete o seu perfil</CardTitle>
            <CardDescription>
              Adicione mais informações para uma experiência personalizada
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-4 sm:space-y-0">
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">
                  Perfil 30% completo
                </p>
                <div className="w-64 h-2 bg-muted rounded-full">
                  <div className="w-1/3 h-2 bg-primary rounded-full"></div>
                </div>
              </div>
              <div className="flex space-x-3">
                <Link to="/profile">
                  <Button variant="outline" size="sm">
                    Editar Perfil
                  </Button>
                </Link>
                <Link to="/onboarding">
                  <Button size="sm" className="myverse-button">
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

