
import React, { useState, useEffect } from 'react';
import { CheckCircle2, Circle, Trophy, Calendar, RefreshCcw } from 'lucide-react';

interface ReadingDay {
  day: number;
  books: string;
  isRead: boolean;
}

const ReadingPlanTab: React.FC = () => {
  const [days, setDays] = useState<ReadingDay[]>([]);
  const LOCAL_STORAGE_KEY = 'ieadban_reading_plan_v1';

  useEffect(() => {
    // Busca dados salvos no localStorage do DISPOSITIVO específico
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (saved) {
      setDays(JSON.parse(saved));
    } else {
      // Plano básico de 180 dias (amostra de expansão)
      const initial: ReadingDay[] = Array.from({ length: 180 }, (_, i) => ({
        day: i + 1,
        books: getReadingReference(i + 1),
        isRead: false
      }));
      setDays(initial);
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(initial));
    }
  }, []);

  const getReadingReference = (day: number) => {
    const refs = [
      "Gênesis 1-3", "Gênesis 4-6", "Gênesis 7-9", "Gênesis 10-12", "Gênesis 13-15",
      "Mateus 1-2", "Mateus 3-4", "Mateus 5-7", "Mateus 8-9", "Mateus 10-12",
      "Salmos 1-5", "Salmos 6-10", "Provérbios 1", "Provérbios 2", "Provérbios 3"
    ];
    return refs[(day - 1) % refs.length];
  };

  const toggleDay = (dayNum: number) => {
    const updated = days.map(d => d.day === dayNum ? { ...d, isRead: !d.isRead } : d);
    setDays(updated);
    // Salva instantaneamente no localStorage para garantir persistência total
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
  };

  const resetPlan = () => {
    if (confirm("Deseja resetar todo o seu progresso de leitura?")) {
      const reset = days.map(d => ({ ...d, isRead: false }));
      setDays(reset);
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(reset));
    }
  };

  const progress = Math.round((days.filter(d => d.isRead).length / days.length) * 100) || 0;

  return (
    <div className="space-y-10 animate-in fade-in duration-1000">
      <div className="bg-white p-10 rounded-[48px] border border-slate-100 shadow-sm flex flex-col md:flex-row items-center gap-10">
        <div className="relative w-40 h-40 flex-shrink-0">
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
            <circle cx="18" cy="18" r="16" fill="none" className="text-slate-50 stroke-current" strokeWidth="2.5" />
            <circle cx="18" cy="18" r="16" fill="none" className="text-emerald-500 stroke-current" strokeWidth="2.5" strokeDasharray={`${progress} 100`} strokeLinecap="round" />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-4xl font-black text-slate-800 tracking-tighter">{progress}%</span>
            <span className="text-[9px] text-slate-400 font-black uppercase tracking-widest">Concluído</span>
          </div>
        </div>
        
        <div className="flex-1 text-center md:text-left space-y-4">
          <div>
            <h3 className="text-3xl font-black text-slate-800 tracking-tight">Crescimento Diário</h3>
            <p className="text-slate-400 font-medium leading-relaxed max-w-lg mt-1">Seu progresso é salvo automaticamente neste dispositivo. Continue firme na meditação!</p>
          </div>
          
          <div className="flex flex-wrap gap-6 justify-center md:justify-start">
            <div className="flex items-center gap-3">
              <div className="bg-blue-50 p-2 rounded-xl text-blue-600"><Calendar size={20} /></div>
              <div>
                <p className="text-xs font-black text-slate-800">{days.length} Dias</p>
                <p className="text-[9px] font-bold text-slate-400 uppercase">Duração Total</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="bg-emerald-50 p-2 rounded-xl text-emerald-600"><Trophy size={20} /></div>
              <div>
                <p className="text-xs font-black text-slate-800">{days.filter(d => d.isRead).length} Lidos</p>
                <p className="text-[9px] font-bold text-slate-400 uppercase">Conquistas</p>
              </div>
            </div>
            <button 
              onClick={resetPlan}
              className="flex items-center gap-2 text-[10px] font-black text-rose-500 uppercase tracking-widest hover:bg-rose-50 px-4 py-2 rounded-xl transition-all"
            >
              <RefreshCcw size={14} /> Reiniciar Plano
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {days.map((d) => (
          <button
            key={d.day}
            onClick={() => toggleDay(d.day)}
            className={`p-6 rounded-3xl border transition-all flex items-center justify-between group relative overflow-hidden ${
              d.isRead 
                ? 'bg-emerald-50 border-emerald-100 shadow-sm' 
                : 'bg-white border-slate-100 hover:border-blue-500 hover:shadow-xl'
            }`}
          >
            <div className="text-left relative z-10">
              <span className={`text-[10px] font-black uppercase tracking-[0.2em] ${d.isRead ? 'text-emerald-500' : 'text-slate-300'}`}>
                DIA {d.day}
              </span>
              <p className={`font-black text-lg tracking-tight mt-1 ${d.isRead ? 'text-emerald-900 line-through opacity-60' : 'text-slate-800'}`}>{d.books}</p>
            </div>
            <div className="relative z-10">
              {d.isRead ? (
                <div className="bg-emerald-500 text-white p-2 rounded-xl shadow-lg shadow-emerald-200">
                  <CheckCircle2 size={20} />
                </div>
              ) : (
                <div className="bg-slate-50 text-slate-200 p-2 rounded-xl group-hover:bg-blue-600 group-hover:text-white transition-all">
                  <Circle size={20} />
                </div>
              )}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default ReadingPlanTab;
