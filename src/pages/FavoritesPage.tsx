import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';

const FavoritesPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-background">
      <div className="myverse-container myverse-section">
        <Card className="myverse-card">
          <CardHeader>
            <CardTitle>Meus Favoritos</CardTitle>
            <CardDescription>Em desenvolvimento</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">Sistema de favoritos será implementado em breve</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default FavoritesPage;

