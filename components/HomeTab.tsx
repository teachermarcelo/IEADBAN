
import React, { useState, useEffect } from 'react';
/* Added BookType and Calendar to the imports from lucide-react */
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
    <div className="space-y-6 md:space-y-10 animate-in fade-in duration-700">
      
      {/* Estatísticas Mobile-First */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-50 flex items-center gap-4">
          <div className="bg-blue-50 p-3 rounded-2xl text-blue-600"><Users size={20} /></div>
          <div>
            <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">Membros</p>
            <p className="text-2xl font-black text-slate-800">{membersCount}</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-50 flex items-center gap-4">
          <div className="bg-indigo-50 p-3 rounded-2xl text-indigo-600"><Landmark size={20} /></div>
          <div>
            <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">Congregações</p>
            <p className="text-2xl font-black text-slate-800">{congsCount}</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-50 flex items-center gap-4">
          <div className="bg-cyan-50 p-3 rounded-2xl text-cyan-600"><Waves size={20} /></div>
          <div>
            <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">Batismos {currentYear}</p>
            <p className="text-2xl font-black text-slate-800">{confirmedBaptismsCurrentYear}</p>
          </div>
        </div>
      </div>

      {/* Destaque / Devocional Rapido */}
      <div className="bg-gradient-to-br from-blue-600 to-indigo-900 rounded-[40px] p-8 md:p-12 text-white relative overflow-hidden shadow-2xl">
        <div className="relative z-10 max-w-2xl">
          <div className="flex items-center gap-2 mb-4">
            <Sparkles size={16} className="text-blue-200" />
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-blue-100">Devocional de Hoje</span>
          </div>
          <Quote className="text-white/10 w-12 h-12 mb-4" />
          <h3 className="text-2xl md:text-3xl font-bold mb-6 italic leading-relaxed">"{dailyVerse.text}"</h3>
          <p className="text-blue-200 text-sm font-bold uppercase tracking-widest mb-8">— {dailyVerse.ref}</p>
          <button onClick={() => onNavigate('devotional')} className="bg-white text-blue-700 px-8 py-4 rounded-2xl font-black uppercase text-xs tracking-widest flex items-center gap-2 hover:scale-105 transition-all">
            Ler Meditação Completa <ArrowRight size={16} />
          </button>
        </div>
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -mr-20 -mt-20" />
      </div>

      {/* Carrossel de Banners Otimizado */}
      {carouselItems.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">Destaques & Eventos</h3>
            <div className="flex gap-2">
               <button onClick={prevSlide} className="p-2 bg-white rounded-full shadow-sm text-slate-400 hover:text-blue-600"><ChevronLeft size={18}/></button>
               <button onClick={nextSlide} className="p-2 bg-white rounded-full shadow-sm text-slate-400 hover:text-blue-600"><ChevronRight size={18}/></button>
            </div>
          </div>
          
          <div className="relative overflow-hidden rounded-[32px]">
            <div className="flex transition-transform duration-500 ease-in-out" style={{ transform: `translateX(-${currentSlide * 100}%)` }}>
              {carouselItems.map((item) => (
                <div key={item.id} className="w-full flex-shrink-0">
                  <div className="aspect-[16/9] md:aspect-[21/9] w-full relative group">
                    <img src={item.imageUrl} alt={item.title || "Banner"} className="w-full h-full object-cover" />
                    {item.title && (
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex flex-col justify-end p-8">
                        <h4 className="text-white font-black text-xl md:text-2xl">{item.title}</h4>
                        {item.link && <a href={item.link} target="_blank" className="mt-2 text-blue-400 text-xs font-bold uppercase tracking-widest">Saiba mais</a>}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Agenda Rápida */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-8 rounded-[40px] border border-slate-50 flex items-center gap-6 group hover:border-blue-200 transition-all cursor-pointer" onClick={() => onNavigate('bible')}>
           <div className="bg-slate-900 text-white p-5 rounded-3xl group-hover:scale-110 transition-transform"><BookType size={32}/></div>
           <div>
              <h4 className="font-black text-slate-800 text-lg">Bíblia Online</h4>
              <p className="text-slate-400 text-xs font-medium">Leia a Palavra em qualquer lugar</p>
           </div>
        </div>
        <div className="bg-white p-8 rounded-[40px] border border-slate-50 flex items-center gap-6 group hover:border-blue-200 transition-all cursor-pointer" onClick={() => onNavigate('events')}>
           <div className="bg-blue-600 text-white p-5 rounded-3xl group-hover:scale-110 transition-transform"><Calendar size={32}/></div>
           <div>
              <h4 className="font-black text-slate-800 text-lg">Próximos Cultos</h4>
              <p className="text-slate-400 text-xs font-medium">Não perca nossas programações</p>
           </div>
        </div>
      </div>
    </div>
  );
};

export default HomeTab;