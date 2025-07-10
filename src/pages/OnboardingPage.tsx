import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { useAuth } from '../contexts/AuthContext';
import { Film, Tv, Gamepad2, CheckCircle } from 'lucide-react';
import toast from 'react-hot-toast';

const categories = [
  { id: 'movies', name: 'Filmes', icon: Film, description: 'Descubra os melhores filmes' },
  { id: 'tv', name: 'Séries', icon: Tv, description: 'Acompanhe suas séries favoritas' },
  { id: 'games', name: 'Jogos', icon: Gamepad2, description: 'Explore o mundo dos games' },
];

const genres = [
  'Ação', 'Aventura', 'Comédia', 'Drama', 'Ficção Científica', 'Terror', 
  'Romance', 'Thriller', 'Fantasia', 'Mistério', 'Crime', 'Documentário',
  'Animação', 'Família', 'Guerra', 'História', 'Música', 'Faroeste'
];

const OnboardingPage: React.FC = () => {
  const [step, setStep] = useState(1);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleCategoryToggle = (categoryId: string) => {
    setSelectedCategories(prev => 
      prev.includes(categoryId) 
        ? prev.filter(id => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  const handleGenreToggle = (genre: string) => {
    setSelectedGenres(prev => 
      prev.includes(genre) 
        ? prev.filter(g => g !== genre)
        : [...prev, genre]
    );
  };

  const handleNext = () => {
    if (step === 1 && selectedCategories.length === 0) {
      toast.error('Selecione pelo menos uma categoria');
      return;
    }
    if (step === 2 && selectedGenres.length === 0) {
      toast.error('Selecione pelo menos um gênero');
      return;
    }
    setStep(step + 1);
  };

  const handleFinish = async () => {
    try {
      setIsLoading(true);
      
      // Salvar preferências no backend
      const response = await fetch(`${import.meta.env.VITE_API_URL}/user/preferences`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('myverse_token')}`
        },
        body: JSON.stringify({
          preferred_categories: selectedCategories,
          preferred_genres: selectedGenres
        })
      });

      if (!response.ok) {
        throw new Error('Erro ao salvar preferências');
      }

      toast.success('Preferências salvas com sucesso!');
      navigate('/dashboard');
      
    } catch (error) {
      console.error('Erro ao salvar preferências:', error);
      toast.error('Erro ao salvar preferências. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  const renderStep1 = () => (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="myverse-heading-3 mb-2">Que tipo de conteúdo te interessa?</h2>
        <p className="text-muted-foreground">Selecione as categorias que mais gosta</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {categories.map((category) => {
          const Icon = category.icon;
          const isSelected = selectedCategories.includes(category.id);
          
          return (
            <Card 
              key={category.id}
              className={`cursor-pointer transition-all hover:scale-105 ${
                isSelected ? 'ring-2 ring-primary bg-primary/5' : ''
              }`}
              onClick={() => handleCategoryToggle(category.id)}
            >
              <CardContent className="p-6 text-center">
                <Icon className={`w-12 h-12 mx-auto mb-3 ${
                  isSelected ? 'text-primary' : 'text-muted-foreground'
                }`} />
                <h3 className="font-semibold mb-1">{category.name}</h3>
                <p className="text-sm text-muted-foreground">{category.description}</p>
                {isSelected && (
                  <CheckCircle className="w-6 h-6 text-primary mx-auto mt-2" />
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="myverse-heading-3 mb-2">Quais gêneros você prefere?</h2>
        <p className="text-muted-foreground">Escolha seus gêneros favoritos</p>
      </div>
      
      <div className="flex flex-wrap gap-2 justify-center">
        {genres.map((genre) => {
          const isSelected = selectedGenres.includes(genre);
          
          return (
            <Badge
              key={genre}
              variant={isSelected ? "default" : "outline"}
              className={`cursor-pointer transition-all hover:scale-105 ${
                isSelected ? 'bg-primary text-primary-foreground' : ''
              }`}
              onClick={() => handleGenreToggle(genre)}
            >
              {genre}
            </Badge>
          );
        })}
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-6 text-center">
      <CheckCircle className="w-16 h-16 text-green-500 mx-auto" />
      <div>
        <h2 className="myverse-heading-3 mb-2">Tudo pronto!</h2>
        <p className="text-muted-foreground mb-4">
          Suas preferências foram configuradas. Agora você receberá recomendações personalizadas.
        </p>
      </div>
      
      <div className="bg-muted/50 rounded-lg p-4">
        <h3 className="font-semibold mb-2">Suas preferências:</h3>
        <div className="space-y-2">
          <div>
            <span className="text-sm font-medium">Categorias: </span>
            <span className="text-sm text-muted-foreground">
              {selectedCategories.map(cat => 
                categories.find(c => c.id === cat)?.name
              ).join(', ')}
            </span>
          </div>
          <div>
            <span className="text-sm font-medium">Gêneros: </span>
            <span className="text-sm text-muted-foreground">
              {selectedGenres.join(', ')}
            </span>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-background">
      <div className="myverse-container myverse-section">
        <Card className="myverse-card max-w-4xl mx-auto">
          <CardHeader className="text-center">
            <CardTitle className="myverse-heading-2">
              Bem-vindo ao MyVerse, {user?.username}!
            </CardTitle>
            <CardDescription>
              Vamos personalizar sua experiência
            </CardDescription>
            
            {/* Progress indicator */}
            <div className="flex justify-center mt-4">
              <div className="flex space-x-2">
                {[1, 2, 3].map((stepNumber) => (
                  <div
                    key={stepNumber}
                    className={`w-3 h-3 rounded-full ${
                      stepNumber <= step ? 'bg-primary' : 'bg-muted'
                    }`}
                  />
                ))}
              </div>
            </div>
          </CardHeader>
          
          <CardContent className="py-8">
            {step === 1 && renderStep1()}
            {step === 2 && renderStep2()}
            {step === 3 && renderStep3()}
            
            <div className="flex justify-between mt-8">
              {step > 1 && step < 3 && (
                <Button 
                  variant="outline" 
                  onClick={() => setStep(step - 1)}
                >
                  Voltar
                </Button>
              )}
              
              <div className="ml-auto">
                {step < 3 ? (
                  <Button onClick={handleNext}>
                    {step === 2 ? 'Finalizar' : 'Próximo'}
                  </Button>
                ) : (
                  <Button 
                    onClick={handleFinish}
                    disabled={isLoading}
                  >
                    {isLoading ? 'Salvando...' : 'Ir para Dashboard'}
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default OnboardingPage;

