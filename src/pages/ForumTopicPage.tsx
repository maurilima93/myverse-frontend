import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';

const ForumTopicPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-background">
      <div className="myverse-container myverse-section">
        <Card className="myverse-card">
          <CardHeader>
            <CardTitle>Tópico do Fórum</CardTitle>
            <CardDescription>Em desenvolvimento</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">Página de tópico será implementada em breve</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ForumTopicPage;

