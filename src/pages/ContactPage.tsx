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
    <div className="min-h-screen bg-gradient-to-b from-purple-900/20 to-background">
      <div className="container mx-auto px-4 py-12">
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Contact Form */}
          <div>
            <CardHeader className="px-0">
              <CardTitle className="text-3xl font-bold text-white mb-2">Fale Conosco</CardTitle>
              <p className="text-purple-200">
                Preencha o formulário abaixo ou utilize nossos outros canais de contato
              </p>
            </CardHeader>

            <Card className="bg-gray-800 border-gray-700">
              <CardContent className="p-6">
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                  <div>
                    <Label className="text-gray-300">Nome</Label>
                    <Input
                      className="bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                      {...register('name', { required: 'Nome é obrigatório' })}
                      placeholder="Seu nome completo"
                    />
                    {errors.name && <p className="text-sm text-red-400 mt-1">{errors.name.message}</p>}
                  </div>

                  <div>
                    <Label className="text-gray-300">Email</Label>
                    <Input
                      className="bg-gray-700 border-gray-600 text-white placeholder-gray-400"
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
                    {errors.email && <p className="text-sm text-red-400 mt-1">{errors.email.message}</p>}
                  </div>

                  <div>
                    <Label className="text-gray-300">Assunto</Label>
                    <select
                      className="flex h-10 w-full rounded-md border border-gray-600 bg-gray-700 px-3 py-2 text-sm text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                      {...register('subject', { required: 'Assunto é obrigatório' })}
                    >
                      <option value="">Selecione um assunto</option>
                      <option value="support">Suporte Técnico</option>
                      <option value="suggestion">Sugestão de Conteúdo</option>
                      <option value="partnership">Parcerias</option>
                      <option value="other">Outro</option>
                    </select>
                    {errors.subject && <p className="text-sm text-red-400 mt-1">{errors.subject.message}</p>}
                  </div>

                  <div>
                    <Label className="text-gray-300">Mensagem</Label>
                    <Textarea
                      className="bg-gray-700 border-gray-600 text-white placeholder-gray-400"
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
                    {errors.message && <p className="text-sm text-red-400 mt-1">{errors.message.message}</p>}
                  </div>

                  <Button 
                    type="submit" 
                    disabled={isSubmitting}
                    className="w-full bg-purple-600 hover:bg-purple-700 text-white"
                  >
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
              </CardContent>
            </Card>
          </div>

          {/* Contact Info */}
          <div className="space-y-6">
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-xl font-bold text-white">Outras Formas de Contato</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="bg-purple-600/20 p-3 rounded-full">
                    <Mail className="w-5 h-5 text-purple-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-white">Email</h3>
                    <p className="text-purple-400">mauri@myverse.com.br</p>
                    <p className="text-gray-400 text-sm mt-1">Respondemos em até 24h</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="bg-purple-600/20 p-3 rounded-full">
                    <Phone className="w-5 h-5 text-purple-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-white">Telefone</h3>
                    <p className="text-purple-400">(15) 99769-8979</p>
                    <p className="text-gray-400 text-sm mt-1">Seg-Sex, 9h às 18h</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="bg-purple-600/20 p-3 rounded-full">
                    <MapPin className="w-5 h-5 text-purple-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-white">Endereço</h3>
                    <p className="text-purple-400">Alameda Xingu, 512, Alphaville</p>
                    <p className="text-purple-400">Barueri - SP, 06454-050</p>
                  </div>
                </div>

                <div className="pt-4">
                  <h3 className="font-semibold text-purple-400 mb-3">Redes Sociais</h3>
                  <div className="flex gap-3">
                    {['Instagram', 'Twitter', 'LinkedIn'].map((social) => (
                      <Button 
                        key={social} 
                        variant="outline" 
                        size="sm"
                        className="border-gray-600 text-white hover:bg-gray-700"
                      >
                        {social}
                      </Button>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* FAQ Preview */}
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-xl font-bold text-white">Perguntas Frequentes</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {[
                  "Como criar uma conta?",
                  "Como adiciono conteúdo aos favoritos?",
                  "Como participar dos fóruns?",
                  "Quais são os requisitos para senha?"
                ].map((question, index) => (
                  <div key={index} className="border-b border-gray-700 pb-3 last:border-b-0">
                    <h4 className="font-medium text-white">{question}</h4>
                  </div>
                ))}
                <Button 
                  variant="link" 
                  className="pl-0 mt-2 text-purple-400 hover:text-purple-300"
                >
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