import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Label } from '../components/ui/label';
import { useAuth } from '../contexts/AuthContext';
import { ArrowLeft, Send } from 'lucide-react';
import { toast } from 'react-hot-toast';

const CreateTopicPage: React.FC = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  const categories = [
    { value: 'filmes', label: 'Filmes' },
    { value: 'series', label: 'Séries' },
    { value: 'jogos', label: 'Jogos' },
    { value: 'livros', label: 'Livros' },
    { value: 'geral', label: 'Geral' },
    { value: 'recomendacoes', label: 'Recomendações' },
    { value: 'noticias', label: 'Notícias' }
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast.error('Você precisa estar logado para criar um tópico');
      navigate('/login');
      return;
    }

    if (!title.trim()) {
      toast.error('Título é obrigatório');
      return;
    }

    if (title.trim().length < 5) {
      toast.error('Título deve ter pelo menos 5 caracteres');
      return;
    }

    if (!content.trim()) {
      toast.error('Conteúdo é obrigatório');
      return;
    }

    if (content.trim().length < 10) {
      toast.error('Conteúdo deve ter pelo menos 10 caracteres');
      return;
    }

    if (!category) {
      toast.error('Categoria é obrigatória');
      return;
    }

    setIsSubmitting(true);

    try {
      const token = localStorage.getItem('myverse_token');
      if (!token) {
        throw new Error('Token de autenticação não encontrado');
      }

      const response = await fetch(`${import.meta.env.VITE_API_URL}/forum/posts`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          title: title.trim(),
          content: content.trim(),
          category: category
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Erro ao criar tópico');
      }

      const data = await response.json();
      
      toast.success('Tópico criado com sucesso!');
      navigate(`/forum/topic/${data.post.id}`);
    } catch (err: any) {
      console.error('Erro ao criar tópico:', err);
      toast.error(err.message || 'Erro ao criar tópico');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-background">
        <div className="myverse-container myverse-section">
          <Card className="max-w-2xl mx-auto bg-gray-800 border-gray-700">
            <CardContent className="p-8 text-center">
              <h2 className="text-2xl font-bold text-white mb-4">Login Necessário</h2>
              <p className="text-gray-400 mb-6">
                Você precisa estar logado para criar um tópico no fórum.
              </p>
              <div className="space-x-4">
                <Button onClick={() => navigate('/login')} className="bg-primary hover:bg-primary/90">
                  Fazer Login
                </Button>
                <Button onClick={() => navigate('/forum')} variant="outline">
                  Voltar ao Fórum
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="myverse-container myverse-section">
        {/* Header */}
        <div className="flex items-center mb-8">
          <Button
            variant="ghost"
            onClick={() => navigate('/forum')}
            className="mr-4 text-gray-400 hover:text-white"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar ao Fórum
          </Button>
          <h1 className="text-3xl font-bold text-white">Criar Novo Tópico</h1>
        </div>

        {/* Form */}
        <Card className="max-w-4xl mx-auto bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white">Novo Tópico de Discussão</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Título */}
              <div className="space-y-2">
                <Label htmlFor="title" className="text-white">
                  Título do Tópico *
                </Label>
                <Input
                  id="title"
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Digite um título claro e descritivo..."
                  className="bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-primary"
                  maxLength={255}
                  required
                />
                <p className="text-sm text-gray-400">
                  {title.length}/255 caracteres (mínimo 5)
                </p>
              </div>

              {/* Categoria */}
              <div className="space-y-2">
                <Label htmlFor="category" className="text-white">
                  Categoria *
                </Label>
                <Select value={category} onValueChange={setCategory} required>
                  <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                    <SelectValue placeholder="Selecione uma categoria..." />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-700 border-gray-600">
                    {categories.map((cat) => (
                      <SelectItem 
                        key={cat.value} 
                        value={cat.value}
                        className="text-white hover:bg-gray-600"
                      >
                        {cat.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Conteúdo */}
              <div className="space-y-2">
                <Label htmlFor="content" className="text-white">
                  Conteúdo *
                </Label>
                <Textarea
                  id="content"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Escreva o conteúdo do seu tópico aqui..."
                  className="bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-primary min-h-[200px]"
                  maxLength={5000}
                  required
                />
                <p className="text-sm text-gray-400">
                  {content.length}/5000 caracteres (mínimo 10)
                </p>
              </div>

              {/* Dicas */}
              <div className="bg-gray-700 border border-gray-600 rounded-lg p-4">
                <h3 className="text-white font-semibold mb-2">💡 Dicas para um bom tópico:</h3>
                <ul className="text-gray-300 text-sm space-y-1">
                  <li>• Use um título claro e específico</li>
                  <li>• Escolha a categoria mais adequada</li>
                  <li>• Seja respeitoso e construtivo</li>
                  <li>• Forneça contexto suficiente para discussão</li>
                  <li>• Evite spoilers sem aviso prévio</li>
                </ul>
              </div>

              {/* Botões */}
              <div className="flex justify-end space-x-4 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate('/forum')}
                  disabled={isSubmitting}
                >
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  disabled={isSubmitting || !title.trim() || !content.trim() || !category}
                  className="bg-primary hover:bg-primary/90"
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                      Criando...
                    </>
                  ) : (
                    <>
                      <Send className="h-4 w-4 mr-2" />
                      Criar Tópico
                    </>
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CreateTopicPage;

