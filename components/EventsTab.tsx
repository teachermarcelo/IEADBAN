
import React, { useState } from 'react';
import { Calendar, Clock, MapPin, Plus, X, Trash2, Edit2, ShieldCheck, Lock, ExternalLink, Megaphone, Bell, KeyRound, Save, GripVertical, Image as ImageIcon, Camera } from 'lucide-react';
import { Event, WeeklyCult, ChurchNotice, CarouselItem } from '../types';

interface EventsTabProps {
  events: Event[];
  weeklyCults: WeeklyCult[];
  notices: ChurchNotice[];
  carouselItems: CarouselItem[];
  onSaveEvent: (e: Event) => void;
  onDeleteEvent: (id: string) => void;
  onSaveCult: (c: WeeklyCult) => void;
  onDeleteCult: (id: string) => void;
  onSaveNotice: (n: ChurchNotice) => void;
  onDeleteNotice: (id: string) => void;
  onSaveCarouselItem: (item: CarouselItem) => void;
  onDeleteCarouselItem: (id: string) => void;
  onReorderCults?: (newList: WeeklyCult[]) => void;
}

const EventsTab: React.FC<EventsTabProps> = ({ 
  events, weeklyCults, notices, carouselItems,
  onSaveEvent, onDeleteEvent, onSaveCult, onDeleteCult, onSaveNotice, onDeleteNotice,
  onSaveCarouselItem, onDeleteCarouselItem, onReorderCults
}) => {
  const [isAdminMode, setIsAdminMode] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showSecurityModal, setShowSecurityModal] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');
  const [error, setError] = useState('');
  const [draggedItemIndex, setDraggedItemIndex] = useState<number | null>(null);

  const AGENDA_PASS_KEY = 'ieadban_agenda_pass';
  const [currentPass, setCurrentPass] = useState(localStorage.getItem(AGENDA_PASS_KEY) || '123456');
  const [newPass, setNewPass] = useState('');

  const [modalType, setModalType] = useState<'event' | 'cult' | 'notice' | 'carousel' | null>(null);
  const [editingItem, setEditingItem] = useState<any>(null);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordInput === currentPass) {
      setIsAdminMode(true);
      setShowLoginModal(false);
      setPasswordInput('');
      setError('');
    } else {
      setError('Senha incorreta.');
    }
  };

  const handleUpdatePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPass.length < 4) { alert('Mínimo 4 dígitos.'); return; }
    localStorage.setItem(AGENDA_PASS_KEY, newPass);
    setCurrentPass(newPass);
    setShowSecurityModal(false);
    setNewPass('');
    alert('Senha atualizada!');
  };

  const onDragStart = (index: number) => { if (isAdminMode) setDraggedItemIndex(index); };

  const onDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (draggedItemIndex === null || draggedItemIndex === index) return;
    const newList = [...weeklyCults];
    const draggedItem = newList[draggedItemIndex];
    newList.splice(draggedItemIndex, 1);
    newList.splice(index, 0, draggedItem);
    if (onReorderCults) onReorderCults(newList);
    setDraggedItemIndex(index);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setEditingItem({ ...editingItem, imageUrl: reader.result as string });
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="space-y-12 animate-in fade-in duration-700 pb-16">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 bg-white p-10 rounded-[48px] border border-slate-100 shadow-sm relative overflow-hidden">
        <div>
          <h2 className="text-4xl font-black text-slate-800 tracking-tight">Agenda & Admin</h2>
          <p className="text-slate-400 font-bold text-xs uppercase tracking-widest mt-2 flex items-center gap-2">
            <Bell size={14} className="text-blue-500" /> Informativos Oficiais IEADBAN
          </p>
        </div>
        <div className="flex flex-wrap gap-4 relative z-10">
          {!isAdminMode ? (
            <button onClick={() => setShowLoginModal(true)} className="bg-slate-900 text-white px-8 py-4 rounded-3xl font-black text-xs uppercase tracking-widest flex items-center gap-3 hover:bg-slate-800 transition-all shadow-xl shadow-slate-200">
              <ShieldCheck size={18} className="text-blue-400" /> Agenda Admin
            </button>
          ) : (
            <div className="flex flex-wrap gap-2">
               <button onClick={() => { setEditingItem({}); setModalType('carousel'); }} className="bg-rose-600 text-white px-5 py-3 rounded-2xl font-black text-[9px] uppercase tracking-widest flex items-center gap-2 hover:bg-rose-700"><Camera size={14}/> Carrossel</button>
               <button onClick={() => { setEditingItem({}); setModalType('event'); }} className="bg-blue-600 text-white px-5 py-3 rounded-2xl font-black text-[9px] uppercase tracking-widest flex items-center gap-2 hover:bg-blue-700"><Plus size={14}/> Evento</button>
               <button onClick={() => { setEditingItem({}); setModalType('notice'); }} className="bg-emerald-600 text-white px-5 py-3 rounded-2xl font-black text-[9px] uppercase tracking-widest flex items-center gap-2 hover:bg-emerald-700"><Plus size={14}/> Aviso</button>
               <button onClick={() => { setEditingItem({}); setModalType('cult'); }} className="bg-indigo-600 text-white px-5 py-3 rounded-2xl font-black text-[9px] uppercase tracking-widest flex items-center gap-2 hover:bg-indigo-700"><Plus size={14}/> Escala</button>
               <button onClick={() => setShowSecurityModal(true)} className="bg-slate-100 text-slate-600 px-5 py-3 rounded-2xl font-black text-[9px] uppercase tracking-widest flex items-center gap-2 hover:bg-slate-200"><KeyRound size={14}/></button>
               <button onClick={() => setIsAdminMode(false)} className="bg-rose-50 text-rose-600 px-5 py-3 rounded-2xl font-black text-[9px] uppercase tracking-widest flex items-center gap-2"><X size={14}/></button>
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        <div className="lg:col-span-8 space-y-12">
          {isAdminMode && (
            <div className="space-y-6">
              <h3 className="text-2xl font-black text-slate-800 flex items-center gap-3"><Camera size={24} className="text-rose-500" /> Gerenciar Carrossel</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {carouselItems.map(item => (
                  <div key={item.id} className="relative aspect-[4/3] rounded-3xl overflow-hidden border border-slate-100 shadow-sm group">
                    <img src={item.imageUrl} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                       <button onClick={() => { setEditingItem(item); setModalType('carousel'); }} className="p-3 bg-white text-blue-600 rounded-xl"><Edit2 size={16}/></button>
                       <button onClick={() => onDeleteCarouselItem(item.id)} className="p-3 bg-white text-rose-600 rounded-xl"><Trash2 size={16}/></button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="space-y-6">
            <h3 className="text-2xl font-black text-slate-800 flex items-center gap-3"><Megaphone size={24} className="text-emerald-500" /> Mural de Avisos</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {notices.map(notice => (
                <div key={notice.id} className="bg-emerald-50 border border-emerald-100 p-6 rounded-[32px] relative group hover:shadow-lg transition-all">
                  <h4 className="font-black text-emerald-900 mb-1">{notice.title}</h4>
                  <p className="text-emerald-700 text-sm font-medium">{notice.content}</p>
                  {isAdminMode && (
                    <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                       <button onClick={() => { setEditingItem(notice); setModalType('notice'); }} className="p-2 bg-white text-blue-600 rounded-xl"><Edit2 size={14}/></button>
                       <button onClick={() => onDeleteNotice(notice.id)} className="p-2 bg-white text-rose-600 rounded-xl"><Trash2 size={14}/></button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="lg:col-span-4 space-y-8">
          <h3 className="text-2xl font-black text-slate-800">Escala Semanal</h3>
          <div className="bg-[#1E293B] text-white rounded-[48px] p-8 lg:p-10 shadow-2xl min-h-[400px]">
            <div className="space-y-6">
              {weeklyCults.map((c, index) => (
                <div 
                  key={c.id} draggable={isAdminMode} onDragStart={() => onDragStart(index)} onDragOver={(e) => onDragOver(e, index)} onDragEnd={() => setDraggedItemIndex(null)}
                  className={`group/item flex justify-between items-start border-b border-slate-700/30 pb-6 last:border-0 last:pb-0 transition-all ${draggedItemIndex === index ? 'opacity-30' : 'opacity-100'} ${isAdminMode ? 'cursor-grab' : ''}`}
                >
                  <div className="flex items-start gap-3 flex-1">
                    {isAdminMode && <div className="mt-1 text-slate-600 group-hover/item:text-blue-400"><GripVertical size={16} /></div>}
                    <div className="flex-1">
                      <p className="text-[10px] text-blue-400 font-black uppercase tracking-[0.2em] mb-1">{c.day}</p>
                      <p className="text-xs font-bold text-slate-100 leading-snug">{c.name}</p>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <div className="bg-slate-800 px-3 py-1.5 rounded-lg text-[10px] font-black">{c.time}</div>
                    {isAdminMode && (
                      <div className="flex gap-1 opacity-0 group-hover/item:opacity-100 transition-opacity">
                        <button onClick={() => { setEditingItem(c); setModalType('cult'); }} className="p-2 text-blue-400 hover:bg-slate-700 rounded-lg"><Edit2 size={14}/></button>
                        <button onClick={() => onDeleteCult(c.id)} className="p-2 text-rose-400 hover:bg-slate-700 rounded-lg"><Trash2 size={14}/></button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {modalType && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[110] flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-lg rounded-[48px] shadow-2xl p-10 space-y-6">
            <h3 className="text-2xl font-black text-slate-800 uppercase">Gerenciar {modalType}</h3>
            {modalType === 'cult' && (
              <div className="space-y-4">
                <input placeholder="Dia" className="w-full bg-slate-50 p-4 rounded-2xl border font-bold" value={editingItem.day || ''} onChange={e => setEditingItem({...editingItem, day: e.target.value})} />
                <textarea placeholder="Culto" className="w-full bg-slate-50 p-4 rounded-2xl border font-bold" value={editingItem.name || ''} onChange={e => setEditingItem({...editingItem, name: e.target.value})} />
                <input type="time" className="w-full bg-slate-50 p-4 rounded-2xl border font-bold" value={editingItem.time || ''} onChange={e => setEditingItem({...editingItem, time: e.target.value})} />
                <button onClick={() => { onSaveCult({...editingItem, id: editingItem.id || Date.now().toString()}); setModalType(null); }} className="w-full bg-indigo-600 text-white py-5 rounded-3xl font-black uppercase text-xs">Salvar</button>
              </div>
            )}
            <button onClick={() => setModalType(null)} className="w-full text-slate-400 font-bold uppercase text-[10px]">Cancelar</button>
          </div>
        </div>
      )}

      {showLoginModal && (
        <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-xl z-[100] flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-sm rounded-[48px] shadow-2xl p-10 text-center">
             <div className="bg-blue-50 p-6 rounded-[32px] text-blue-600 mb-6 mx-auto w-fit"><Lock size={40} /></div>
             <h3 className="text-2xl font-black text-slate-800 mb-6">Agenda Admin</h3>
             <form onSubmit={handleLogin} className="space-y-4">
                <input type="password" autoFocus className="w-full bg-slate-50 border p-5 rounded-3xl text-center font-black tracking-[0.5em]" value={passwordInput} onChange={e => setPasswordInput(e.target.value)} />
                {error && <p className="text-rose-500 text-[10px] font-black uppercase">{error}</p>}
                <button className="w-full bg-blue-600 text-white py-5 rounded-3xl font-black uppercase text-xs">Entrar</button>
             </form>
             <button onClick={() => setShowLoginModal(false)} className="w-full mt-6 text-[10px] font-black text-slate-400 uppercase">Cancelar</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default EventsTab;
