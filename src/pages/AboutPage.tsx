import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from '../components/ui/button';
import { Users, Film, Gamepad2, Tv, Rocket, ShieldCheck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const AboutPage: React.FC = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: <Film className="w-6 h-6 text-primary" />,
      title: "Filmes",
      description: "Catálogo completo com os últimos lançamentos e clássicos"
    },
    {
      icon: <Tv className="w-6 h-6 text-primary" />,
      title: "Séries",
      description: "Temporadas, episódios e recomendações personalizadas"
    },
    {
      icon: <Gamepad2 className="w-6 h-6 text-primary" />,
      title: "Jogos",
      description: "Desde os grandes lançamentos até os indies mais cultuados"
    },
    {
      icon: <Users className="w-6 h-6 text-primary" />,
      title: "Comunidade",
      description: "Conecte-se com outros fãs e compartilhe suas opiniões"
    },
    {
      icon: <Rocket className="w-6 h-6 text-primary" />,
      title: "Tecnologia",
      description: "Plataforma desenvolvida com as melhores tecnologias web"
    },
    {
      icon: <ShieldCheck className="w-6 h-6 text-primary" />,
      title: "Segurança",
      description: "Seus dados protegidos com os mais altos padrões"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="myverse-container myverse-section">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="myverse-heading-1 mb-4">Sobre o MyVerse</h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Revolucionando a forma como os brasileiros descobrem e compartilham conteúdo de entretenimento
          </p>
        </div>

        {/* Mission */}
        <Card className="mb-12">
          <CardContent className="p-8">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div>
                <h2 className="myverse-heading-2 mb-4">Nossa Missão</h2>
                <p className="text-muted-foreground mb-6">
                  Criar a maior comunidade de fãs de entretenimento digital do Brasil, oferecendo
                  uma plataforma integrada onde você pode descobrir, discutir e organizar tudo
                  o que ama em um só lugar.
                </p>
                <Button onClick={() => navigate('/register')}>
                  Junte-se à Comunidade
                </Button>
              </div>
              <div className="bg-muted rounded-lg aspect-video flex items-center justify-center">
                <span className="text-muted-foreground">Vídeo Institucional</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Features */}
        <h2 className="myverse-heading-2 mb-8 text-center">O Que Oferecemos</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {features.map((feature, index) => (
            <Card key={index}>
              <CardContent className="p-6">
                <div className="flex items-center gap-4 mb-4">
                  {feature.icon}
                  <h3 className="text-lg font-semibold">{feature.title}</h3>
                </div>
                <p className="text-muted-foreground">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Team */}
        <Card>
          <CardHeader>
            <CardTitle className="myverse-heading-2 text-center">Nosso Time</CardTitle>
          </CardHeader>
          <CardContent className="grid md:grid-cols-3 gap-6">
            {[
              { name: "Equipe de Desenvolvimento", role: "Tecnologia" },
              { name: "Especialistas em Conteúdo", role: "Curadoria" },
              { name: "Comunidade MyVerse", role: "Você faz parte!" }
            ].map((member, index) => (
              <div key={index} className="text-center">
                <div className="w-32 h-32 bg-muted rounded-full mx-auto mb-4 flex items-center justify-center">
                  <Users className="w-12 h-12 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-semibold">{member.name}</h3>
                <p className="text-muted-foreground">{member.role}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AboutPage;