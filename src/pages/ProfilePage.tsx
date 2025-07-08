import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';

const ProfilePage: React.FC = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-background">
      <div className="myverse-container myverse-section">
        <Card className="myverse-card max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle className="myverse-heading-3">
              Perfil de {user?.username}
            </CardTitle>
            <CardDescription>
              Gerir informações do perfil
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium">Username</label>
              <p className="text-muted-foreground">{user?.username}</p>
            </div>
            <div>
              <label className="text-sm font-medium">Email</label>
              <p className="text-muted-foreground">{user?.email}</p>
            </div>
            <div>
              <label className="text-sm font-medium">Membro desde</label>
              <p className="text-muted-foreground">
                {user?.created_at ? new Date(user.created_at).toLocaleDateString('pt-PT') : 'N/A'}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ProfilePage;

