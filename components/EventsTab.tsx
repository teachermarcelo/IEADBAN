
import React, { useState } from 'react';
import { Calendar, Clock, MapPin, Star, Plus, X, Trash2, Edit2, ShieldCheck, Lock, AlertCircle, Link as LinkIcon, ExternalLink, Megaphone, Bell, KeyRound, Save, RefreshCcw, GripVertical, Image as ImageIcon, Camera } from 'lucide-react';
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
  events, 
  weeklyCults, 
  notices, 
  carouselItems,
  onSaveEvent, 
  onDeleteEvent, 
  onSaveCult, 
  onDeleteCult, 
  onSaveNotice, 
  onDeleteNotice,
  onSaveCarouselItem,
  onDeleteCarouselItem,
  onReorderCults
}) => {
  const [isAdminMode, setIsAdminMode] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showSecurityModal, setShowSecurityModal] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');
  const [error, setError] = useState('');
  
  // Drag and Drop State
  const [draggedItemIndex, setDraggedItemIndex] = useState<number | null>(null);

  // Password State
  const AGENDA_PASS_KEY = 'ieadban_agenda_pass';
  const [currentPass, setCurrentPass] = useState(localStorage.getItem(AGENDA_PASS_KEY) || '123456');
  const [newPass, setNewPass] = useState('');

  // Form Modals
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
    if (newPass.length < 4) {
      alert('A senha deve ter pelo menos 4 dígitos.');
      return;
    }
    localStorage.setItem(AGENDA_PASS_KEY, newPass);
    setCurrentPass(newPass);
    setShowSecurityModal(false);
    setNewPass('');
    alert('Senha da Agenda atualizada com sucesso!');
  };

  const openForm = (type: 'event' | 'cult' | 'notice' | 'carousel', item?: any) => {
    setModalType(type);
    setEditingItem(item || {});
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setEditingItem({ ...editingItem, imageUrl: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  // Drag and Drop Handlers
  const onDragStart = (index: number) => {
    if (!isAdminMode) return;
    setDraggedItemIndex(index);
  };

  const onDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (draggedItemIndex === null || draggedItemIndex === index) return;

    const newList = [...weeklyCults];
    const draggedItem = newList[draggedItemIndex];
    newList.splice(draggedItemIndex, 1);
    newList.splice(index, 0, draggedItem);
    
    // Atualiza visualmente via callback para o pai
    if (onReorderCults) onReorderCults(newList);
    
    setDraggedItemIndex(index);
  };

  const onDragEnd = () => {
    setDraggedItemIndex(null);
  };

  return (
    <div className="space-y-12 animate-in fade-in duration-700 pb-16">
      {/* Header with Admin Toggle */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 bg-white p-10 rounded-[48px] border border-slate-100 shadow-sm relative overflow-hidden">
        <div>
          <h2 className="text-4xl font-black text-slate-800 tracking-tight">Agenda & Admin</h2>
          <p className="text-slate-400 font-bold text-xs uppercase tracking-widest mt-2 flex items-center gap-2">
            <Bell size={14} className="text-blue-500" /> Informativos Oficiais IEADBAN
          </p>
        </div>
        
        <div className="flex flex-wrap gap-4 relative z-10">
          {!isAdminMode ? (
            <button 
              onClick={() => setShowLoginModal(true)}
              className="bg-slate-900 text-white px-8 py-4 rounded-3xl font-black text-xs uppercase tracking-widest flex items-center gap-3 hover:bg-slate-800 transition-all shadow-xl shadow-slate-200"
            >
              <ShieldCheck size={18} className="text-blue-400" /> Agenda Admin
            </button>
          ) : (
            <div className="flex flex-wrap gap-2">
               <button onClick={() => openForm('carousel')} className="bg-rose-600 text-white px-5 py-3 rounded-2xl font-black text-[9px] uppercase tracking-widest flex items-center gap-2 hover:bg-rose-700 transition-all"><Camera size={14}/> Carrossel</button>
               <button onClick={() => openForm('event')} className="bg-blue-600 text-white px-5 py-3 rounded-2xl font-black text-[9px] uppercase tracking-widest flex items-center gap-2 hover:bg-blue-700 transition-all"><Plus size={14}/> Evento</button>
               <button onClick={() => openForm('notice')} className="bg-emerald-600 text-white px-5 py-3 rounded-2xl font-black text-[9px] uppercase tracking-widest flex items-center gap-2 hover:bg-emerald-700 transition-all"><Plus size={14}/> Aviso</button>
               <button onClick={() => openForm('cult')} className="bg-indigo-600 text-white px-5 py-3 rounded-2xl font-black text-[9px] uppercase tracking-widest flex items-center gap-2 hover:bg-indigo-700 transition-all"><Plus size={14}/> Escala</button>
               <button onClick={() => setShowSecurityModal(true)} className="bg-slate-100 text-slate-600 px-5 py-3 rounded-2xl font-black text-[9px] uppercase tracking-widest flex items-center gap-2 hover:bg-slate-200 transition-all"><KeyRound size={14}/></button>
               <button onClick={() => setIsAdminMode(false)} className="bg-rose-50 text-rose-600 px-5 py-3 rounded-2xl font-black text-[9px] uppercase tracking-widest flex items-center gap-2 hover:bg-rose-100 transition-all"><X size={14}/></button>
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        <div className="lg:col-span-8 space-y-12">
          {/* Section: Gestão do Carrossel (Admin Only) */}
          {isAdminMode && (
            <div className="space-y-6 animate-in slide-in-from-left duration-500">
               <h3 className="text-2xl font-black text-slate-800 flex items-center gap-3">
                <Camera size={24} className="text-rose-500" /> Gerenciar Carrossel (Home)
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {carouselItems.map(item => (
                  <div key={item.id} className="relative aspect-[4/3] rounded-3xl overflow-hidden border border-slate-100 shadow-sm group">
                    <img src={item.imageUrl} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                       <button onClick={() => openForm('carousel', item)} className="p-3 bg-white text-blue-600 rounded-xl"><Edit2 size={16}/></button>
                       <button onClick={() => onDeleteCarouselItem(item.id)} className="p-3 bg-white text-rose-600 rounded-xl"><Trash2 size={16}/></button>
                    </div>
                  </div>
                ))}
                <button 
                  onClick={() => openForm('carousel')}
                  className="aspect-[4/3] border-2 border-dashed border-slate-200 rounded-3xl flex flex-col items-center justify-center gap-2 text-slate-400 hover:border-rose-500 hover:text-rose-500 transition-all"
                >
                  <Plus size={32}/>
                  <span className="text-[10px] font-black uppercase">Novo Banner</span>
                </button>
              </div>
            </div>
          )}

          {/* Section: Avisos */}
          {notices.length > 0 && (
            <div className="space-y-6">
              <h3 className="text-2xl font-black text-slate-800 flex items-center gap-3">
                <Megaphone size={24} className="text-emerald-500" /> Mural de Avisos
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {notices.map(notice => (
                  <div key={notice.id} className="bg-emerald-50 border border-emerald-100 p-6 rounded-[32px] relative group hover:shadow-lg transition-all">
                    <h4 className="font-black text-emerald-900 mb-1">{notice.title}</h4>
                    <p className="text-emerald-700 text-sm font-medium leading-relaxed">{notice.content}</p>
                    <p className="text-[10px] font-black uppercase text-emerald-400 mt-4 tracking-widest">{notice.date}</p>
                    {isAdminMode && (
                      <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                         <button onClick={() => openForm('notice', notice)} className="p-2 bg-white text-blue-600 rounded-xl shadow-sm"><Edit2 size={14}/></button>
                         <button onClick={() => onDeleteNotice(notice.id)} className="p-2 bg-white text-rose-600 rounded-xl shadow-sm"><Trash2 size={14}/></button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Section: Eventos Especiais */}
          <div className="space-y-6">
            <h3 className="text-2xl font-black text-slate-800">Eventos Especiais</h3>
            <div className="space-y-4">
              {events.length === 0 && (
                <div className="bg-white border-2 border-dashed border-slate-200 rounded-[40px] p-16 text-center text-slate-400 font-bold">
                  Nenhum evento especial agendado.
                </div>
              )}
              {events.sort((a,b) => a.date.localeCompare(b.date)).map(event => {
                const [year, month, day] = event.date.split('-');
                const months = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
                const monthName = months[parseInt(month) - 1];
                return (
                  <div key={event.id} className="bg-white rounded-[32px] border border-slate-50 p-6 shadow-sm hover:shadow-xl transition-all flex gap-6 items-center group relative">
                    <div className="bg-rose-50 text-rose-500 w-16 h-16 rounded-2xl flex flex-col items-center justify-center font-black flex-shrink-0">
                      <span className="text-[10px] uppercase">{monthName}</span>
                      <span className="text-xl">{day}</span>
                    </div>
                    <div className="flex-1">
                      <h4 className="font-black text-lg text-slate-800">{event.title}</h4>
                      <div className="flex flex-wrap gap-4 mt-2 text-[10px] text-slate-400 font-black uppercase tracking-widest">
                        <span className="flex items-center gap-1.5"><Clock size={12}/> {event.time}</span>
                        <span className="flex items-center gap-1.5"><MapPin size={12}/> {event.location}</span>
                      </div>
                    </div>
                    {event.externalLink && (
                      <a href={event.externalLink} target="_blank" className="bg-blue-50 text-blue-600 p-4 rounded-2xl hover:bg-blue-600 hover:text-white transition-all"><ExternalLink size={18}/></a>
                    )}
                    {isAdminMode && (
                      <div className="flex gap-1 ml-4 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onClick={() => openForm('event', event)} className="p-3 bg-slate-50 text-blue-600 rounded-xl hover:bg-white"><Edit2 size={16}/></button>
                        <button onClick={() => onDeleteEvent(event.id)} className="p-3 bg-slate-50 text-rose-600 rounded-xl hover:bg-white"><Trash2 size={16}/></button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column: Escala Semanal com Drag and Drop */}
        <div className="lg:col-span-4 space-y-8">
          <div className="flex justify-between items-center">
            <h3 className="text-2xl font-black text-slate-800">Escala Semanal</h3>
          </div>
          <div className="bg-[#1E293B] text-white rounded-[48px] p-8 lg:p-10 shadow-2xl relative min-h-[400px]">
            {isAdminMode && (
              <p className="text-[9px] font-black text-blue-400 uppercase tracking-widest text-center mb-6">
                Arraste os itens para reordenar a escala
              </p>
            )}
            <div className="space-y-6 relative z-10">
              {weeklyCults.map((c, index) => (
                <div 
                  key={c.id} 
                  draggable={isAdminMode}
                  onDragStart={() => onDragStart(index)}
                  onDragOver={(e) => onDragOver(e, index)}
                  onDragEnd={onDragEnd}
                  className={`group/item flex justify-between items-start border-b border-slate-700/30 pb-6 last:border-0 last:pb-0 transition-all duration-300 ${draggedItemIndex === index ? 'opacity-30 scale-95' : 'opacity-100'} ${isAdminMode ? 'cursor-grab active:cursor-grabbing' : ''}`}
                >
                  <div className="flex items-start gap-3 flex-1">
                    {isAdminMode && (
                      <div className="mt-1 text-slate-600 group-hover/item:text-blue-400 transition-colors">
                        <GripVertical size={16} />
                      </div>
                    )}
                    <div className="flex-1 pr-2">
                      <p className="text-[10px] text-blue-400 font-black uppercase tracking-[0.2em] mb-1">{c.day}</p>
                      <p className="text-xs font-bold text-slate-100 leading-snug whitespace-pre-line">{c.name}</p>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <div className="bg-slate-800 px-3 py-1.5 rounded-lg text-[10px] font-black border border-slate-700">{c.time}</div>
                    {isAdminMode && (
                      <div className="flex gap-1 opacity-0 group-hover/item:opacity-100 transition-opacity">
                        <button onClick={() => openForm('cult', c)} className="p-2 text-blue-400 hover:bg-slate-700 rounded-lg"><Edit2 size={14}/></button>
                        <button onClick={() => onDeleteCult(c.id)} className="p-2 text-rose-400 hover:bg-slate-700 rounded-lg"><Trash2 size={14}/></button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
              {weeklyCults.length === 0 && (
                <p className="text-center text-slate-500 text-xs py-10">Nenhuma escala cadastrada.</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Editor Modal */}
      {modalType && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[110] flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-lg rounded-[48px] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
            <div className="p-8 border-b border-slate-50 bg-slate-50/50 flex justify-between items-center">
              <h3 className="text-2xl font-black text-slate-800 tracking-tight uppercase">
                {modalType === 'carousel' ? 'Criar Carrossel' : modalType === 'event' ? 'Configurar Evento' : modalType === 'cult' ? 'Editar Escala' : 'Novo Aviso'}
              </h3>
              <button onClick={() => setModalType(null)} className="p-2 hover:bg-slate-200 rounded-full"><X /></button>
            </div>
            <div className="p-10 space-y-6 overflow-y-auto max-h-[70vh]">
               {modalType === 'carousel' && (
                 <div className="space-y-4">
                    <div className="space-y-2">
                       <label className="text-[10px] font-black uppercase text-slate-400 ml-2">Título (Opcional)</label>
                       <input placeholder="Ex: Grande Cruzada de Fé" className="w-full bg-slate-50 p-4 rounded-2xl border font-bold outline-none" value={editingItem.title || ''} onChange={e => setEditingItem({...editingItem, title: e.target.value})} />
                    </div>
                    
                    <div className="space-y-2">
                       <label className="text-[10px] font-black uppercase text-slate-400 ml-2">Upload de Imagem</label>
                       <div className="relative group/upload h-40 bg-slate-50 border-2 border-dashed border-slate-200 rounded-2xl flex flex-col items-center justify-center overflow-hidden">
                          {editingItem.imageUrl ? (
                            <>
                              <img src={editingItem.imageUrl} className="w-full h-full object-cover" />
                              <button onClick={() => setEditingItem({...editingItem, imageUrl: ''})} className="absolute top-2 right-2 p-2 bg-rose-500 text-white rounded-full shadow-lg"><X size={14}/></button>
                            </>
                          ) : (
                            <>
                               <ImageIcon size={32} className="text-slate-300 mb-2" />
                               <span className="text-[10px] font-black uppercase text-slate-400">Clique para selecionar imagem</span>
                               <input type="file" accept="image/*" onChange={handleImageUpload} className="absolute inset-0 opacity-0 cursor-pointer" />
                            </>
                          )}
                       </div>
                    </div>

                    <div className="space-y-2">
                       <label className="text-[10px] font-black uppercase text-slate-400 ml-2">URL da Imagem (Alternativo)</label>
                       <input placeholder="https://..." className="w-full bg-slate-50 p-4 rounded-2xl border font-bold outline-none" value={editingItem.imageUrl || ''} onChange={e => setEditingItem({...editingItem, imageUrl: e.target.value})} />
                    </div>

                    <div className="space-y-2">
                       <label className="text-[10px] font-black uppercase text-slate-400 ml-2">Link de Destino (Opcional)</label>
                       <input placeholder="https://..." className="w-full bg-slate-50 p-4 rounded-2xl border font-bold outline-none" value={editingItem.link || ''} onChange={e => setEditingItem({...editingItem, link: e.target.value})} />
                    </div>

                    <button 
                      onClick={() => { 
                        if(!editingItem.imageUrl) return alert("Selecione uma imagem");
                        onSaveCarouselItem({...editingItem, id: editingItem.id || Date.now().toString()}); 
                        setModalType(null); 
                      }} 
                      className="w-full bg-rose-600 text-white py-5 rounded-3xl font-black uppercase tracking-widest text-xs"
                    >
                      Salvar Banner
                    </button>
                 </div>
               )}
               {modalType === 'event' && (
                 <div className="space-y-4">
                    <input placeholder="Título do Evento" className="w-full bg-slate-50 p-4 rounded-2xl border font-bold outline-none" value={editingItem.title || ''} onChange={e => setEditingItem({...editingItem, title: e.target.value})} />
                    <div className="grid grid-cols-2 gap-4">
                       <input type="date" className="w-full bg-slate-50 p-4 rounded-2xl border font-bold outline-none" value={editingItem.date || ''} onChange={e => setEditingItem({...editingItem, date: e.target.value})} />
                       <input type="time" className="w-full bg-slate-50 p-4 rounded-2xl border font-bold outline-none" value={editingItem.time || ''} onChange={e => setEditingItem({...editingItem, time: e.target.value})} />
                    </div>
                    <input placeholder="Local" className="w-full bg-slate-50 p-4 rounded-2xl border font-bold outline-none" value={editingItem.location || ''} onChange={e => setEditingItem({...editingItem, location: e.target.value})} />
                    <input placeholder="Link Externo (URL)" className="w-full bg-slate-50 p-4 rounded-2xl border font-bold outline-none" value={editingItem.externalLink || ''} onChange={e => setEditingItem({...editingItem, externalLink: e.target.value})} />
                    <button onClick={() => { onSaveEvent({...editingItem, id: editingItem.id || Date.now().toString()}); setModalType(null); }} className="w-full bg-blue-600 text-white py-5 rounded-3xl font-black uppercase tracking-widest text-xs">Salvar</button>
                 </div>
               )}
               {modalType === 'cult' && (
                 <div className="space-y-4">
                    <input placeholder="Dia (Ex: Terça-feira)" className="w-full bg-slate-50 p-4 rounded-2xl border font-bold outline-none" value={editingItem.day || ''} onChange={e => setEditingItem({...editingItem, day: e.target.value})} />
                    <textarea rows={3} placeholder="Culto e Responsáveis" className="w-full bg-slate-50 p-4 rounded-2xl border font-bold outline-none" value={editingItem.name || ''} onChange={e => setEditingItem({...editingItem, name: e.target.value})} />
                    <input type="time" className="w-full bg-slate-50 p-4 rounded-2xl border font-bold outline-none" value={editingItem.time || ''} onChange={e => setEditingItem({...editingItem, time: e.target.value})} />
                    <button onClick={() => { onSaveCult({...editingItem, id: editingItem.id || Date.now().toString()}); setModalType(null); }} className="w-full bg-indigo-600 text-white py-5 rounded-3xl font-black uppercase tracking-widest text-xs">Salvar Escala</button>
                 </div>
               )}
               {modalType === 'notice' && (
                 <div className="space-y-4">
                    <input placeholder="Título do Aviso" className="w-full bg-slate-50 p-4 rounded-2xl border font-bold outline-none" value={editingItem.title || ''} onChange={e => setEditingItem({...editingItem, title: e.target.value})} />
                    <textarea placeholder="Mensagem" rows={4} className="w-full bg-slate-50 p-4 rounded-2xl border font-bold outline-none" value={editingItem.content || ''} onChange={e => setEditingItem({...editingItem, content: e.target.value})} />
                    <input placeholder="Data/Validade" className="w-full bg-slate-50 p-4 rounded-2xl border font-bold outline-none" value={editingItem.date || ''} onChange={e => setEditingItem({...editingItem, date: e.target.value})} />
                    <button onClick={() => { onSaveNotice({...editingItem, id: editingItem.id || Date.now().toString()}); setModalType(null); }} className="w-full bg-emerald-600 text-white py-5 rounded-3xl font-black uppercase tracking-widest text-xs">Publicar Aviso</button>
                 </div>
               )}
            </div>
          </div>
        </div>
      )}

      {/* Login Modal */}
      {showLoginModal && (
        <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-xl z-[100] flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-sm rounded-[48px] shadow-2xl p-10">
             <div className="flex flex-col items-center text-center mb-8">
                <div className="bg-blue-50 p-6 rounded-[32px] text-blue-600 mb-6"><Lock size={40} /></div>
                <h3 className="text-2xl font-black text-slate-800 tracking-tight">Agenda Admin</h3>
             </div>
             <form onSubmit={handleLogin} className="space-y-4">
                <input type="password" autoFocus className="w-full bg-slate-50 border border-slate-100 p-5 rounded-3xl text-center font-black tracking-[0.5em] outline-none" value={passwordInput} onChange={e => setPasswordInput(e.target.value)} />
                {error && <p className="text-rose-500 text-[10px] font-black text-center uppercase">{error}</p>}
                <button className="w-full bg-blue-600 text-white py-5 rounded-3xl font-black uppercase tracking-widest text-xs">Entrar</button>
             </form>
             <button onClick={() => setShowLoginModal(false)} className="w-full mt-6 text-[10px] font-black text-slate-400 uppercase">Cancelar</button>
          </div>
        </div>
      )}

      {/* Security Modal */}
      {showSecurityModal && (
        <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-xl z-[120] flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-[48px] shadow-2xl p-10 animate-in zoom-in-95 duration-200">
             <div className="flex justify-between items-center mb-8">
                <h3 className="text-2xl font-black text-slate-800 tracking-tight">Segurança Agenda</h3>
                <button onClick={() => setShowSecurityModal(false)} className="p-2 hover:bg-slate-100 rounded-full"><X/></button>
             </div>
             <form onSubmit={handleUpdatePassword} className="space-y-6">
                <div className="space-y-4 bg-slate-50 p-6 rounded-[32px] border border-slate-100">
                   <h4 className="text-xs font-black uppercase text-slate-500 tracking-widest mb-2 flex items-center gap-2">Nova Senha Admin</h4>
                   <input 
                      type="password"
                      placeholder="Mínimo 4 dígitos"
                      className="w-full bg-white border border-slate-200 p-4 rounded-2xl font-bold outline-none focus:ring-2 ring-blue-500"
                      value={newPass}
                      onChange={e => setNewPass(e.target.value)}
                   />
                   <button type="submit" className="w-full bg-blue-600 text-white py-4 rounded-2xl font-black uppercase text-[10px] tracking-widest flex items-center justify-center gap-2">
                      <Save size={14}/> Salvar Nova Senha
                   </button>
                </div>
             </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default EventsTab;
