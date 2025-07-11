import React from 'react';
import { Link } from 'react-router-dom';
import { Star, Users, TrendingUp, Play, ArrowRight } from 'lucide-react';
import { Button } from '../components/ui/button';
import NewsCarousel from '../components/NewsCarousel';

const HomePage: React.FC = () => {
  const features = [
    {
      icon: Star,
      title: 'Descubra Conteúdo',
      description: 'Encontre filmes, séries, jogos e livros baseados nos seus gostos pessoais.',
    },
    {
      icon: Users,
      title: 'Conecte-se',
      description: 'Junte-se a comunidades e discuta com pessoas que partilham os seus interesses.',
    },
    {
      icon: TrendingUp,
      title: 'Acompanhe Tendências',
      description: 'Fique por dentro do que está em alta no mundo do entretenimento.',
    },
    {
      icon: Play,
      title: 'Experiência Personalizada',
      description: 'Receba recomendações únicas baseadas nas suas preferências.',
    },
  ];

  const stats = [
    { number: '130+', label: 'Utilizadores Ativos' },
    { number: '50K+', label: 'Conteúdos Catalogados' },
    { number: '30', label: 'Avaliações' },
    { number: '24/7', label: 'Suporte' },
  ];

  return (
    <div className="min-h-screen imdb-theme">
      {/* Hero Section */}
      <NewsCarousel />
      <section className="hero-gradient py-20 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 text-white">
            Sua Rede Social de <span className="text-purple-400">Entretenimento</span>
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-secondary-imdb max-w-4xl mx-auto leading-relaxed">
            Descubra, avalie e discuta filmes, séries, jogos e livros. Conecte-se com pessoas que 
            partilham os seus gostos e encontre o seu próximo conteúdo favorito.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link to="/register">
              <Button className="purple-button text-lg px-8 py-4 flex items-center gap-2">
                Começar Agora
                <ArrowRight className="w-5 h-5" />
              </Button>
            </Link>
            <Link to="/forum">
              <Button 
                variant="outline" 
                className="text-lg px-8 py-4 border-purple-400 text-purple-400 hover:bg-purple-400 hover:text-white"
              >
                Explorar Fórum
              </Button>
            </Link>
          </div>
        </div>
      </section>
      {/* Tagline Section */}
      <section className="py-12 text-center">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-semibold mb-4 text-white">
            Tudo o que precisa num só lugar
          </h2>
          <p className="text-lg text-secondary-imdb">
            Uma plataforma completa para descobrir, avaliar e discutir todo tipo de entretenimento.
          </p>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="feature-card text-center">
                <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-purple-500/10 flex items-center justify-center">
                  <feature.icon className="w-8 h-8 purple-icon" />
                </div>
                <h3 className="text-xl font-semibold mb-4 text-white">
                  {feature.title}
                </h3>
                <p className="text-secondary-imdb leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="stats-section py-16">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">
              Junte-se à nossa comunidade
            </h2>
            <p className="text-lg text-secondary-imdb">
              Milhares de utilizadores já descobriram o seu novo conteúdo favorito
            </p>
          </div>
          
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
            {stats.map((stat, index) => (
              <div key={index} className="space-y-2">
                <div className="text-4xl md:text-5xl font-bold text-purple-400">
                  {stat.number}
                </div>
                <div className="text-sm md:text-base text-secondary-imdb font-medium">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-white">
            Pronto para começar?
          </h2>
          <p className="text-lg text-secondary-imdb mb-8">
            Crie a sua conta gratuita e comece a descobrir conteúdo personalizado para si.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/register">
              <Button className="purple-button text-lg px-8 py-4">
                Criar Conta Gratuita
              </Button>
            </Link>
            <Link to="/login">
              <Button 
                variant="ghost" 
                className="text-lg px-8 py-4 text-purple-400 hover:text-white hover:bg-purple-500/10"
              >
                Já tenho conta
              </Button>
            </Link>
          </div>
          <div className="flex flex-col items-center mt-6">
            <Link to="/contact">
              <Button 
                variant="ghost" 
                className="text-lg px-8 py-4 text-purple-400 hover:text-white hover:bg-purple-500/10"
              >
                Contato
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;

