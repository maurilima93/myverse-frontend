import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';
import { Label } from '../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Checkbox } from '../components/ui/checkbox';
import { useAuth } from '../contexts/AuthContext';
import { ArrowLeft, Send, Image, Link, Star } from 'lucide-react';
import toast from 'react-hot-toast';

const CreateNewsPage: React.FC = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [summary, setSummary] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [sourceUrl, setSourceUrl] = useState('');
  const [category, setCategory] = useState('geral');
  const [isFeatured, setIsFeatured] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  const categories = [
    { id: 'geral', name: 'Geral', description: 'Notícias gerais do entretenimento' },
    { id: 'movies', name: 'Filmes', description: 'Notícias sobre filmes' },
    { id: 'tv', name: 'Séries', description: 'Notícias sobre séries de TV' },
    { id: 'games', name: 'Jogos', description: 'Notícias sobre jogos' },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim() || !content.trim()) {
      toast.error('Título e conteúdo são obrigatórios');
      return;
    }

    try {
      setIsLoading(true);
      
      const response = await fetch(`${import.meta.env.VITE_API_URL}/news`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('myverse_token')}`
        },
        body: JSON.stringify({
          title: title.trim(),
          content: content.trim(),
          summary: summary.trim() || undefined,
          image_url: imageUrl.trim() || undefined,
          source_url: sourceUrl.trim() || undefined,
          category,
          is_featured: isFeatured
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Erro ao criar notícia');
      }

      const data = await response.json();
      toast.success('Notícia criada com sucesso!');
      navigate(`/news/${data.news.id}`);
      
    } catch (error: any) {
      console.error('Erro ao criar notícia:', error);
      toast.error(error.message || 'Erro ao criar notícia');
    } finally {
      setIsLoading(false);
    }
  };

  const generateSummary = () => {
    if (content.trim()) {
      const sentences = content.split('.').filter(s => s.trim().length > 0);
      const firstTwoSentences = sentences.slice(0, 2).join('.') + '.';
      setSummary(firstTwoSentences.substring(0, 300));
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
              onClick={() => navigate('/news')}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Voltar às Notícias
            </Button>
            <div>
              <h1 className="myverse-heading-2">Criar Nova Notícia</h1>
              <p className="text-muted-foreground">
                Compartilhe as últimas novidades do entretenimento
              </p>
            </div>
          </div>

          {/* Form */}
          <Card>
            <CardHeader>
              <CardTitle>Nova Notícia</CardTitle>
              <CardDescription>
                Preencha as informações abaixo para criar sua notícia
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Título */}
                <div className="space-y-2">
                  <Label htmlFor="title">Título da Notícia</Label>
                  <Input
                    id="title"
                    placeholder="Digite um título chamativo para sua notícia..."
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    maxLength={255}
                    required
                  />
                  <p className="text-sm text-muted-foreground">
                    {title.length}/255 caracteres
                  </p>
                </div>

                {/* Categoria */}
                <div className="space-y-2">
                  <Label htmlFor="category">Categoria</Label>
                  <Select value={category} onValueChange={setCategory}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione uma categoria" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((cat) => (
                        <SelectItem key={cat.id} value={cat.id}>
                          <div>
                            <div className="font-medium">{cat.name}</div>
                            <div className="text-sm text-muted-foreground">{cat.description}</div>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Resumo */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="summary">Resumo (Opcional)</Label>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={generateSummary}
                      disabled={!content.trim()}
                    >
                      Gerar Automaticamente
                    </Button>
                  </div>
                  <Textarea
                    id="summary"
                    placeholder="Escreva um resumo da notícia..."
                    value={summary}
                    onChange={(e) => setSummary(e.target.value)}
                    rows={3}
                    maxLength={500}
                  />
                  <p className="text-sm text-muted-foreground">
                    {summary.length}/500 caracteres
                  </p>
                </div>

                {/* Imagem */}
                <div className="space-y-2">
                  <Label htmlFor="image_url">URL da Imagem (Opcional)</Label>
                  <div className="flex gap-2">
                    <Image className="w-5 h-5 text-muted-foreground mt-2" />
                    <Input
                      id="image_url"
                      placeholder="https://exemplo.com/imagem.jpg"
                      value={imageUrl}
                      onChange={(e) => setImageUrl(e.target.value)}
                      type="url"
                    />
                  </div>
                  {imageUrl && (
                    <div className="mt-2">
                      <img
                        src={imageUrl}
                        alt="Preview"
                        className="max-w-xs h-32 object-cover rounded border"
                        onError={() => toast.error('URL da imagem inválida')}
                      />
                    </div>
                  )}
                </div>

                {/* URL da Fonte */}
                <div className="space-y-2">
                  <Label htmlFor="source_url">URL da Fonte (Opcional)</Label>
                  <div className="flex gap-2">
                    <Link className="w-5 h-5 text-muted-foreground mt-2" />
                    <Input
                      id="source_url"
                      placeholder="https://fonte-original.com/noticia"
                      value={sourceUrl}
                      onChange={(e) => setSourceUrl(e.target.value)}
                      type="url"
                    />
                  </div>
                </div>

                {/* Conteúdo */}
                <div className="space-y-2">
                  <Label htmlFor="content">Conteúdo da Notícia</Label>
                  <Textarea
                    id="content"
                    placeholder="Escreva o conteúdo completo da notícia aqui..."
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    rows={15}
                    required
                  />
                  <p className="text-sm text-muted-foreground">
                    {content.length} caracteres
                  </p>
                </div>

                {/* Destaque */}
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="featured"
                    checked={isFeatured}
                    onCheckedChange={setIsFeatured}
                  />
                  <Label htmlFor="featured" className="flex items-center gap-2">
                    <Star className="w-4 h-4" />
                    Marcar como notícia em destaque
                  </Label>
                </div>

                {/* Preview */}
                {(title.trim() || content.trim()) && (
                  <div className="space-y-2">
                    <Label>Preview</Label>
                    <Card className="bg-muted/50">
                      <CardContent className="p-4">
                        {imageUrl && (
                          <div className="aspect-video bg-muted rounded mb-4 overflow-hidden">
                            <img
                              src={imageUrl}
                              alt="Preview"
                              className="w-full h-full object-cover"
                            />
                          </div>
                        )}
                        
                        {title.trim() && (
                          <h3 className="font-bold text-xl mb-2">
                            {title}
                          </h3>
                        )}
                        
                        {summary.trim() && (
                          <p className="text-muted-foreground text-sm mb-4">
                            {summary}
                          </p>
                        )}
                        
                        {content.trim() && (
                          <div className="text-sm whitespace-pre-wrap">
                            {content.substring(0, 300)}
                            {content.length > 300 && '...'}
                          </div>
                        )}
                        
                        <div className="flex items-center gap-4 mt-4 pt-4 border-t text-sm text-muted-foreground">
                          <div className="flex items-center gap-2">
                            <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center text-xs text-primary-foreground">
                              {user?.username?.charAt(0).toUpperCase()}
                            </div>
                            <span className="font-medium">{user?.username}</span>
                          </div>
                          <span>• agora</span>
                          <span>• {categories.find(c => c.id === category)?.name}</span>
                          {isFeatured && <span>• Destaque</span>}
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                )}

                {/* Actions */}
                <div className="flex justify-between items-center pt-4">
                  <div className="text-sm text-muted-foreground">
                    Publicando como <strong>{user?.username}</strong>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => navigate('/news')}
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
                          Publicar Notícia
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
              <CardTitle className="text-lg">Diretrizes para Notícias</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="text-sm text-muted-foreground space-y-2">
                <li>• Verifique a veracidade das informações antes de publicar</li>
                <li>• Use títulos claros e descritivos</li>
                <li>• Inclua fontes quando possível</li>
                <li>• Mantenha o conteúdo relevante ao entretenimento</li>
                <li>• Evite conteúdo ofensivo ou inadequado</li>
                <li>• Use imagens de boa qualidade e com direitos apropriados</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CreateNewsPage;

