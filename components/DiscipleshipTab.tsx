
import React, { useState } from 'react';
import { HeartHandshake, Plus, Search, UserPlus, X, Trash2, Edit2, ShieldCheck, Lock, MessageCircle, ArrowRight, Save, KeyRound, RefreshCcw, UserCheck, Calendar } from 'lucide-react';
import { NewConvert, Congregation, Member, MemberRole, MaritalStatus } from '../types';

interface DiscipleshipTabProps {
  newConverts: NewConvert[];
  congregations: Congregation[];
  onSaveConvert: (c: NewConvert) => void;
  onDeleteConvert: (id: string) => void;
  onConvertToMember: (m: Member, convertId: string) => void;
}

const DiscipleshipTab: React.FC<DiscipleshipTabProps> = ({ newConverts, congregations, onSaveConvert, onDeleteConvert, onConvertToMember }) => {
  const [isAdminMode, setIsAdminMode] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showSecurityModal, setShowSecurityModal] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');
  const [error, setError] = useState('');
  
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingConvert, setEditingConvert] = useState<Partial<NewConvert> | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  // Conversão para Membro
  const [showConvertModal, setShowConvertModal] = useState<NewConvert | null>(null);
  const [conversionData, setConversionData] = useState({ congregationId: congregations[0]?.id || '', role: MemberRole.MEMBRO });

  // Senha do Admin Discipulado
  const DISC_PASS_KEY = 'ieadban_disc_pass';
  const [currentPass, setCurrentPass] = useState(localStorage.getItem(DISC_PASS_KEY) || '123456');
  const [newPass, setNewPass] = useState('');

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
    localStorage.setItem(DISC_PASS_KEY, newPass);
    setCurrentPass(newPass);
    setShowSecurityModal(false);
    setNewPass('');
    alert('Senha atualizada!');
  };

  const openForm = (convert?: NewConvert) => {
    setEditingConvert(convert || { 
      name: '', 
      whatsapp: '', 
      discipler: '', 
      decisionDate: new Date().toISOString().split('T')[0],
      observations: '' 
    });
    setIsFormOpen(true);
  };

  const saveConvert = () => {
    if (editingConvert?.name && editingConvert?.whatsapp) {
      onSaveConvert({
        ...editingConvert,
        id: editingConvert.id || Date.now().toString()
      } as NewConvert);
      setIsFormOpen(false);
    }
  };

  const handleConvertToMember = () => {
    if (!showConvertModal) return;
    
    const newMember: Member = {
      id: Date.now().toString(),
      name: showConvertModal.name,
      whatsapp: showConvertModal.whatsapp,
      role: conversionData.role,
      congregationId: conversionData.congregationId,
      membershipDate: new Date().toISOString().split('T')[0],
      maritalStatus: MaritalStatus.SOLTEIRO
    };

    onConvertToMember(newMember, showConvertModal.id);
    setShowConvertModal(null);
    alert(`${showConvertModal.name} agora é oficialmente um membro!`);
  };

  const filtered = newConverts.filter(c => c.name.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <div className="space-y-10 animate-in fade-in duration-700 pb-20">
      {/* Header */}
      <div className="bg-white p-10 rounded-[48px] border border-slate-100 shadow-sm flex flex-col md:flex-row justify-between items-center gap-8">
        <div>
          <h2 className="text-4xl font-black text-slate-800 tracking-tight">Discipulado</h2>
          <p className="text-slate-400 font-bold text-xs uppercase tracking-widest mt-2 flex items-center gap-2">
            <HeartHandshake size={14} className="text-rose-500" /> Cuidado com as Novas Criaturas
          </p>
        </div>
        
        <div className="flex gap-4 w-full md:w-auto">
          {!isAdminMode ? (
            <button 
              onClick={() => setShowLoginModal(true)}
              className="bg-slate-900 text-white px-8 py-4 rounded-3xl font-black text-xs uppercase tracking-widest flex items-center gap-3 hover:bg-slate-800 transition-all shadow-xl shadow-slate-200"
            >
              <ShieldCheck size={18} className="text-blue-400" /> Painel Admin
            </button>
          ) : (
            <div className="flex gap-2">
               <button onClick={() => setShowSecurityModal(true)} className="p-4 bg-slate-100 text-slate-600 rounded-2xl hover:bg-slate-200"><KeyRound size={20}/></button>
               <button onClick={() => setIsAdminMode(false)} className="bg-rose-50 text-rose-600 px-6 py-4 rounded-2xl font-black text-xs uppercase tracking-widest flex items-center gap-2">Sair Admin</button>
            </div>
          )}
          <button 
            onClick={() => openForm()}
            className="flex-1 md:flex-none bg-blue-600 text-white px-8 py-4 rounded-3xl font-black text-xs uppercase tracking-widest flex items-center gap-3 hover:bg-blue-700 transition-all shadow-xl shadow-blue-100"
          >
            <UserPlus size={18} /> Novo Convertido
          </button>
        </div>
      </div>

      {/* Main List */}
      <div className="space-y-6">
        <div className="relative max-w-md">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input 
            placeholder="Buscar por nome..." 
            className="w-full pl-12 pr-4 py-4 bg-white border border-slate-100 rounded-3xl font-bold outline-none focus:ring-2 ring-blue-500"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map(c => (
            <div key={c.id} className="bg-white p-8 rounded-[40px] border border-slate-50 shadow-sm hover:shadow-xl transition-all group relative overflow-hidden">
              <div className="flex justify-between items-start mb-6">
                <div className="w-14 h-14 rounded-2xl bg-rose-50 text-rose-500 flex items-center justify-center font-black text-xl">
                  {c.name.charAt(0)}
                </div>
                {isAdminMode && (
                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => openForm(c)} className="p-3 bg-slate-50 text-blue-600 rounded-xl hover:bg-white shadow-sm"><Edit2 size={16}/></button>
                    <button onClick={() => onDeleteConvert(c.id)} className="p-3 bg-slate-50 text-rose-600 rounded-xl hover:bg-white shadow-sm"><Trash2 size={16}/></button>
                  </div>
                )}
              </div>
              
              <h3 className="text-xl font-black text-slate-800 mb-1">{c.name}</h3>
              <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-6 flex items-center gap-1.5">
                <Calendar size={12}/> Decisão: {c.decisionDate.split('-').reverse().join('/')}
              </p>

              <div className="space-y-4">
                <div className="flex justify-between items-center bg-slate-50 p-4 rounded-2xl">
                  <div>
                    <p className="text-[9px] font-black uppercase text-slate-400 tracking-widest">Discipulador</p>
                    <p className="text-xs font-bold text-slate-700">{c.discipler || 'Não vinculado'}</p>
                  </div>
                  <a 
                    href={`https://wa.me/55${c.whatsapp.replace(/\D/g,'')}`}
                    target="_blank"
                    className="p-3 bg-emerald-500 text-white rounded-xl shadow-lg shadow-emerald-100 hover:scale-110 transition-all"
                  >
                    <MessageCircle size={18} />
                  </a>
                </div>

                {isAdminMode && (
                  <button 
                    onClick={() => setShowConvertModal(c)}
                    className="w-full bg-blue-50 text-blue-600 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-blue-600 hover:text-white transition-all group/btn"
                  >
                    <UserCheck size={14} /> Tornar Membro <ArrowRight size={14} className="group-hover/btn:translate-x-1 transition-transform" />
                  </button>
                )}
              </div>
            </div>
          ))}
          {filtered.length === 0 && (
            <div className="col-span-full py-20 text-center bg-white rounded-[48px] border-2 border-dashed border-slate-100">
               <HeartHandshake size={48} className="text-slate-200 mx-auto mb-4" />
               <p className="text-slate-400 font-bold uppercase text-xs tracking-widest">Nenhum registro encontrado</p>
            </div>
          )}
        </div>
      </div>

      {/* Form Modal */}
      {isFormOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-[110] flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-lg rounded-[48px] shadow-2xl animate-in zoom-in-95 duration-300">
             <div className="p-8 border-b border-slate-50 flex justify-between items-center">
               <h3 className="text-2xl font-black text-slate-800 tracking-tight">Ficha do Convertido</h3>
               <button onClick={() => setIsFormOpen(false)} className="p-2 hover:bg-slate-100 rounded-full"><X/></button>
             </div>
             <div className="p-10 space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-slate-400 ml-2">Nome Completo</label>
                  <input className="w-full bg-slate-50 p-4 rounded-2xl border border-slate-100 font-bold outline-none" value={editingConvert?.name} onChange={e => setEditingConvert({...editingConvert, name: e.target.value})} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-slate-400 ml-2">WhatsApp</label>
                    <input placeholder="(41) 99999-9999" className="w-full bg-slate-50 p-4 rounded-2xl border border-slate-100 font-bold outline-none" value={editingConvert?.whatsapp} onChange={e => setEditingConvert({...editingConvert, whatsapp: e.target.value})} />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-slate-400 ml-2">Data Decisão</label>
                    <input type="date" className="w-full bg-slate-50 p-4 rounded-2xl border border-slate-100 font-bold outline-none" value={editingConvert?.decisionDate} onChange={e => setEditingConvert({...editingConvert, decisionDate: e.target.value})} />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-slate-400 ml-2">Discipulador (Opcional)</label>
                  <input placeholder="Quem está cuidando?" className="w-full bg-slate-50 p-4 rounded-2xl border border-slate-100 font-bold outline-none" value={editingConvert?.discipler} onChange={e => setEditingConvert({...editingConvert, discipler: e.target.value})} />
                </div>
                <button onClick={saveConvert} className="w-full bg-blue-600 text-white py-5 rounded-3xl font-black uppercase tracking-widest text-xs shadow-xl shadow-blue-100 hover:bg-blue-700 transition-all">Salvar Registro</button>
             </div>
          </div>
        </div>
      )}

      {/* Conversion Modal */}
      {showConvertModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-[120] flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-[48px] shadow-2xl p-10 animate-in zoom-in-95 duration-300">
             <div className="text-center mb-8">
                <div className="bg-blue-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto text-blue-600 mb-4"><UserCheck size={40}/></div>
                <h3 className="text-2xl font-black text-slate-800 tracking-tight">Tornar Membro</h3>
                <p className="text-slate-400 text-sm font-medium mt-1">Defina a congregação e o cargo de {showConvertModal.name}</p>
             </div>
             
             <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-slate-400 ml-2">Congregação Vinculada</label>
                  <select 
                    className="w-full bg-slate-50 p-4 rounded-2xl border border-slate-100 font-bold outline-none"
                    value={conversionData.congregationId}
                    onChange={e => setConversionData({...conversionData, congregationId: e.target.value})}
                  >
                    {congregations.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-slate-400 ml-2">Cargo Inicial</label>
                  <select 
                    className="w-full bg-slate-50 p-4 rounded-2xl border border-slate-100 font-bold outline-none"
                    value={conversionData.role}
                    onChange={e => setConversionData({...conversionData, role: e.target.value as MemberRole})}
                  >
                    {Object.values(MemberRole).map(r => <option key={r} value={r}>{r}</option>)}
                  </select>
                </div>
                <div className="flex gap-3 pt-4">
                   <button onClick={() => setShowConvertModal(null)} className="flex-1 py-4 bg-slate-50 text-slate-400 rounded-2xl font-black uppercase text-[10px]">Cancelar</button>
                   <button onClick={handleConvertToMember} className="flex-[2] py-4 bg-blue-600 text-white rounded-2xl font-black uppercase text-[10px] shadow-xl shadow-blue-100">Confirmar Conversão</button>
                </div>
             </div>
          </div>
        </div>
      )}

      {/* Login Modal */}
      {showLoginModal && (
        <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-xl z-[130] flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-sm rounded-[48px] shadow-2xl p-10">
             <div className="flex flex-col items-center text-center mb-8">
                <div className="bg-blue-50 p-6 rounded-[32px] text-blue-600 mb-6"><Lock size={40} /></div>
                <h3 className="text-2xl font-black text-slate-800 tracking-tight">Admin Discipulado</h3>
             </div>
             <form onSubmit={handleLogin} className="space-y-4">
                <input type="password" autoFocus placeholder="Senha" className="w-full bg-slate-50 border border-slate-100 p-5 rounded-3xl text-center font-black tracking-[0.5em] outline-none" value={passwordInput} onChange={e => setPasswordInput(e.target.value)} />
                {error && <p className="text-rose-500 text-[10px] font-black text-center uppercase">{error}</p>}
                <button className="w-full bg-blue-600 text-white py-5 rounded-3xl font-black uppercase tracking-widest text-xs">Entrar</button>
             </form>
             <button onClick={() => setShowLoginModal(false)} className="w-full mt-6 text-[10px] font-black text-slate-400 uppercase">Cancelar</button>
          </div>
        </div>
      )}

      {/* Security Modal */}
      {showSecurityModal && (
        <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-xl z-[140] flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-[48px] shadow-2xl p-10">
             <div className="flex justify-between items-center mb-8">
                <h3 className="text-2xl font-black text-slate-800 tracking-tight">Segurança</h3>
                <button onClick={() => setShowSecurityModal(false)} className="p-2 hover:bg-slate-100 rounded-full"><X/></button>
             </div>
             <form onSubmit={handleUpdatePassword} className="space-y-6">
                <div className="space-y-4 bg-slate-50 p-6 rounded-[32px] border border-slate-100">
                   <h4 className="text-xs font-black uppercase text-slate-500 tracking-widest mb-2">Nova Senha Admin</h4>
                   <input type="password" placeholder="Mínimo 4 dígitos" className="w-full bg-white border border-slate-200 p-4 rounded-2xl font-bold outline-none" value={newPass} onChange={e => setNewPass(e.target.value)} />
                   <button type="submit" className="w-full bg-blue-600 text-white py-4 rounded-2xl font-black uppercase text-[10px] tracking-widest flex items-center justify-center gap-2"><Save size={14}/> Salvar Senha</button>
                </div>
                <div className="pt-6 border-t border-slate-100">
                   <button type="button" onClick={() => { localStorage.setItem(DISC_PASS_KEY, '123456'); setCurrentPass('123456'); alert('Padrão 123456 restaurado'); setShowSecurityModal(false); }} className="w-full py-4 border-2 border-dashed border-rose-200 text-rose-500 rounded-2xl font-black uppercase text-[10px] flex items-center justify-center gap-2"><RefreshCcw size={14}/> Resetar Padrão</button>
                </div>
             </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default DiscipleshipTab;
