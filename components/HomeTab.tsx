
import React, { useState, useEffect } from 'react';
import { Users, Landmark, ArrowRight, Quote, Sparkles, Waves, ChevronLeft, ChevronRight } from 'lucide-react';
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

  const [itemsPerView, setItemsPerView] = useState(1);

  useEffect(() => {
    const handleResize = () => {
      setItemsPerView(window.innerWidth >= 1024 ? 3 : window.innerWidth >= 768 ? 2 : 1);
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
      }, 5000);
      return () => clearInterval(timer);
    }
  }, [totalSlides]);

  const nextSlide = () => setCurrentSlide(prev => (prev + 1) % totalSlides);
  const prevSlide = () => setCurrentSlide(prev => (prev - 1 + totalSlides) % totalSlides);

  return (
    <div className="space-y-6 md:space-y-10 animate-in fade-in slide-in-from-bottom-2 duration-700 pb-10">
      
      {/* 1. Estatísticas - Grade Mobile Responsiva */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-6">
        <div className="bg-white p-4 md:p-6 rounded-[24px] md:rounded-[32px] shadow-sm border border-slate-100 flex flex-col md:flex-row items-center md:items-center gap-2 md:gap-4 text-center md:text-left">
          <div className="bg-blue-50 p-2.5 rounded-xl text-blue-600">
            <Users size={20} />
          </div>
          <div>
            <p className="text-[8px] md:text-[10px] text-slate-400 font-black uppercase tracking-widest mb-0.5">Membros</p>
            <p className="text-lg md:text-2xl font-black text-slate-800">{membersCount}</p>
          </div>
        </div>
        <div className="bg-white p-4 md:p-6 rounded-[24px] md:rounded-[32px] shadow-sm border border-slate-100 flex flex-col md:flex-row items-center md:items-center gap-2 md:gap-4 text-center md:text-left">
          <div className="bg-indigo-50 p-2.5 rounded-xl text-indigo-600">
            <Landmark size={20} />
          </div>
          <div>
            <p className="text-[8px] md:text-[10px] text-slate-400 font-black uppercase tracking-widest mb-0.5">Congs.</p>
            <p className="text-lg md:text-2xl font-black text-slate-800">{congsCount}</p>
          </div>
        </div>
        <div className="col-span-2 md:col-span-1 bg-white p-4 md:p-6 rounded-[24px] md:rounded-[32px] shadow-sm border border-slate-100 flex flex-row items-center justify-center md:justify-start gap-4 text-left">
          <div className="bg-cyan-50 p-2.5 rounded-xl text-cyan-600">
            <Waves size={20} />
          </div>
          <div>
            <p className="text-[8px] md:text-[10px] text-slate-400 font-black uppercase tracking-widest mb-0.5">Batismos/{currentYear.slice(-2)}</p>
            <p className="text-lg md:text-2xl font-black text-slate-800">{confirmedBaptismsCurrentYear}</p>
          </div>
        </div>
      </div>

      {/* 2. Palavra e Agenda - Stacked Mobile */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="relative bg-gradient-to-br from-blue-600 to-indigo-900 rounded-[32px] p-6 md:p-8 text-white overflow-hidden shadow-lg min-h-[220px] flex flex-col justify-center">
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-3">
              <Sparkles size={14} className="text-blue-200" />
              <span className="text-[9px] font-black uppercase tracking-widest text-blue-100">Palavra do Dia</span>
            </div>
            <Quote className="text-white/10 w-6 h-6 mb-2" />
            <h3 className="text-base md:text-xl font-bold mb-3 leading-tight italic">"{dailyVerse.text}"</h3>
            <p className="text-blue-200 text-[10px] font-black uppercase tracking-widest mb-6">— {dailyVerse.ref}</p>
            <button 
              onClick={() => onNavigate('devotional')}
              className="w-full md:w-auto bg-white text-blue-700 px-6 py-3 rounded-2xl font-black flex items-center justify-center gap-2 hover:scale-105 transition-all text-[9px] uppercase tracking-widest"
            >
              Ler Devocional <ArrowRight size={14} />
            </button>
          </div>
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/5 rounded-full blur-3xl" />
        </div>

        <div className="space-y-3">
           <div className="flex justify-between items-center mb-1 px-1">
              <h3 className="text-[10px] font-black text-slate-800 uppercase tracking-widest">Agenda Semanal</h3>
              <button onClick={() => onNavigate('events')} className="text-blue-600 font-black text-[9px] uppercase tracking-widest">Ver tudo</button>
           </div>
           <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex gap-4 items-center">
              <div className="bg-blue-50 text-blue-600 w-10 h-10 rounded-xl flex-shrink-0 flex items-center justify-center font-black text-[10px]">DOM</div>
              <div className="flex-1">
                 <p className="font-bold text-slate-800 text-xs">Escola Dominical (EBD)</p>
                 <p className="text-[8px] text-slate-400 font-black uppercase">09:00 — Geral</p>
              </div>
           </div>
           <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex gap-4 items-center">
              <div className="bg-slate-900 text-white w-10 h-10 rounded-xl flex-shrink-0 flex items-center justify-center font-black text-[10px]">TER</div>
              <div className="flex-1">
                 <p className="font-bold text-slate-800 text-xs">Culto de Doutrina</p>
                 <p className="text-[8px] text-slate-400 font-black uppercase">19:30 — Sede</p>
              </div>
           </div>
        </div>
      </div>

      {/* 3. Carrossel Story Style - Otimizado Mobile */}
      {carouselItems.length > 0 && (
        <div className="space-y-4 pt-2">
          <div className="flex items-center justify-between px-1">
            <h3 className="text-[10px] font-black text-slate-800 uppercase tracking-widest">Destaques</h3>
            <div className="flex gap-2">
               <button onClick={prevSlide} className="p-1.5 bg-white border border-slate-100 rounded-full text-slate-400"><ChevronLeft size={16}/></button>
               <button onClick={nextSlide} className="p-1.5 bg-white border border-slate-100 rounded-full text-slate-400"><ChevronRight size={16}/></button>
            </div>
          </div>
          
          <div className="relative w-full overflow-hidden">
            <div 
              className="flex transition-transform duration-500 ease-in-out gap-4 px-1" 
              style={{ transform: `translateX(-${currentSlide * 100}%)` }}
            >
              {carouselItems.map((item) => (
                <div 
                  key={item.id} 
                  className={`relative flex-shrink-0 ${itemsPerView === 3 ? 'w-[calc(33.333%-11px)]' : itemsPerView === 2 ? 'w-[calc(50%-8px)]' : 'w-full'}`}
                >
                  <div className="aspect-[9/16] w-full overflow-hidden rounded-[28px] md:rounded-[40px] shadow-lg bg-slate-100 border border-slate-200 group relative">
                    <img 
                      src={item.imageUrl} 
                      alt={item.title || "Banner"} 
                      className="w-full h-full object-cover"
                    />
                    {(item.title || item.link) && (
                      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-5 text-center">
                        <p className="text-xs font-black text-white mb-2 leading-tight">{item.title}</p>
                        {item.link && (
                          <a href={item.link} target="_blank" className="inline-block bg-white text-slate-900 px-3 py-1.5 rounded-lg font-black text-[8px] uppercase tracking-widest">Abrir Link</a>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
          <p className="text-center text-slate-400 text-[8px] font-black uppercase tracking-[0.2em]">Deslize para ver os informativos</p>
        </div>
      )}
    </div>
  );
};

export default HomeTab;
