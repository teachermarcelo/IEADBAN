
import React, { useState } from 'react';
/* Added RefreshCcw to the imports from lucide-react */
import { Calendar, Clock, MapPin, Plus, X, Trash2, Edit2, ShieldCheck, Lock, ExternalLink, Megaphone, Bell, KeyRound, Save, GripVertical, Image as ImageIcon, Camera, Link as LinkIcon, RefreshCcw } from 'lucide-react';
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

  const handleSave = () => {
    const id = editingItem.id || Date.now().toString();
    const itemWithId = { ...editingItem, id };

    switch(modalType) {
      case 'carousel': onSaveCarouselItem(itemWithId); break;
      case 'event': onSaveEvent(itemWithId); break;
      case 'notice': onSaveNotice(itemWithId); break;
      case 'cult': onSaveCult(itemWithId); break;
    }
    setModalType(null);
    setEditingItem(null);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-700 pb-16">
      {/* Header Estilizado */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-6 bg-white p-6 md:p-10 rounded-[32px] md:rounded-[48px] border border-slate-100 shadow-sm">
        <div className="text-center md:text-left">
          <h2 className="text-3xl md:text-4xl font-black text-slate-800 tracking-tight">Agenda & Admin</h2>
          <p className="text-slate-400 font-bold text-[10px] uppercase tracking-widest mt-2 flex items-center justify-center md:justify-start gap-2">
            <Bell size={14} className="text-blue-500" /> Informativos Oficiais IEADBAN
          </p>
        </div>
        <div className="flex flex-wrap justify-center gap-3">
          {!isAdminMode ? (
            <button onClick={() => setShowLoginModal(true)} className="bg-slate-900 text-white px-8 py-4 rounded-3xl font-black text-xs uppercase tracking-widest flex items-center gap-3 hover:bg-slate-800 transition-all shadow-xl shadow-slate-200">
              <ShieldCheck size={18} className="text-blue-400" /> Acesso Restrito
            </button>
          ) : (
            <div className="flex flex-wrap justify-center gap-2">
               <button onClick={() => { setEditingItem({}); setModalType('carousel'); }} className="bg-rose-600 text-white px-4 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest flex items-center gap-2 hover:scale-105 transition-all"><Camera size={14}/> + Carrossel</button>
               <button onClick={() => { setEditingItem({}); setModalType('notice'); }} className="bg-emerald-600 text-white px-4 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest flex items-center gap-2 hover:scale-105 transition-all"><Megaphone size={14}/> + Aviso</button>
               <button onClick={() => { setEditingItem({}); setModalType('cult'); }} className="bg-indigo-600 text-white px-4 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest flex items-center gap-2 hover:scale-105 transition-all"><Plus size={14}/> + Escala</button>
               <button onClick={() => setShowSecurityModal(true)} className="bg-slate-100 text-slate-600 p-3 rounded-2xl hover:bg-slate-200"><KeyRound size={18}/></button>
               <button onClick={() => setIsAdminMode(false)} className="bg-rose-50 text-rose-600 px-4 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest flex items-center gap-2 hover:bg-rose-100"><X size={14}/> Sair</button>
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Lado Esquerdo: Carrossel e Avisos */}
        <div className="lg:col-span-8 space-y-10">
          
          {/* Gerenciar Carrossel (Apenas PC/Tablet melhora visibilidade) */}
          <section className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-sm">
            <h3 className="text-xl font-black text-slate-800 flex items-center gap-3 mb-6"><ImageIcon size={20} className="text-rose-500" /> Banners do Carrossel</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-4">
              {carouselItems.map(item => (
                <div key={item.id} className="relative aspect-[9/16] rounded-2xl overflow-hidden border border-slate-100 group">
                  <img src={item.imageUrl} className="w-full h-full object-cover" alt="Banner" />
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-3">
                     <button onClick={() => { setEditingItem(item); setModalType('carousel'); }} className="p-3 bg-white text-blue-600 rounded-xl hover:scale-110 transition-transform"><Edit2 size={16}/></button>
                     <button onClick={() => onDeleteCarouselItem(item.id)} className="p-3 bg-white text-rose-600 rounded-xl hover:scale-110 transition-transform"><Trash2 size={16}/></button>
                  </div>
                </div>
              ))}
              {carouselItems.length === 0 && (
                <div className="col-span-full py-12 text-center text-slate-300 border-2 border-dashed rounded-3xl">
                  Nenhum banner ativo no momento.
                </div>
              )}
            </div>
          </section>

          {/* Mural de Avisos */}
          <section className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-sm">
            <h3 className="text-xl font-black text-slate-800 flex items-center gap-3 mb-6"><Megaphone size={20} className="text-emerald-500" /> Mural de Avisos</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {notices.map(notice => (
                <div key={notice.id} className="bg-emerald-50/50 border border-emerald-100 p-6 rounded-[24px] relative group hover:bg-emerald-50 transition-all">
                  <h4 className="font-black text-emerald-900 mb-1">{notice.title}</h4>
                  <p className="text-emerald-700 text-sm font-medium leading-relaxed">{notice.content}</p>
                  {isAdminMode && (
                    <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                       <button onClick={() => { setEditingItem(notice); setModalType('notice'); }} className="p-2 bg-white text-blue-600 rounded-lg border border-emerald-100"><Edit2 size={14}/></button>
                       <button onClick={() => onDeleteNotice(notice.id)} className="p-2 bg-white text-rose-600 rounded-lg border border-emerald-100"><Trash2 size={14}/></button>
                    </div>
                  )}
                </div>
              ))}
              {notices.length === 0 && (
                <p className="col-span-full py-10 text-center text-slate-400 font-bold text-xs uppercase tracking-widest">Sem avisos importantes hoje.</p>
              )}
            </div>
          </section>
        </div>

        {/* Lado Direito: Escala Semanal (Estilo Agenda) */}
        <div className="lg:col-span-4 sticky top-6">
          <div className="bg-[#1E293B] text-white rounded-[40px] p-8 shadow-2xl">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-xl font-black uppercase tracking-tight">Escala Semanal</h3>
              <Calendar className="text-blue-400" size={20} />
            </div>
            <div className="space-y-6">
              {weeklyCults.map((c, index) => (
                <div 
                  key={c.id} draggable={isAdminMode} onDragStart={() => onDragStart(index)} onDragOver={(e) => onDragOver(e, index)} onDragEnd={() => setDraggedItemIndex(null)}
                  className={`group/item flex justify-between items-start border-b border-slate-700/30 pb-5 last:border-0 last:pb-0 transition-all ${draggedItemIndex === index ? 'opacity-30' : 'opacity-100'} ${isAdminMode ? 'cursor-grab active:cursor-grabbing' : ''}`}
                >
                  <div className="flex items-start gap-3 flex-1">
                    {isAdminMode && <div className="mt-1 text-slate-600 group-hover/item:text-blue-400"><GripVertical size={16} /></div>}
                    <div className="flex-1">
                      <p className="text-[9px] text-blue-400 font-black uppercase tracking-[0.2em] mb-1">{c.day}</p>
                      <p className="text-sm font-bold text-slate-100 leading-tight">{c.name}</p>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <div className="bg-slate-800 px-3 py-1.5 rounded-xl text-[10px] font-black">{c.time}</div>
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

      {/* Modais de Gerenciamento Unificados */}
      {modalType && (
        <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-md z-[120] flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-lg rounded-[40px] shadow-2xl overflow-hidden animate-in zoom-in-95">
            <div className="p-6 border-b flex justify-between items-center bg-slate-50">
              <h3 className="text-xl font-black text-slate-800 uppercase tracking-tight">
                {editingItem.id ? 'Editar' : 'Adicionar'} {
                  modalType === 'carousel' ? 'Banner' :
                  modalType === 'notice' ? 'Aviso' : 'Culto'
                }
              </h3>
              <button onClick={() => setModalType(null)} className="p-2 hover:bg-slate-200 rounded-full"><X/></button>
            </div>
            
            <div className="p-8 space-y-6 max-h-[70vh] overflow-y-auto">
              {modalType === 'carousel' && (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-slate-400 ml-2">Título do Banner (Opcional)</label>
                    <input className="w-full bg-slate-50 p-4 rounded-2xl border font-bold outline-none" placeholder="Ex: Grande Culto de Jovens" value={editingItem.title || ''} onChange={e => setEditingItem({...editingItem, title: e.target.value})} />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-slate-400 ml-2">Link Externo (Opcional)</label>
                    <input className="w-full bg-slate-50 p-4 rounded-2xl border font-bold outline-none" placeholder="https://..." value={editingItem.link || ''} onChange={e => setEditingItem({...editingItem, link: e.target.value})} />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-slate-400 ml-2">Imagem do Banner</label>
                    <div className="relative h-64 bg-slate-50 border-2 border-dashed rounded-3xl flex items-center justify-center overflow-hidden group">
                      {editingItem.imageUrl ? (
                        <img src={editingItem.imageUrl} className="w-full h-full object-contain" />
                      ) : (
                        <div className="text-center text-slate-300">
                          <Camera size={48} className="mx-auto mb-2 opacity-20" />
                          <p className="text-[10px] font-black uppercase tracking-widest">Clique para subir a imagem</p>
                        </div>
                      )}
                      <input type="file" accept="image/*" onChange={handleImageUpload} className="absolute inset-0 opacity-0 cursor-pointer" />
                    </div>
                  </div>
                </div>
              )}

              {modalType === 'notice' && (
                <div className="space-y-4">
                   <input placeholder="Título do Aviso" className="w-full bg-slate-50 p-4 rounded-2xl border font-bold" value={editingItem.title || ''} onChange={e => setEditingItem({...editingItem, title: e.target.value})} />
                   <textarea rows={4} placeholder="Conteúdo da mensagem..." className="w-full bg-slate-50 p-4 rounded-2xl border font-bold" value={editingItem.content || ''} onChange={e => setEditingItem({...editingItem, content: e.target.value})} />
                </div>
              )}

              {modalType === 'cult' && (
                <div className="space-y-4">
                  <select className="w-full bg-slate-50 p-4 rounded-2xl border font-bold appearance-none" value={editingItem.day || ''} onChange={e => setEditingItem({...editingItem, day: e.target.value})}>
                     <option value="">Selecione o Dia</option>
                     <option value="Segunda-feira">Segunda-feira</option>
                     <option value="Terça-feira">Terça-feira</option>
                     <option value="Quarta-feira">Quarta-feira</option>
                     <option value="Quinta-feira">Quinta-feira</option>
                     <option value="Sexta-feira">Sexta-feira</option>
                     <option value="Sábado">Sábado</option>
                     <option value="Domingo">Domingo</option>
                  </select>
                  <input placeholder="Nome do Culto / Evento" className="w-full bg-slate-50 p-4 rounded-2xl border font-bold" value={editingItem.name || ''} onChange={e => setEditingItem({...editingItem, name: e.target.value})} />
                  <input type="time" className="w-full bg-slate-50 p-4 rounded-2xl border font-bold" value={editingItem.time || ''} onChange={e => setEditingItem({...editingItem, time: e.target.value})} />
                </div>
              )}

              <div className="pt-4 flex gap-4">
                <button onClick={() => setModalType(null)} className="flex-1 py-4 bg-slate-100 text-slate-500 rounded-2xl font-black uppercase text-[10px]">Cancelar</button>
                <button onClick={handleSave} className="flex-[2] py-4 bg-blue-600 text-white rounded-2xl font-black uppercase text-[10px] shadow-lg shadow-blue-100 hover:bg-blue-700 transition-all">Salvar Informação</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Login Modais e Segurança continuam os mesmos, mas com layout centralizado */}
      {showLoginModal && (
        <div className="fixed inset-0 bg-slate-900/90 backdrop-blur-xl z-[150] flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-sm rounded-[48px] shadow-2xl p-10 text-center">
             <div className="bg-blue-50 p-6 rounded-[32px] text-blue-600 mb-6 mx-auto w-fit"><Lock size={40} /></div>
             <h3 className="text-2xl font-black text-slate-800 mb-6">Painel de Gestão</h3>
             <form onSubmit={handleLogin} className="space-y-4">
                <input type="password" autoFocus className="w-full bg-slate-50 border p-5 rounded-3xl text-center font-black tracking-[0.5em] text-xl" value={passwordInput} onChange={e => setPasswordInput(e.target.value)} />
                {error && <p className="text-rose-500 text-[10px] font-black uppercase">{error}</p>}
                <button className="w-full bg-blue-600 text-white py-5 rounded-3xl font-black uppercase text-xs tracking-widest shadow-xl shadow-blue-100">Desbloquear Painel</button>
             </form>
             <button onClick={() => setShowLoginModal(false)} className="mt-6 text-slate-400 font-bold uppercase text-[10px] hover:text-rose-500 transition-colors">Voltar</button>
          </div>
        </div>
      )}

      {showSecurityModal && (
        <div className="fixed inset-0 bg-slate-900/90 backdrop-blur-xl z-[160] flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-[48px] shadow-2xl p-10 space-y-6">
             <h3 className="text-2xl font-black text-slate-800 uppercase tracking-tight">Segurança</h3>
             <div className="bg-slate-50 p-8 rounded-[32px] space-y-6">
                <div>
                  <label className="text-[10px] font-black uppercase text-slate-400 ml-2 mb-2 block">Nova Senha de Acesso</label>
                  <input type="password" placeholder="Mínimo 4 dígitos" className="w-full p-4 rounded-2xl border font-bold outline-none focus:ring-2 ring-blue-500" value={newPass} onChange={e => setNewPass(e.target.value)} />
                </div>
                <button onClick={handleUpdatePassword} className="w-full bg-blue-600 text-white py-5 rounded-2xl font-black uppercase text-[10px] tracking-widest flex items-center justify-center gap-2"><Save size={14}/> Atualizar Senha</button>
             </div>
             <button onClick={() => { if(confirm('Resetar senha para 123456?')){ localStorage.setItem(AGENDA_PASS_KEY, '123456'); setCurrentPass('123456'); alert('Restaurado!'); setShowSecurityModal(false); } }} className="w-full py-4 border-2 border-dashed border-rose-200 text-rose-500 rounded-2xl font-black uppercase text-[10px] flex items-center justify-center gap-2"><RefreshCcw size={14}/> Resetar para Padrão</button>
             <button onClick={() => setShowSecurityModal(false)} className="w-full text-slate-400 font-bold text-[10px] uppercase text-center">Fechar Configurações</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default EventsTab;
