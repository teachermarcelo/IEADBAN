
import React, { useState, useEffect } from 'react';
import { Users, Landmark, Heart, ArrowRight, Quote, Sparkles, Waves, ChevronLeft, ChevronRight } from 'lucide-react';
import { TabType, Baptism, CarouselItem } from '../types';

interface HomeTabProps {
  membersCount: number;
  congsCount: number;
  baptisms: Baptism[];
  carouselItems: CarouselItem[];
  onNavigate: (tab: TabType) => void;
}

const HomeTab: React.FC<HomeTabProps> = ({ membersCount, congsCount, baptisms, carouselItems, onNavigate }) => {
  const [dailyVerse] = useState({ text: "O Senhor é o meu pastor; nada me faltará.", ref: "Salmos 23:1" });
  const [currentSlide, setCurrentSlide] = useState(0);
  
  const currentYear = new Date().getFullYear().toString();
  const confirmedBaptismsCurrentYear = baptisms.filter(b => b.status === 'confirmado' && b.baptismDate.startsWith(currentYear)).length;

  // Cálculo de visibilidade baseado no tamanho da tela (Mobile: 1, Tablet/PC: 3)
  const [itemsPerView, setItemsPerView] = useState(1);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setItemsPerView(3);
      } else {
        setItemsPerView(1);
      }
    };
    
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const totalSlides = Math.ceil(carouselItems.length / itemsPerView);

  useEffect(() => {
    if (totalSlides > 1) {
      const timer = setInterval(() => {
        setCurrentSlide(prev => (prev + 1) % totalSlides);
      }, 6000);
      return () => clearInterval(timer);
    }
  }, [totalSlides]);

  const nextSlide = () => setCurrentSlide(prev => (prev + 1) % totalSlides);
  const prevSlide = () => setCurrentSlide(prev => (prev - 1 + totalSlides) % totalSlides);

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-top-4 duration-1000 pb-10">
      
      {/* 1. Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
        <div className="bg-white p-6 rounded-[32px] shadow-sm border border-slate-100 flex items-center gap-4 group hover:shadow-md transition-all">
          <div className="bg-blue-50 p-3 rounded-2xl text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-all">
            <Users size={24} />
          </div>
          <div>
            <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest leading-none mb-1">Membros</p>
            <p className="text-xl md:text-2xl font-black text-slate-800">{membersCount}</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-[32px] shadow-sm border border-slate-100 flex items-center gap-4 group hover:shadow-md transition-all">
          <div className="bg-indigo-50 p-3 rounded-2xl text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-all">
            <Landmark size={24} />
          </div>
          <div>
            <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest leading-none mb-1">Congregações</p>
            <p className="text-xl md:text-2xl font-black text-slate-800">{congsCount}</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-[32px] shadow-sm border border-slate-100 flex items-center gap-4 group hover:shadow-md transition-all">
          <div className="bg-cyan-50 p-3 rounded-2xl text-cyan-600 group-hover:bg-cyan-600 group-hover:text-white transition-all">
            <Waves size={24} />
          </div>
          <div>
            <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest leading-none mb-1">Batismos/{currentYear.slice(-2)}</p>
            <p className="text-xl md:text-2xl font-black text-slate-800">{confirmedBaptismsCurrentYear}</p>
          </div>
        </div>
      </div>

      {/* 2. Palavra e Agenda */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="relative bg-gradient-to-br from-blue-600 to-indigo-900 rounded-[32px] p-8 text-white overflow-hidden shadow-lg">
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-4">
              <Sparkles size={16} className="text-blue-200" />
              <span className="text-[10px] font-black uppercase tracking-widest text-blue-100">Palavra do Dia</span>
            </div>
            <Quote className="text-white/20 w-8 h-8 mb-4" />
            <h3 className="text-lg md:text-xl font-bold mb-4 leading-relaxed italic">"{dailyVerse.text}"</h3>
            <p className="text-blue-200 text-xs font-black uppercase tracking-widest mb-8">— {dailyVerse.ref}</p>
            <button 
              onClick={() => onNavigate('devotional')}
              className="bg-white text-blue-700 px-6 py-3 rounded-2xl font-black flex items-center gap-2 hover:scale-105 transition-all text-[10px] uppercase tracking-widest"
            >
              Ler Devocional <ArrowRight size={14} />
            </button>
          </div>
          <div className="absolute top-0 right-0 w-48 h-48 bg-white/5 rounded-full -mr-16 -mt-16 blur-3xl" />
        </div>

        <div className="space-y-4">
           <div className="flex justify-between items-center mb-1 px-2">
              <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest">Agenda Semanal</h3>
              <button 
                onClick={() => onNavigate('events')}
                className="text-blue-600 font-black text-[9px] uppercase tracking-widest"
              >
                Ver tudo
              </button>
           </div>
           <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex gap-4 items-center">
              <div className="bg-blue-50 text-blue-600 w-10 h-10 rounded-xl flex items-center justify-center font-black text-xs">DOM</div>
              <div className="flex-1">
                 <p className="font-bold text-slate-800 text-sm">EBD - Escola Dominical</p>
                 <p className="text-[9px] text-slate-400 font-black uppercase">09:00 — Geral</p>
              </div>
           </div>
           <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex gap-4 items-center">
              <div className="bg-slate-900 text-white w-10 h-10 rounded-xl flex items-center justify-center font-black text-xs">TER</div>
              <div className="flex-1">
                 <p className="font-bold text-slate-800 text-sm">Culto de Doutrina</p>
                 <p className="text-[9px] text-slate-400 font-black uppercase">19:30 — Sede</p>
              </div>
           </div>
        </div>
      </div>

      {/* 3. Carrossel Multivisualização (Story Style) */}
      {carouselItems.length > 0 && (
        <div className="space-y-6 pt-4">
          <div className="flex items-center justify-between px-2">
            <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest">Destaques & Avisos</h3>
            <div className="flex gap-2">
               <button onClick={prevSlide} className="p-2 bg-white border border-slate-100 rounded-full text-slate-400 hover:text-blue-600 transition-all shadow-sm"><ChevronLeft size={16}/></button>
               <button onClick={nextSlide} className="p-2 bg-white border border-slate-100 rounded-full text-slate-400 hover:text-blue-600 transition-all shadow-sm"><ChevronRight size={16}/></button>
            </div>
          </div>
          
          <div className="relative w-full overflow-hidden">
            <div 
              className="flex transition-transform duration-700 ease-in-out gap-4 px-2" 
              style={{ transform: `translateX(-${currentSlide * 100}%)` }}
            >
              {carouselItems.map((item) => (
                <div 
                  key={item.id} 
                  className={`relative flex-shrink-0 ${itemsPerView === 3 ? 'w-[calc(33.333%-11px)]' : 'w-full'}`}
                >
                  <div className="aspect-[9/16] w-full overflow-hidden rounded-[32px] md:rounded-[40px] shadow-xl bg-slate-900 border border-slate-200 group relative">
                    <img 
                      src={item.imageUrl} 
                      alt={item.title || "Banner"} 
                      className="w-full h-full object-contain"
                    />
                    
                    {item.title && (
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex flex-col justify-end p-6 text-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <h2 className="text-sm md:text-lg font-black text-white tracking-tight mb-3">
                          {item.title}
                        </h2>
                        {item.link && (
                          <a 
                            href={item.link} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="mx-auto bg-white text-slate-900 px-4 py-2 rounded-xl font-black text-[9px] uppercase tracking-widest hover:bg-blue-600 hover:text-white transition-all"
                          >
                            Saiba Mais
                          </a>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {totalSlides > 1 && (
              <div className="flex justify-center gap-2 mt-6">
                {Array.from({ length: totalSlides }).map((_, i) => (
                  <button 
                    key={i} 
                    onClick={() => setCurrentSlide(i)}
                    className={`h-1.5 rounded-full transition-all ${currentSlide === i ? 'bg-blue-600 w-8' : 'bg-slate-200 w-2'}`} 
                  />
                ))}
              </div>
            )}
          </div>
          <p className="text-center text-slate-400 text-[9px] font-black uppercase tracking-[0.2em]">Deslize para ver os informativos</p>
        </div>
      )}
    </div>
  );
};

export default HomeTab;
