import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface NewsItem {
  id: number;
  title: string;
  category: 'Filme' | 'Série' | 'Jogo';
  imageUrl: string;
  excerpt: string;
  date: string;
}

const NewsCarousel: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const carouselRef = useRef<HTMLDivElement>(null);

  // Dados das notícias (você pode substituir por dados reais da API)
  const newsItems: NewsItem[] = [
    {
      id: 1,
      title: 'Wandinha retorna em 6 de Agosto',
      category: 'Série',
      imageUrl: 'wandinha.jpg',
      excerpt: 'Netflix libera trailer da nova temporada da série Wandinha.',
      date: '10/07/2025'
    },
    {
      id: 2,
      title: 'Duna: Parte 2 bate recorde de bilheteria no primeiro fim de semana',
      category: 'Filme',
      imageUrl: '/images/duna2.jpg',
      excerpt: 'Sequência do filme de Denis Villeneuve supera expectativas nas bilheterias globais.',
      date: '10/07/2025'
    },
    {
      id: 3,
      title: 'GTA VI tem data de lançamento anunciada oficialmente',
      category: 'Jogo',
      imageUrl: './images/gta6.jpg',
      excerpt: 'Rockstar confirma lançamento para 2025 com trailer espetacular.',
      date: '10/07/2025'
    },
    {
      id: 4,
      title: 'Stranger Things: Temporada final terá episódio extra longo',
      category: 'Série',
      imageUrl: '../src/images/stranger-things.jpg',
      excerpt: 'Produtores revelam detalhes sobre o aguardado final da série.',
      date: '10/07/2025'
    },
    {
      id: 5,
      title: 'Novo filme do Batman com Robert Pattinson ganha sequência confirmada',
      category: 'Filme',
      imageUrl: '/src/images/batman.jpg',
      excerpt: 'Estúdio anuncia The Batman Part II para 2026 com o mesmo elenco.',
      date: '10/07/2025'
    }
  ];

  // Configuração do carrossel automático
  useEffect(() => {
    const interval = setInterval(() => {
      if (!isPaused) {
        setCurrentIndex((prevIndex) => 
          prevIndex === newsItems.length - 1 ? 0 : prevIndex + 1
        );
      }
    }, 5000); // Muda a cada 5 segundos

    return () => clearInterval(interval);
  }, [isPaused, newsItems.length]);

  // Efeito para rolar o carrossel quando o índice muda
  useEffect(() => {
    if (carouselRef.current) {
      const itemWidth = carouselRef.current.children[0]?.clientWidth || 0;
      carouselRef.current.scrollTo({
        left: currentIndex * (itemWidth + 16), // 16px é o gap entre itens
        behavior: 'smooth'
      });
    }
  }, [currentIndex]);

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === newsItems.length - 1 ? 0 : prevIndex + 1
    );
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? newsItems.length - 1 : prevIndex - 1
    );
  };

  return (
    <section className="py-12 px-4 bg-gray-900/50">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl md:text-3xl font-bold text-white">
            Top 5 Notícias do Entretenimento
          </h2>
          <div className="flex gap-2">
            <button 
              onClick={prevSlide}
              className="p-2 rounded-full bg-gray-800 text-purple-400 hover:bg-purple-500/10 hover:text-white transition-colors"
              aria-label="Notícia anterior"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button 
              onClick={nextSlide}
              className="p-2 rounded-full bg-gray-800 text-purple-400 hover:bg-purple-500/10 hover:text-white transition-colors"
              aria-label="Próxima notícia"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div 
          ref={carouselRef}
          className="relative overflow-hidden"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          <div className="flex gap-4 overflow-x-auto scrollbar-hide pb-4">
            {newsItems.map((item) => (
              <div 
                key={item.id}
                className="flex-shrink-0 w-full sm:w-1/2 md:w-1/3 lg:w-1/4 xl:w-1/5"
              >
                <div className="news-card bg-gray-800 rounded-lg overflow-hidden border border-gray-700 hover:border-purple-500 transition-all h-full">
                  <div className="relative">
                    <img 
                      src={item.imageUrl} 
                      alt={item.title}
                      className="w-full h-40 object-cover"
                    />
                    <span className={`absolute top-2 left-2 px-2 py-1 rounded text-xs font-medium ${
                      item.category === 'Filme' ? 'bg-purple-600' : 
                      item.category === 'Série' ? 'bg-blue-600' : 'bg-green-600'
                    }`}>
                      {item.category}
                    </span>
                  </div>
                  <div className="p-4">
                    <div className="text-xs text-gray-400 mb-2">{item.date}</div>
                    <h3 className="text-lg font-semibold text-white mb-2 line-clamp-2">
                      {item.title}
                    </h3>
                    <p className="text-sm text-gray-400 mb-4 line-clamp-2">
                      {item.excerpt}
                    </p>
                    <Link 
                      to={`/noticias/${item.id}`} 
                      className="text-purple-400 hover:text-purple-300 text-sm font-medium flex items-center gap-1"
                    >
                      Ler mais <ChevronRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Indicadores de slide */}
      <div className="flex justify-center gap-2 mt-6">
        {newsItems.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`w-3 h-3 rounded-full transition-all ${
              index === currentIndex ? 'bg-purple-500 w-6' : 'bg-gray-700'
            }`}
            aria-label={`Ir para notícia ${index + 1}`}
          />
        ))}
      </div>
    </section>
  );
};

export default NewsCarousel;