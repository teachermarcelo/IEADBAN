
import React, { useState, useEffect } from 'react';
import { PlayCircle, Image as ImageIcon, ExternalLink, ShieldCheck, Lock, X, Plus, Trash2, Edit2, Calendar, Link as LinkIcon, AlertCircle, RefreshCcw, KeyRound, Save } from 'lucide-react';
import { MediaItem } from '../types';

interface MediaTabProps {
  mediaItems: MediaItem[];
  onSave: (m: MediaItem) => void;
  onDelete: (id: string) => void;
}

const MediaTab: React.FC<MediaTabProps> = ({ mediaItems, onSave, onDelete }) => {
  const [isAdminMode, setIsAdminMode] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');
  const [error, setError] = useState('');
  const [isFormOpen, setIsFormOpen] = useState(false);
  
  // Password Management
  const ADMIN_PASSWORD_KEY = 'ieadban_media_pass';
  const [currentPass, setCurrentPass] = useState(localStorage.getItem(ADMIN_PASSWORD_KEY) || '123456');
  const [newPass, setNewPass] = useState('');
  const [confirmNewPass, setConfirmNewPass] = useState('');

  // Admin Form State
  const [editingItem, setEditingItem] = useState<Partial<MediaItem>>({
    title: '', url: '', type: 'video', date: new Date().toISOString().split('T')[0], eventContext: ''
  });

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordInput === currentPass) {
      setIsAdminMode(true);
      setShowLoginModal(false);
      setPasswordInput('');
      setError('');
    } else {
      setError('Senha incorreta. Tente novamente.');
    }
  };

  const handleUpdatePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPass.length < 4) {
      alert('A senha deve ter pelo menos 4 dígitos.');
      return;
    }
    if (newPass !== confirmNewPass) {
      alert('As senhas não coincidem.');
      return;
    }
    localStorage.setItem(ADMIN_PASSWORD_KEY, newPass);
    setCurrentPass(newPass);
    setShowSettingsModal(false);
    setNewPass('');
    setConfirmNewPass('');
    alert('Senha alterada com sucesso!');
  };

  const handleResetPassword = () => {
    if (confirm('Deseja resetar a senha para o padrão "123456"?')) {
      localStorage.setItem(ADMIN_PASSWORD_KEY, '123456');
      setCurrentPass('123456');
      alert('Senha resetada com sucesso!');
    }
  };

  const handleSaveMedia = () => {
    if (editingItem.title && editingItem.url) {
      onSave({
        ...editingItem,
        id: editingItem.id || Date.now().toString()
      } as MediaItem);
      setIsFormOpen(false);
      setEditingItem({ title: '', url: '', type: 'video', date: new Date().toISOString().split('T')[0], eventContext: '' });
    }
  };

  return (
    <div className="space-y-10 animate-in fade-in duration-700 pb-10">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 bg-white p-10 rounded-[48px] border border-slate-100 shadow-sm relative overflow-hidden">
        <div className="relative z-10">
          <h2 className="text-4xl font-black text-slate-800 tracking-tight">Galeria & Mídia</h2>
          <p className="text-slate-400 font-bold text-xs uppercase tracking-widest mt-2 flex items-center gap-2">
            <PlayCircle size={14} className="text-blue-500" /> Transmissões, Fotos e Vídeos IEADBAN
          </p>
        </div>
        
        <div className="flex flex-wrap gap-4 relative z-10">
          {!isAdminMode ? (
            <button 
              onClick={() => setShowLoginModal(true)}
              className="bg-slate-900 text-white px-8 py-4 rounded-3xl font-black text-xs uppercase tracking-widest flex items-center gap-3 hover:bg-slate-800 transition-all shadow-xl shadow-slate-200"
            >
              <ShieldCheck size={18} className="text-blue-400" /> Mídia Admin
            </button>
          ) : (
            <div className="flex flex-wrap gap-2">
              <button 
                onClick={() => setIsFormOpen(true)}
                className="bg-blue-600 text-white px-6 py-4 rounded-3xl font-black text-[10px] uppercase tracking-widest flex items-center gap-2 hover:bg-blue-700 transition-all shadow-xl shadow-blue-100"
              >
                <Plus size={16} /> Adicionar
              </button>
              <button 
                onClick={() => setShowSettingsModal(true)}
                className="bg-slate-100 text-slate-600 px-6 py-4 rounded-3xl font-black text-[10px] uppercase tracking-widest flex items-center gap-2 hover:bg-slate-200 transition-all"
              >
                <KeyRound size={16} /> Senha
              </button>
              <button 
                onClick={() => setIsAdminMode(false)}
                className="bg-rose-50 text-rose-600 px-6 py-4 rounded-3xl font-black text-[10px] uppercase tracking-widest flex items-center gap-2 hover:bg-rose-100 transition-all"
              >
                <X size={16} /> Sair
              </button>
            </div>
          )}
        </div>
        <div className="absolute top-0 right-0 p-8 text-slate-50 opacity-10 pointer-events-none"><ImageIcon size={120} /></div>
      </div>

      {/* Media Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {mediaItems.length === 0 && (
          <div className="col-span-full py-32 text-center bg-white rounded-[56px] border-2 border-dashed border-slate-100">
             <div className="bg-slate-50 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6">
                <PlayCircle size={48} className="text-slate-200" />
             </div>
             <h3 className="text-slate-800 font-black text-xl">Galeria Vazia</h3>
             <p className="text-slate-400 font-bold text-xs uppercase tracking-widest mt-2">Aguardando conteúdos da equipe de mídia.</p>
          </div>
        )}
        
        {mediaItems.sort((a,b) => b.date.localeCompare(a.date)).map((item) => (
          <div key={item.id} className="group relative bg-white rounded-[40px] overflow-hidden shadow-sm border border-slate-50 hover:shadow-2xl transition-all duration-500 flex flex-col h-full">
             <div className="aspect-[4/3] relative overflow-hidden bg-slate-900">
                {item.type === 'video' ? (
                  <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-indigo-900 to-slate-900">
                    <PlayCircle className="text-white/40 group-hover:text-blue-400 group-hover:scale-125 transition-all duration-700" size={64} />
                    <div className="absolute bottom-4 right-4 bg-rose-600 text-[8px] text-white px-2 py-1 rounded-full font-black uppercase tracking-widest flex items-center gap-1">
                      <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" /> Vídeo / Link
                    </div>
                  </div>
                ) : (
                  <img 
                    src={item.url} 
                    alt={item.title} 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 opacity-80 group-hover:opacity-100" 
                    onError={(e) => { e.currentTarget.src = 'https://images.unsplash.com/photo-1438232992991-995b7058bbb3?auto=format&fit=crop&w=400&q=80' }}
                  />
                )}
                
                {/* Admin Quick Actions */}
                {isAdminMode && (
                  <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity z-20">
                    <button onClick={() => { setEditingItem(item); setIsFormOpen(true); }} className="bg-white/90 backdrop-blur p-3 rounded-2xl text-blue-600 hover:bg-white shadow-xl">
                      <Edit2 size={16} />
                    </button>
                    <button onClick={() => onDelete(item.id)} className="bg-white/90 backdrop-blur p-3 rounded-2xl text-rose-600 hover:bg-white shadow-xl">
                      <Trash2 size={16} />
                    </button>
                  </div>
                )}

                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 p-8 flex flex-col justify-end">
                   <div className="bg-white/10 backdrop-blur-md border border-white/20 p-4 rounded-3xl">
                      <p className="text-white font-black text-lg mb-1 leading-tight">{item.title}</p>
                      <p className="text-white/60 text-[10px] font-bold uppercase tracking-widest">{item.eventContext || 'IEADBAN'}</p>
                   </div>
                </div>
             </div>
             
             <div className="p-6 bg-white flex flex-col gap-4">
                <div className="flex justify-between items-center">
                   <div className="flex flex-col">
                      <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{item.date}</span>
                      <span className="text-sm font-black text-slate-800 line-clamp-1">{item.title}</span>
                   </div>
                   <a 
                     href={item.url} 
                     target="_blank" 
                     className="bg-blue-50 text-blue-600 p-3 rounded-2xl hover:bg-blue-600 hover:text-white transition-all shadow-sm"
                   >
                     <ExternalLink size={18} />
                   </a>
                </div>
             </div>
          </div>
        ))}
      </div>

      {/* Login Modal */}
      {showLoginModal && (
        <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-xl z-[100] flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-sm rounded-[48px] shadow-2xl p-10 animate-in zoom-in-95 duration-200">
             <div className="flex flex-col items-center text-center mb-8">
                <div className="bg-blue-50 p-6 rounded-[32px] text-blue-600 mb-6">
                   <Lock size={40} />
                </div>
                <h3 className="text-2xl font-black text-slate-800 tracking-tight">Mídia Admin</h3>
                <p className="text-slate-400 text-sm mt-1 font-medium">Digite a senha para gerenciar conteúdos</p>
             </div>
             
             <form onSubmit={handleLogin} className="space-y-4">
                <input 
                   type="password"
                   autoFocus
                   placeholder="Senha Admin"
                   className="w-full bg-slate-50 border border-slate-100 p-5 rounded-3xl text-center font-black tracking-[0.5em] outline-none focus:ring-2 ring-blue-500"
                   value={passwordInput}
                   onChange={e => setPasswordInput(e.target.value)}
                />
                {error && <div className="flex items-center gap-2 text-rose-500 text-[10px] font-black uppercase justify-center"><AlertCircle size={14}/> {error}</div>}
                <button className="w-full bg-blue-600 text-white py-5 rounded-3xl font-black uppercase tracking-widest text-xs shadow-xl shadow-blue-100 hover:bg-blue-700 transition-all">Entrar</button>
             </form>
             
             <button onClick={() => setShowLoginModal(false)} className="w-full mt-6 text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-rose-500">Cancelar</button>
          </div>
        </div>
      )}

      {/* Settings Modal (Reset/Change Password) */}
      {showSettingsModal && (
        <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-xl z-[120] flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-[48px] shadow-2xl p-10 animate-in zoom-in-95 duration-200">
             <div className="flex justify-between items-center mb-8">
                <h3 className="text-2xl font-black text-slate-800 tracking-tight">Segurança Mídia</h3>
                <button onClick={() => setShowSettingsModal(false)} className="p-2 hover:bg-slate-100 rounded-full"><X/></button>
             </div>
             
             <form onSubmit={handleUpdatePassword} className="space-y-6">
                <div className="space-y-4 bg-slate-50 p-6 rounded-[32px] border border-slate-100">
                   <h4 className="text-xs font-black uppercase text-slate-500 tracking-widest mb-2 flex items-center gap-2">
                     <KeyRound size={14} className="text-blue-500"/> Mudar Senha Mestre
                   </h4>
                   <input 
                      type="password"
                      placeholder="Nova Senha"
                      className="w-full bg-white border border-slate-200 p-4 rounded-2xl font-bold outline-none focus:ring-2 ring-blue-500"
                      value={newPass}
                      onChange={e => setNewPass(e.target.value)}
                   />
                   <input 
                      type="password"
                      placeholder="Confirmar Nova Senha"
                      className="w-full bg-white border border-slate-200 p-4 rounded-2xl font-bold outline-none focus:ring-2 ring-blue-500"
                      value={confirmNewPass}
                      onChange={e => setConfirmNewPass(e.target.value)}
                   />
                   <button type="submit" className="w-full bg-blue-600 text-white py-4 rounded-2xl font-black uppercase text-[10px] tracking-widest flex items-center justify-center gap-2">
                      <Save size={14}/> Salvar Nova Senha
                   </button>
                </div>

                <div className="pt-6 border-t border-slate-100">
                   <button 
                     type="button"
                     onClick={handleResetPassword}
                     className="w-full py-4 border-2 border-dashed border-rose-200 text-rose-500 rounded-2xl font-black uppercase text-[10px] tracking-widest hover:bg-rose-50 transition-all flex items-center justify-center gap-2"
                   >
                      <RefreshCcw size={14}/> Resetar para Padrão (123456)
                   </button>
                </div>
             </form>
          </div>
        </div>
      )}

      {/* Admin Item Modal (Editor de Conteúdos) */}
      {isFormOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[110] flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-lg rounded-[48px] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
            <div className="p-8 border-b border-slate-50 bg-slate-50/50 flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="bg-blue-600 text-white p-3 rounded-2xl">
                   <LinkIcon size={20} />
                </div>
                <h3 className="text-2xl font-black text-slate-800 tracking-tight">{editingItem.id ? 'Editar Mídia' : 'Nova Mídia'}</h3>
              </div>
              <button onClick={() => setIsFormOpen(false)} className="p-2 hover:bg-slate-200 rounded-full"><X /></button>
            </div>
            
            <div className="p-10 space-y-6">
               <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-slate-400 ml-2">Título do Conteúdo</label>
                  <input 
                    placeholder="Título (Ex: Culto da Vitória)" 
                    className="w-full bg-slate-50 p-4 rounded-2xl border border-slate-100 font-bold outline-none focus:ring-2 ring-blue-500"
                    value={editingItem.title}
                    onChange={e => setEditingItem({...editingItem, title: e.target.value})}
                  />
               </div>
               
               <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-slate-400 ml-2">Tipo</label>
                    <select 
                      className="w-full bg-slate-50 p-4 rounded-2xl border border-slate-100 font-bold outline-none focus:ring-2 ring-blue-500 appearance-none"
                      value={editingItem.type}
                      onChange={e => setEditingItem({...editingItem, type: e.target.value as 'image' | 'video'})}
                    >
                      <option value="video">Vídeo / Link</option>
                      <option value="image">Foto / URL</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-slate-400 ml-2">Data</label>
                    <input 
                      type="date"
                      className="w-full bg-slate-50 p-4 rounded-2xl border border-slate-100 font-bold outline-none focus:ring-2 ring-blue-500"
                      value={editingItem.date}
                      onChange={e => setEditingItem({...editingItem, date: e.target.value})}
                    />
                  </div>
               </div>

               <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-slate-400 ml-2">Link Externo (URL)</label>
                  <input 
                    placeholder="https://youtube.com/..." 
                    className="w-full bg-slate-50 p-4 rounded-2xl border border-slate-100 font-bold outline-none focus:ring-2 ring-blue-500"
                    value={editingItem.url}
                    onChange={e => setEditingItem({...editingItem, url: e.target.value})}
                  />
               </div>

               <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-slate-400 ml-2">Contexto / Departamento</label>
                  <input 
                    placeholder="Ex: UMADEBAN, Sede, Evento" 
                    className="w-full bg-slate-50 p-4 rounded-2xl border border-slate-100 font-bold outline-none focus:ring-2 ring-blue-500"
                    value={editingItem.eventContext}
                    onChange={e => setEditingItem({...editingItem, eventContext: e.target.value})}
                  />
               </div>

               <div className="flex gap-3 mt-4">
                 <button 
                   onClick={() => setIsFormOpen(false)}
                   className="flex-1 py-5 bg-slate-100 text-slate-500 rounded-[24px] font-black uppercase text-[10px] tracking-widest hover:bg-slate-200"
                 >
                   Cancelar
                 </button>
                 <button 
                   onClick={handleSaveMedia}
                   className="flex-[2] bg-blue-600 text-white py-5 rounded-[24px] font-black uppercase tracking-widest text-xs shadow-xl shadow-blue-100 hover:bg-blue-700 transition-all"
                 >
                   Salvar Mídia
                 </button>
               </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MediaTab;
