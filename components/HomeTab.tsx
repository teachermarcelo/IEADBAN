
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
    <div className="space-y-8 animate-in fade-in duration-700">
      
      {/* Cards de Estatísticas - Layout dos Prints */}
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

      {/* Devocional Destaque - Identico ao Print */}
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

      {/* Banners - Otimizado para Mobile e Desktop conforme o Print */}
      {carouselItems.length > 0 && (
        <div className="space-y-6">
          <div className="flex items-center justify-between px-2">
            <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Destaques & Eventos</h3>
            <div className="flex gap-2">
               <button onClick={prevSlide} className="p-2.5 bg-white rounded-full shadow-sm text-slate-400 hover:text-blue-600 hover:bg-slate-50 transition-all"><ChevronLeft size={20}/></button>
               <button onClick={nextSlide} className="p-2.5 bg-white rounded-full shadow-sm text-slate-400 hover:text-blue-600 hover:bg-slate-50 transition-all"><ChevronRight size={20}/></button>
            </div>
          </div>
          
          <div className="relative overflow-hidden rounded-[40px] shadow-lg border border-slate-100 bg-white">
            <div className="flex transition-transform duration-700 cubic-bezier(0.4, 0, 0.2, 1)" style={{ transform: `translateX(-${currentSlide * 100}%)` }}>
              {carouselItems.map((item) => (
                <div key={item.id} className="w-full flex-shrink-0">
                  <div className="aspect-[16/9] md:aspect-[21/8] w-full relative group">
                    <img src={item.imageUrl} alt={item.title || "Banner"} className="w-full h-full object-cover" />
                    {(item.title || item.link) && (
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-8 md:p-12">
                        <h4 className="text-white font-black text-2xl md:text-3xl tracking-tight max-w-xl">{item.title}</h4>
                        {item.link && (
                          <a href={item.link} target="_blank" className="mt-4 inline-block bg-blue-600 text-white w-fit px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-blue-500 transition-all">Saiba mais</a>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Atalhos Rápidos */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-10 rounded-[40px] border border-slate-50 flex items-center gap-8 group hover:border-blue-200 hover:shadow-xl transition-all cursor-pointer" onClick={() => onNavigate('bible')}>
           <div className="bg-slate-900 text-white p-6 rounded-3xl group-hover:scale-110 group-hover:bg-blue-600 transition-all shadow-xl"><BookType size={36}/></div>
           <div>
              <h4 className="font-black text-slate-800 text-xl tracking-tight">Bíblia Online</h4>
              <p className="text-slate-400 text-sm font-medium mt-1">A Palavra de Deus sempre com você</p>
           </div>
        </div>
        <div className="bg-white p-10 rounded-[40px] border border-slate-50 flex items-center gap-8 group hover:border-blue-200 hover:shadow-xl transition-all cursor-pointer" onClick={() => onNavigate('events')}>
           <div className="bg-blue-600 text-white p-6 rounded-3xl group-hover:scale-110 transition-all shadow-xl"><Calendar size={36}/></div>
           <div>
              <h4 className="font-black text-slate-800 text-xl tracking-tight">Próximos Cultos</h4>
              <p className="text-slate-400 text-sm font-medium mt-1">Veja a programação e não perca nada</p>
           </div>
        </div>
      </div>
    </div>
  );
};

export default HomeTab;
