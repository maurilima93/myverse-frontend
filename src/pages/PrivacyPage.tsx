import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from '../components/ui/button';
import { Shield, Lock, Database, Server } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const PrivacyPage: React.FC = () => {
  const navigate = useNavigate();

  const sections = [
    {
      title: "1. Informações que Coletamos",
      content: [
        "Coletamos informações que você nos fornece diretamente, como nome, e-mail e dados de perfil quando se cadastra.",
        "Automaticamente coletamos dados de uso através de cookies e tecnologias similares.",
        "Podemos receber informações de terceiros como redes sociais quando você se conecta através delas."
      ]
    },
    {
      title: "2. Como Usamos Suas Informações",
      content: [
        "Para fornecer, operar e manter nossos serviços",
        "Para melhorar e personalizar sua experiência",
        "Para comunicação sobre atualizações e novidades",
        "Para análise e desenvolvimento de novos recursos"
      ]
    },
    {
      title: "3. Compartilhamento de Dados",
      content: [
        "Não vendemos suas informações pessoais.",
        "Podemos compartilhar dados com provedores de serviços que nos auxiliam na operação da plataforma.",
        "Podemos divulgar informações quando exigido por lei ou para proteger nossos direitos."
      ]
    },
    {
      title: "4. Segurança de Dados",
      content: [
        "Implementamos medidas de segurança técnicas e organizacionais adequadas.",
        "Utilizemos criptografia para proteger dados sensíveis.",
        "Apesar de nossos esforços, nenhum sistema de segurança é 100% invulnerável."
      ]
    },
    {
      title: "5. Seus Direitos",
      content: [
        "Acessar, corrigir ou deletar suas informações pessoais",
        "Obter uma cópia dos seus dados pessoais",
        "Restringir ou opor-se ao processamento de seus dados",
        "Retirar consentimento a qualquer momento"
      ]
    },
    {
      title: "6. Alterações nesta Política",
      content: [
        "Podemos atualizar esta política periodicamente.",
        "Notificaremos sobre mudanças significativas.",
        "O uso contínuo da plataforma após alterações constitui aceitação da nova política."
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-900/20 to-background">
      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">Política de Privacidade</h1>
          <p className="text-purple-200">
            Última atualização: 15 de Janeiro de 2024
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            <Card className="bg-gray-800 border-gray-700">
              <CardContent className="p-6">
                <p className="mb-6 text-gray-300">
                  Na MyVerse, levamos sua privacidade a sério. Esta política descreve como coletamos,
                  usamos e protegemos suas informações quando você utiliza nossos serviços.
                </p>

                {sections.map((section, index) => (
                  <div key={index} className="mb-8 last:mb-0">
                    <h2 className="text-xl font-bold text-white mb-4">{section.title}</h2>
                    <ul className="space-y-3">
                      {section.content.map((item, itemIndex) => (
                        <li key={itemIndex} className="flex items-start text-gray-400">
                          <span className="inline-block mr-2 mt-1">•</span>
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}

                <div className="border-t border-gray-700 pt-6">
                  <p className="text-gray-300">
                    Se tiver dúvidas sobre esta política ou sobre como tratamos seus dados pessoais,
                    entre em contato através do nosso <Button 
                      variant="link" 
                      className="px-0 text-purple-400 hover:text-purple-300"
                      onClick={() => navigate('/contact')}
                    >
                      formulário de contato
                    </Button>.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                  <Shield className="w-5 h-5 text-purple-400" />
                  <span>Proteção de Dados</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <Lock className="w-5 h-5 text-purple-400 mt-0.5 flex-shrink-0" />
                    <div>
                      <h3 className="font-medium text-white mb-1">Criptografia</h3>
                      <p className="text-gray-400 text-sm">
                        Todos os dados sensíveis são criptografados em trânsito e em repouso.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Database className="w-5 h-5 text-purple-400 mt-0.5 flex-shrink-0" />
                    <div>
                      <h3 className="font-medium text-white mb-1">Armazenamento Seguro</h3>
                      <p className="text-gray-400 text-sm">
                        Seus dados são armazenados em servidores com altos padrões de segurança.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Server className="w-5 h-5 text-purple-400 mt-0.5 flex-shrink-0" />
                    <div>
                      <h3 className="font-medium text-white mb-1">Conformidade</h3>
                      <p className="text-gray-400 text-sm">
                        Seguimos as melhores práticas e regulamentações aplicáveis.
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">Controle Seus Dados</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-gray-400 text-sm">
                  Você tem o direito de acessar, corrigir ou excluir suas informações pessoais a qualquer momento.
                </p>
                <Button 
                  variant="outline" 
                  className="w-full border-gray-600 text-white hover:bg-gray-700"
                >
                  Gerenciar Preferências
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full border-gray-600 text-white hover:bg-gray-700"
                >
                  Solicitar Dados
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">Termos de Serviço</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-400 text-sm mb-4">
                  Além da nossa Política de Privacidade, recomendamos que você leia nossos Termos de Serviço.
                </p>
                <Button 
                  variant="outline" 
                  className="w-full border-gray-600 text-white hover:bg-gray-700"
                >
                  Ler Termos de Serviço
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPage;