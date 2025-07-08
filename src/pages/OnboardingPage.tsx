import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';

const OnboardingPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-background">
      <div className="myverse-container myverse-section">
        <Card className="myverse-card max-w-2xl mx-auto">
          <CardHeader className="text-center">
            <CardTitle className="myverse-heading-3">
              Configure suas Preferências
            </CardTitle>
            <CardDescription>
              Em desenvolvimento - Sistema de onboarding personalizado
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center py-8">
            <p className="text-muted-foreground">
              Esta funcionalidade será implementada em breve
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default OnboardingPage;

