
import React, { useState, useEffect } from 'react';
import { Users, Landmark, ArrowRight, Quote, Sparkles, Waves, ChevronLeft, ChevronRight, BookType, Calendar } from 'lucide-react';
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
      // No PC (lg) mostra 3, no tablet (md) 2, no mobile 1
      setItemsPerView(window.innerWidth >= 1024 ? 3 : window.innerWidth >= 768 ? 2 : 1);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const totalSlides = Math.max(0, Math.ceil(carouselItems.length / itemsPerView));

  const nextSlide = () => {
    if (totalSlides > 1) {
      setCurrentSlide(prev => (prev + 1) % totalSlides);
    }
  };

  const prevSlide = () => {
    if (totalSlides > 1) {
      setCurrentSlide(prev => (prev - 1 + totalSlides) % totalSlides);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      
      {/* 1. Cards de Estatísticas (Topo) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white p-8 rounded-[32px] shadow-sm border border-slate-50 flex items-center gap-6">
          <div className="bg-blue-50 p-4 rounded-2xl text-blue-600 shadow-inner"><Users size={24} /></div>
          <div>
            <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mb-1">Membros</p>
            <p className="text-3xl font-black text-slate-800">{membersCount}</p>
          </div>
        </div>
        <div className="bg-white p-8 rounded-[32px] shadow-sm border border-slate-50 flex items-center gap-6">
          <div className="bg-indigo-50 p-4 rounded-2xl text-indigo-600 shadow-inner"><Landmark size={24} /></div>
          <div>
            <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mb-1">Congregações</p>
            <p className="text-3xl font-black text-slate-800">{congsCount}</p>
          </div>
        </div>
        <div className="bg-white p-8 rounded-[32px] shadow-sm border border-slate-50 flex items-center gap-6 sm:col-span-2 lg:col-span-1">
          <div className="bg-cyan-50 p-4 rounded-2xl text-cyan-600 shadow-inner"><Waves size={24} /></div>
          <div>
            <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mb-1">Batismos {currentYear}</p>
            <p className="text-3xl font-black text-slate-800">{confirmedBaptismsCurrentYear}</p>
          </div>
        </div>
      </div>

      {/* 2. Devocional Destaque (Centro) */}
      <div className="bg-gradient-to-br from-blue-600 to-indigo-900 rounded-[40px] p-10 md:p-16 text-white relative overflow-hidden shadow-2xl">
        <div className="relative z-10 max-w-2xl">
          <div className="flex items-center gap-2 mb-6">
            <Sparkles size={16} className="text-blue-200" />
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-blue-100">Devocional de Hoje</span>
          </div>
          <Quote className="text-white/10 w-16 h-16 mb-6" />
          <h3 className="text-3xl md:text-4xl font-black mb-8 italic leading-tight tracking-tight">"{dailyVerse.text}"</h3>
          <p className="text-blue-200 text-sm font-bold uppercase tracking-widest mb-10">— {dailyVerse.ref}</p>
          <button onClick={() => onNavigate('devotional')} className="bg-white text-blue-700 px-10 py-4 rounded-2xl font-black uppercase text-xs tracking-widest flex items-center gap-2 hover:scale-105 transition-all shadow-xl active:scale-95">
            Ler Meditação Completa <ArrowRight size={16} />
          </button>
        </div>
        <div className="absolute top-0 right-0 w-80 h-80 bg-white/5 rounded-full blur-[100px] -mr-32 -mt-32" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-400/10 rounded-full blur-[80px] -ml-20 -mb-20" />
      </div>

      {/* 3. Atalhos Rápidos */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-8 md:p-10 rounded-[40px] border border-slate-50 flex items-center gap-6 md:gap-8 group hover:border-blue-200 hover:shadow-xl transition-all cursor-pointer" onClick={() => onNavigate('bible')}>
           <div className="bg-slate-900 text-white p-5 md:p-6 rounded-3xl group-hover:scale-110 group-hover:bg-blue-600 transition-all shadow-xl"><BookType size={32}/></div>
           <div>
              <h4 className="font-black text-slate-800 text-lg md:text-xl tracking-tight">Bíblia Online</h4>
              <p className="text-slate-400 text-xs md:text-sm font-medium mt-1">A Palavra de Deus sempre com você</p>
           </div>
        </div>
        <div className="bg-white p-8 md:p-10 rounded-[40px] border border-slate-50 flex items-center gap-6 md:gap-8 group hover:border-blue-200 hover:shadow-xl transition-all cursor-pointer" onClick={() => onNavigate('events')}>
           <div className="bg-blue-600 text-white p-5 md:p-6 rounded-3xl group-hover:scale-110 transition-all shadow-xl"><Calendar size={32}/></div>
           <div>
              <h4 className="font-black text-slate-800 text-lg md:text-xl tracking-tight">Próximos Cultos</h4>
              <p className="text-slate-400 text-xs md:text-sm font-medium mt-1">Veja a programação semanal</p>
           </div>
        </div>
      </div>

      {/* 4. Carrossel 9:16 (Inferior) */}
      {carouselItems.length > 0 && (
        <div className="space-y-6 pt-4">
          <div className="flex items-center justify-between px-2">
            <div>
              <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Cartazes & Banners</h3>
              <p className="text-[10px] text-slate-300 font-bold uppercase tracking-widest">Informações em Destaque</p>
            </div>
            {totalSlides > 1 && (
              <div className="flex gap-2">
                 <button onClick={prevSlide} className="p-2.5 bg-white rounded-full shadow-sm text-slate-400 hover:text-blue-600 hover:bg-slate-50 transition-all border border-slate-100"><ChevronLeft size={20}/></button>
                 <button onClick={nextSlide} className="p-2.5 bg-white rounded-full shadow-sm text-slate-400 hover:text-blue-600 hover:bg-slate-50 transition-all border border-slate-100"><ChevronRight size={20}/></button>
              </div>
            )}
          </div>
          
          <div className="relative overflow-hidden">
            <div 
              className="flex transition-transform duration-700 cubic-bezier(0.4, 0, 0.2, 1) gap-4" 
              style={{ transform: `translateX(-${currentSlide * 100}%)` }}
            >
              {carouselItems.map((item) => (
                <div 
                  key={item.id} 
                  className="flex-shrink-0"
                  style={{ width: `calc(${100 / itemsPerView}% - ${(itemsPerView - 1) * 16 / itemsPerView}px)` }}
                >
                  <div className="aspect-[9/16] w-full relative group rounded-[32px] overflow-hidden shadow-lg border border-slate-100 bg-slate-200">
                    <img src={item.imageUrl} alt={item.title || "Banner"} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                    {(item.title || item.link) && (
                      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent flex flex-col justify-end p-6 opacity-0 group-hover:opacity-100 transition-opacity">
                        <h4 className="text-white font-black text-lg tracking-tight leading-tight">{item.title}</h4>
                        {item.link && (
                          <a href={item.link} target="_blank" className="mt-3 inline-block bg-white text-blue-600 w-fit px-4 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest hover:bg-blue-50 transition-all">Ver Detalhes</a>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="flex justify-center gap-1.5 mt-4">
            {Array.from({ length: totalSlides }).map((_, i) => (
              <div key={i} className={`h-1 rounded-full transition-all ${currentSlide === i ? 'w-8 bg-blue-600' : 'w-2 bg-slate-200'}`} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default HomeTab;
