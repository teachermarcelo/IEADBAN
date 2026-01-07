
import React, { useState } from 'react';
import { Waves, Plus, Search, UserPlus, X, Trash2, Edit2, ShieldCheck, Lock, MessageCircle, Save, KeyRound, RefreshCcw, CheckCircle, Clock, Calendar, BarChart3 } from 'lucide-react';
import { Baptism, Congregation } from '../types';

interface BaptismsTabProps {
  baptisms: Baptism[];
  congregations: Congregation[];
  onSave: (b: Baptism) => void;
  onDelete: (id: string) => void;
}

const BaptismsTab: React.FC<BaptismsTabProps> = ({ baptisms, congregations, onSave, onDelete }) => {
  const [isAdminMode, setIsAdminMode] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showSecurityModal, setShowSecurityModal] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');
  const [error, setError] = useState('');
  
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingBaptism, setEditingBaptism] = useState<Partial<Baptism> | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  // Password Management
  const BAPT_PASS_KEY = 'ieadban_bapt_pass';
  const [currentPass, setCurrentPass] = useState(localStorage.getItem(BAPT_PASS_KEY) || '123456');
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
    localStorage.setItem(BAPT_PASS_KEY, newPass);
    setCurrentPass(newPass);
    setShowSecurityModal(false);
    setNewPass('');
    alert('Senha atualizada!');
  };

  const openForm = (baptism?: Baptism) => {
    setEditingBaptism(baptism || { 
      name: '', 
      whatsapp: '', 
      status: 'pendente',
      baptismDate: new Date().toISOString().split('T')[0],
      congregationId: congregations[0]?.id || ''
    });
    setIsFormOpen(true);
  };

  const saveBaptism = () => {
    if (editingBaptism?.name && editingBaptism?.whatsapp && editingBaptism?.baptismDate) {
      onSave({
        ...editingBaptism,
        id: editingBaptism.id || Date.now().toString()
      } as Baptism);
      setIsFormOpen(false);
    }
  };

  const toggleStatus = (baptism: Baptism) => {
    onSave({
      ...baptism,
      status: baptism.status === 'confirmado' ? 'pendente' : 'confirmado'
    });
  };

  const getYearlyStats = () => {
    const stats: { [year: string]: number } = {};
    baptisms.filter(b => b.status === 'confirmado').forEach(b => {
      const year = b.baptismDate.split('-')[0];
      stats[year] = (stats[year] || 0) + 1;
    });
    return Object.entries(stats).sort((a, b) => b[0].localeCompare(a[0]));
  };

  const filtered = baptisms.filter(b => b.name.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <div className="space-y-10 animate-in fade-in duration-700 pb-20">
      {/* Header */}
      <div className="bg-white p-10 rounded-[48px] border border-slate-100 shadow-sm flex flex-col md:flex-row justify-between items-center gap-8">
        <div>
          <h2 className="text-4xl font-black text-slate-800 tracking-tight">Batismos</h2>
          <p className="text-slate-400 font-bold text-xs uppercase tracking-widest mt-2 flex items-center gap-2">
            <Waves size={14} className="text-cyan-500" /> Sepultamento para o mundo, vida para Cristo
          </p>
        </div>
        
        <div className="flex gap-4 w-full md:w-auto">
          {!isAdminMode ? (
            <button 
              onClick={() => setShowLoginModal(true)}
              className="bg-slate-900 text-white px-8 py-4 rounded-3xl font-black text-xs uppercase tracking-widest flex items-center gap-3 hover:bg-slate-800 transition-all shadow-xl shadow-slate-200"
            >
              <ShieldCheck size={18} className="text-blue-400" /> Admin Batismo
            </button>
          ) : (
            <div className="flex gap-2">
               <button onClick={() => setShowSecurityModal(true)} className="p-4 bg-slate-100 text-slate-600 rounded-2xl hover:bg-slate-200"><KeyRound size={20}/></button>
               <button onClick={() => setIsAdminMode(false)} className="bg-rose-50 text-rose-600 px-6 py-4 rounded-2xl font-black text-xs uppercase tracking-widest flex items-center gap-2">Sair Admin</button>
            </div>
          )}
          <button 
            onClick={() => openForm()}
            className="flex-1 md:flex-none bg-cyan-600 text-white px-8 py-4 rounded-3xl font-black text-xs uppercase tracking-widest flex items-center gap-3 hover:bg-cyan-700 transition-all shadow-xl shadow-cyan-100"
          >
            <UserPlus size={18} /> Novo Candidato
          </button>
        </div>
      </div>

      {/* Yearly Statistics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-8 rounded-[40px] border border-slate-50 shadow-sm flex items-center gap-6">
           <div className="bg-cyan-50 p-4 rounded-2xl text-cyan-600"><BarChart3 size={24} /></div>
           <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Total Confirmados</p>
              <p className="text-3xl font-black text-slate-800">{baptisms.filter(b => b.status === 'confirmado').length}</p>
           </div>
        </div>
        {getYearlyStats().slice(0, 3).map(([year, count]) => (
          <div key={year} className="bg-white p-8 rounded-[40px] border border-slate-50 shadow-sm flex items-center gap-6">
             <div className="bg-slate-900 p-4 rounded-2xl text-white"><Calendar size={24} /></div>
             <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Confirmados em {year}</p>
                <p className="text-3xl font-black text-slate-800">{count}</p>
             </div>
          </div>
        ))}
      </div>

      {/* Main List */}
      <div className="space-y-6">
        <div className="relative max-w-md">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input 
            placeholder="Buscar candidato..." 
            className="w-full pl-12 pr-4 py-4 bg-white border border-slate-100 rounded-3xl font-bold outline-none focus:ring-2 ring-blue-500"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map(b => (
            <div key={b.id} className="bg-white p-8 rounded-[40px] border border-slate-50 shadow-sm hover:shadow-xl transition-all group relative overflow-hidden">
              <div className="flex justify-between items-start mb-6">
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center font-black text-xl shadow-inner ${b.status === 'confirmado' ? 'bg-emerald-50 text-emerald-500' : 'bg-amber-50 text-amber-500'}`}>
                  {b.name.charAt(0)}
                </div>
                {isAdminMode && (
                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => openForm(b)} className="p-3 bg-slate-50 text-blue-600 rounded-xl hover:bg-white shadow-sm"><Edit2 size={16}/></button>
                    <button onClick={() => onDelete(b.id)} className="p-3 bg-slate-50 text-rose-600 rounded-xl hover:bg-white shadow-sm"><Trash2 size={16}/></button>
                  </div>
                )}
              </div>
              
              <h3 className="text-xl font-black text-slate-800 mb-1">{b.name}</h3>
              <div className="flex items-center gap-2 mb-6">
                 <div className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest flex items-center gap-1.5 ${b.status === 'confirmado' ? 'bg-emerald-500 text-white' : 'bg-amber-100 text-amber-600'}`}>
                    {b.status === 'confirmado' ? <CheckCircle size={10}/> : <Clock size={10}/>}
                    {b.status}
                 </div>
                 <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">• {b.baptismDate.split('-')[0]}</span>
              </div>

              <div className="space-y-4">
                <div className="flex justify-between items-center bg-slate-50 p-4 rounded-2xl">
                  <div>
                    <p className="text-[9px] font-black uppercase text-slate-400 tracking-widest">Congregação</p>
                    <p className="text-xs font-bold text-slate-700 truncate max-w-[150px]">
                      {congregations.find(c => c.id === b.congregationId)?.name || 'IEADBAN'}
                    </p>
                  </div>
                  <a 
                    href={`https://wa.me/55${b.whatsapp.replace(/\D/g,'')}`}
                    target="_blank"
                    className="p-3 bg-emerald-500 text-white rounded-xl shadow-lg shadow-emerald-100 hover:scale-110 transition-all"
                  >
                    <MessageCircle size={18} />
                  </a>
                </div>

                {isAdminMode && (
                  <button 
                    onClick={() => toggleStatus(b)}
                    className={`w-full py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-2 transition-all ${b.status === 'confirmado' ? 'bg-amber-50 text-amber-600' : 'bg-emerald-500 text-white shadow-lg shadow-emerald-100'}`}
                  >
                    {b.status === 'confirmado' ? 'Marcar como Pendente' : 'Confirmar Batismo'}
                  </button>
                )}
              </div>
            </div>
          ))}
          {filtered.length === 0 && (
            <div className="col-span-full py-20 text-center bg-white rounded-[48px] border-2 border-dashed border-slate-100">
               <Waves size={48} className="text-slate-200 mx-auto mb-4" />
               <p className="text-slate-400 font-bold uppercase text-xs tracking-widest">Nenhum registro encontrado</p>
            </div>
          )}
        </div>
      </div>

      {/* Form Modal */}
      {isFormOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-[110] flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-lg rounded-[48px] shadow-2xl animate-in zoom-in-95 duration-300 overflow-hidden">
             <div className="p-8 border-b border-slate-50 flex justify-between items-center bg-slate-50/50">
               <h3 className="text-2xl font-black text-slate-800 tracking-tight">Ficha de Batismo</h3>
               <button onClick={() => setIsFormOpen(false)} className="p-2 hover:bg-slate-100 rounded-full"><X/></button>
             </div>
             <div className="p-10 space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-slate-400 ml-2">Nome Completo</label>
                  <input className="w-full bg-slate-50 p-4 rounded-2xl border border-slate-100 font-bold outline-none" value={editingBaptism?.name} onChange={e => setEditingBaptism({...editingBaptism, name: e.target.value})} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-slate-400 ml-2">WhatsApp</label>
                    <input placeholder="(41) 99999-9999" className="w-full bg-slate-50 p-4 rounded-2xl border border-slate-100 font-bold outline-none" value={editingBaptism?.whatsapp} onChange={e => setEditingBaptism({...editingBaptism, whatsapp: e.target.value})} />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-slate-400 ml-2">Data do Batismo</label>
                    <input type="date" className="w-full bg-slate-50 p-4 rounded-2xl border border-slate-100 font-bold outline-none" value={editingBaptism?.baptismDate} onChange={e => setEditingBaptism({...editingBaptism, baptismDate: e.target.value})} />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-slate-400 ml-2">Congregação</label>
                    <select 
                      className="w-full bg-slate-50 p-4 rounded-2xl border border-slate-100 font-bold outline-none appearance-none"
                      value={editingBaptism?.congregationId}
                      onChange={e => setEditingBaptism({...editingBaptism, congregationId: e.target.value})}
                    >
                      {congregations.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-slate-400 ml-2">Status Inicial</label>
                    <select 
                      className="w-full bg-slate-50 p-4 rounded-2xl border border-slate-100 font-bold outline-none appearance-none"
                      value={editingBaptism?.status}
                      onChange={e => setEditingBaptism({...editingBaptism, status: e.target.value as 'confirmado' | 'pendente'})}
                    >
                      <option value="pendente">Pendente</option>
                      <option value="confirmado">Confirmado</option>
                    </select>
                  </div>
                </div>
                <button onClick={saveBaptism} className="w-full bg-cyan-600 text-white py-5 rounded-3xl font-black uppercase tracking-widest text-xs shadow-xl shadow-cyan-100 hover:bg-cyan-700 transition-all">Salvar Ficha</button>
             </div>
          </div>
        </div>
      )}

      {/* Login Modal */}
      {showLoginModal && (
        <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-xl z-[130] flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-sm rounded-[48px] shadow-2xl p-10">
             <div className="flex flex-col items-center text-center mb-8">
                <div className="bg-cyan-50 p-6 rounded-[32px] text-cyan-600 mb-6"><Lock size={40} /></div>
                <h3 className="text-2xl font-black text-slate-800 tracking-tight">Admin Batismo</h3>
             </div>
             <form onSubmit={handleLogin} className="space-y-4">
                <input type="password" autoFocus placeholder="Senha" className="w-full bg-slate-50 border border-slate-100 p-5 rounded-3xl text-center font-black tracking-[0.5em] outline-none" value={passwordInput} onChange={e => setPasswordInput(e.target.value)} />
                {error && <p className="text-rose-500 text-[10px] font-black text-center uppercase">{error}</p>}
                <button className="w-full bg-cyan-600 text-white py-5 rounded-3xl font-black uppercase tracking-widest text-xs">Entrar</button>
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
                <h3 className="text-2xl font-black text-slate-800 tracking-tight">Segurança Batismo</h3>
                <button onClick={() => setShowSecurityModal(false)} className="p-2 hover:bg-slate-100 rounded-full"><X/></button>
             </div>
             <form onSubmit={handleUpdatePassword} className="space-y-6">
                <div className="space-y-4 bg-slate-50 p-6 rounded-[32px] border border-slate-100">
                   <h4 className="text-xs font-black uppercase text-slate-500 tracking-widest mb-2">Nova Senha Admin</h4>
                   <input type="password" placeholder="Mínimo 4 dígitos" className="w-full bg-white border border-slate-200 p-4 rounded-2xl font-bold outline-none" value={newPass} onChange={e => setNewPass(e.target.value)} />
                   <button type="submit" className="w-full bg-cyan-600 text-white py-4 rounded-2xl font-black uppercase text-[10px] tracking-widest flex items-center justify-center gap-2"><Save size={14}/> Salvar Senha</button>
                </div>
                <div className="pt-6 border-t border-slate-100">
                   <button type="button" onClick={() => { localStorage.setItem(BAPT_PASS_KEY, '123456'); setCurrentPass('123456'); alert('Padrão 123456 restaurado'); setShowSecurityModal(false); }} className="w-full py-4 border-2 border-dashed border-rose-200 text-rose-500 rounded-2xl font-black uppercase text-[10px] flex items-center justify-center gap-2"><RefreshCcw size={14}/> Resetar Padrão</button>
                </div>
             </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default BaptismsTab;
