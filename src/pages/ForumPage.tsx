import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';

const ForumPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-background">
      <div className="myverse-container myverse-section">
        <div className="text-center mb-8">
          <h1 className="myverse-heading-2 mb-4">Fórum da Comunidade</h1>
          <p className="myverse-body-large text-muted-foreground">
            Discuta filmes, séries, jogos e livros com a comunidade
          </p>
        </div>
        
        <Card className="myverse-card">
          <CardHeader>
            <CardTitle>Fórum em Desenvolvimento</CardTitle>
            <CardDescription>
              Sistema completo de fóruns será implementado em breve
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center py-8">
            <p className="text-muted-foreground">
              Em breve você poderá criar tópicos e participar de discussões
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ForumPage;

