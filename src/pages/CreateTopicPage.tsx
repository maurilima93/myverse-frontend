import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';
import { Label } from '../components/ui/label';
import { useAuth } from '../contexts/AuthContext';
import { ArrowLeft, Send } from 'lucide-react';
import toast from 'react-hot-toast';

const CreateTopicPage: React.FC = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim() || !content.trim()) {
      toast.error('Título e conteúdo são obrigatórios');
      return;
    }

    try {
      setIsLoading(true);
      
      const response = await fetch(`${import.meta.env.VITE_API_URL}/forum/posts`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('myverse_token')}`
        },
        body: JSON.stringify({
          title: title.trim(),
          content: content.trim()
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Erro ao criar tópico');
      }

      const data = await response.json();
      toast.success('Tópico criado com sucesso!');
      navigate(`/forum/topic/${data.post.id}`);
      
    } catch (error: any) {
      console.error('Erro ao criar tópico:', error);
      toast.error(error.message || 'Erro ao criar tópico');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="myverse-container myverse-section">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="flex items-center gap-4 mb-6">
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate('/forum')}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Voltar ao Fórum
            </Button>
            <div>
              <h1 className="myverse-heading-2">Criar Novo Tópico</h1>
              <p className="text-muted-foreground">
                Compartilhe suas ideias e inicie uma discussão
              </p>
            </div>
          </div>

          {/* Form */}
          <Card>
            <CardHeader>
              <CardTitle>Novo Tópico</CardTitle>
              <CardDescription>
                Preencha as informações abaixo para criar seu tópico
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Título */}
                <div className="space-y-2">
                  <Label htmlFor="title">Título do Tópico</Label>
                  <Input
                    id="title"
                    placeholder="Digite um título chamativo para seu tópico..."
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    maxLength={200}
                    required
                  />
                  <p className="text-sm text-muted-foreground">
                    {title.length}/200 caracteres
                  </p>
                </div>

                {/* Conteúdo */}
                <div className="space-y-2">
                  <Label htmlFor="content">Conteúdo</Label>
                  <Textarea
                    id="content"
                    placeholder="Escreva o conteúdo do seu tópico aqui..."
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    rows={10}
                    maxLength={5000}
                    required
                  />
                  <p className="text-sm text-muted-foreground">
                    {content.length}/5000 caracteres
                  </p>
                </div>

                {/* Preview */}
                {(title.trim() || content.trim()) && (
                  <div className="space-y-2">
                    <Label>Preview</Label>
                    <Card className="bg-muted/50">
                      <CardContent className="p-4">
                        {title.trim() && (
                          <h3 className="font-semibold text-lg mb-2">
                            {title}
                          </h3>
                        )}
                        {content.trim() && (
                          <div className="text-sm text-muted-foreground whitespace-pre-wrap">
                            {content}
                          </div>
                        )}
                        <div className="flex items-center gap-2 mt-4 pt-4 border-t">
                          <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center text-xs text-primary-foreground">
                            {user?.username?.charAt(0).toUpperCase()}
                          </div>
                          <span className="text-sm font-medium">{user?.username}</span>
                          <span className="text-xs text-muted-foreground">
                            • agora
                          </span>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                )}

                {/* Actions */}
                <div className="flex justify-between items-center pt-4">
                  <div className="text-sm text-muted-foreground">
                    Postando como <strong>{user?.username}</strong>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => navigate('/forum')}
                    >
                      Cancelar
                    </Button>
                    <Button
                      type="submit"
                      disabled={isLoading || !title.trim() || !content.trim()}
                    >
                      {isLoading ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          Publicando...
                        </>
                      ) : (
                        <>
                          <Send className="w-4 h-4 mr-2" />
                          Publicar Tópico
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </form>
            </CardContent>
          </Card>

          {/* Guidelines */}
          <Card className="mt-6">
            <CardHeader>
              <CardTitle className="text-lg">Diretrizes da Comunidade</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="text-sm text-muted-foreground space-y-2">
                <li>• Seja respeitoso com outros membros da comunidade</li>
                <li>• Mantenha as discussões relevantes ao tema do entretenimento</li>
                <li>• Evite spam, conteúdo ofensivo ou inadequado</li>
                <li>• Use títulos descritivos para facilitar a busca</li>
                <li>• Contribua de forma construtiva para as discussões</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CreateTopicPage;

