import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';
import { Label } from '../components/ui/label';
import { Mail, Phone, MapPin, Send } from 'lucide-react';
import toast from 'react-hot-toast';

type FormData = {
  name: string;
  email: string;
  subject: string;
  message: string;
};

const ContactPage: React.FC = () => {
  const { register, handleSubmit, formState: { errors }, reset } = useForm<FormData>();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const onSubmit = async () => {
    setIsSubmitting(true);
    try {
      // Simular envio
      await new Promise(resolve => setTimeout(resolve, 1500));
      toast.success('Mensagem enviada com sucesso!');
      reset();
    } catch (error) {
      toast.error('Erro ao enviar mensagem. Tente novamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="myverse-container myverse-section">
        <div className="grid lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <div>
            <CardHeader className="px-0">
              <CardTitle className="myverse-heading-2">Fale Conosco</CardTitle>
              <p className="text-muted-foreground">
                Preencha o formulário abaixo ou utilize nossos outros canais de contato
              </p>
            </CardHeader>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <Label htmlFor="name">Nome</Label>
                <Input
                  id="name"
                  {...register('name', { required: 'Nome é obrigatório' })}
                  placeholder="Seu nome completo"
                />
                {errors.name && <p className="text-sm text-destructive mt-1">{errors.name.message}</p>}
              </div>

              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  {...register('email', { 
                    required: 'Email é obrigatório',
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: 'Email inválido'
                    }
                  })}
                  placeholder="seu@email.com"
                />
                {errors.email && <p className="text-sm text-destructive mt-1">{errors.email.message}</p>}
              </div>

              <div>
                <Label htmlFor="subject">Assunto</Label>
                <select
                  id="subject"
                  {...register('subject', { required: 'Assunto é obrigatório' })}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <option value="">Selecione um assunto</option>
                  <option value="support">Suporte Técnico</option>
                  <option value="suggestion">Sugestão de Conteúdo</option>
                  <option value="partnership">Parcerias</option>
                  <option value="other">Outro</option>
                </select>
                {errors.subject && <p className="text-sm text-destructive mt-1">{errors.subject.message}</p>}
              </div>

              <div>
                <Label htmlFor="message">Mensagem</Label>
                <Textarea
                  id="message"
                  {...register('message', { 
                    required: 'Mensagem é obrigatória',
                    minLength: {
                      value: 20,
                      message: 'Mensagem deve ter pelo menos 20 caracteres'
                    }
                  })}
                  placeholder="Escreva sua mensagem aqui..."
                  rows={5}
                />
                {errors.message && <p className="text-sm text-destructive mt-1">{errors.message.message}</p>}
              </div>

              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <span className="animate-spin mr-2">↻</span>
                    Enviando...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4 mr-2" />
                    Enviar Mensagem
                  </>
                )}
              </Button>
            </form>
          </div>

          {/* Contact Info */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle className="myverse-heading-3">Outras Formas de Contato</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="bg-primary/10 p-3 rounded-full">
                    <Mail className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Email</h3>
                    <p className="text-muted-foreground">contato@myverse.com.br</p>
                    <p className="text-muted-foreground text-sm mt-1">Respondemos em até 24h</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="bg-primary/10 p-3 rounded-full">
                    <Phone className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Telefone</h3>
                    <p className="text-muted-foreground">(11) 98765-4321</p>
                    <p className="text-muted-foreground text-sm mt-1">Seg-Sex, 9h às 18h</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="bg-primary/10 p-3 rounded-full">
                    <MapPin className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Endereço</h3>
                    <p className="text-muted-foreground">Av. Paulista, 1000</p>
                    <p className="text-muted-foreground">São Paulo - SP, 01310-100</p>
                  </div>
                </div>

                <div className="pt-4">
                  <h3 className="font-semibold mb-3">Redes Sociais</h3>
                  <div className="flex gap-4">
                    {['Instagram', 'Twitter', 'LinkedIn', 'Facebook'].map((social) => (
                      <Button key={social} variant="outline" size="sm">
                        {social}
                      </Button>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* FAQ Preview */}
            <Card className="mt-6">
              <CardHeader>
                <CardTitle className="myverse-heading-3">Perguntas Frequentes</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {[
                  "Como criar uma conta?",
                  "Como adiciono conteúdo aos favoritos?",
                  "Como participar dos fóruns?",
                  "Quais são os requisitos para senha?"
                ].map((question, index) => (
                  <div key={index} className="border-b pb-3 last:border-b-0">
                    <h4 className="font-medium">{question}</h4>
                  </div>
                ))}
                <Button variant="link" className="pl-0 mt-2">
                  Ver todas as perguntas →
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;