
import React, { useState } from 'react';
import { Department, DepartmentLink } from '../types';
import { Plus, Users, Trash2, Edit2, X, MessageCircle, Link as LinkIcon, Info, ExternalLink, Globe } from 'lucide-react';

interface Props {
  departments: Department[];
  onSave: (d: Department) => void;
  onDelete: (id: string) => void;
}

const DepartmentsTab: React.FC<Props> = ({ departments, onSave, onDelete }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editing, setEditing] = useState<Partial<Department>>({ 
    name: '', 
    description: '', 
    coordinatorName: '', 
    coordinatorWhatsapp: '',
    links: [] 
  });
  
  const [newLinkLabel, setNewLinkLabel] = useState('');
  const [newLinkUrl, setNewLinkUrl] = useState('');

  const handleSave = () => {
    if (editing.name && editing.coordinatorName) {
      onSave({ 
        ...editing, 
        id: editing.id || Date.now().toString(),
        links: editing.links || []
      } as Department);
      setIsModalOpen(false);
      resetForm();
    }
  };

  const resetForm = () => {
    setEditing({ name: '', description: '', coordinatorName: '', coordinatorWhatsapp: '', links: [] });
    setNewLinkLabel('');
    setNewLinkUrl('');
  };

  const addLink = () => {
    if (newLinkLabel && newLinkUrl) {
      const newLink: DepartmentLink = {
        id: Date.now().toString(),
        label: newLinkLabel,
        url: newLinkUrl.startsWith('http') ? newLinkUrl : `https://${newLinkUrl}`
      };
      setEditing({ ...editing, links: [...(editing.links || []), newLink] });
      setNewLinkLabel('');
      setNewLinkUrl('');
    }
  };

  const removeLink = (id: string) => {
    setEditing({ ...editing, links: (editing.links || []).filter(l => l.id !== id) });
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex justify-between items-center bg-white p-8 rounded-[40px] border border-slate-100 shadow-sm">
        <div>
          <h2 className="text-3xl font-black text-slate-800 tracking-tight">Departamentos</h2>
          <p className="text-slate-400 font-bold text-xs uppercase tracking-widest mt-1">Lideranças & Projetos IEADBAN</p>
        </div>
        <button 
          onClick={() => { resetForm(); setIsModalOpen(true); }} 
          className="bg-blue-600 text-white p-4 rounded-3xl shadow-xl shadow-blue-100 hover:scale-110 hover:bg-blue-700 transition-all active:scale-95"
        >
          <Plus size={24} />
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {departments.map(dep => (
          <div key={dep.id} className="bg-white rounded-[48px] border border-slate-100 shadow-sm hover:shadow-2xl transition-all group overflow-hidden flex flex-col">
            <div className="p-8 flex-1">
              <div className="flex justify-between items-start mb-6">
                <div className="bg-blue-50 w-16 h-16 rounded-[24px] flex items-center justify-center text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-all shadow-inner">
                  <Users size={32} />
                </div>
                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => { setEditing(dep); setIsModalOpen(true); }} className="p-3 bg-slate-50 text-slate-400 hover:text-blue-600 rounded-2xl transition-colors"><Edit2 size={18} /></button>
                  <button onClick={() => onDelete(dep.id)} className="p-3 bg-slate-50 text-slate-400 hover:text-rose-600 rounded-2xl transition-colors"><Trash2 size={18} /></button>
                </div>
              </div>
              
              <h3 className="text-2xl font-black text-slate-800 mb-3 tracking-tight">{dep.name}</h3>
              <p className="text-slate-500 text-sm leading-relaxed mb-8 font-medium">{dep.description || 'Departamento atuante na IEADBAN Balsa Nova.'}</p>
              
              <div className="space-y-4">
                <div className="bg-slate-50 p-5 rounded-[28px] border border-slate-100">
                  <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mb-3 flex items-center gap-2">
                    <Info size={12} /> Coordenação
                  </p>
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-sm font-black text-slate-800">{dep.coordinatorName}</p>
                      <p className="text-[10px] font-bold text-slate-400">{dep.coordinatorWhatsapp}</p>
                    </div>
                    {dep.coordinatorWhatsapp && (
                      <a 
                        href={`https://wa.me/55${dep.coordinatorWhatsapp.replace(/\D/g,'')}`}
                        target="_blank"
                        className="bg-emerald-500 text-white p-2.5 rounded-xl hover:scale-110 transition-all shadow-lg shadow-emerald-100"
                      >
                        <MessageCircle size={18} />
                      </a>
                    )}
                  </div>
                </div>

                {dep.links && dep.links.length > 0 && (
                  <div className="space-y-2">
                    <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mb-1 ml-1">Links Úteis</p>
                    <div className="flex flex-wrap gap-2">
                      {dep.links.map(link => (
                        <a 
                          key={link.id}
                          href={link.url}
                          target="_blank"
                          className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-100 rounded-xl text-xs font-bold text-slate-600 hover:border-blue-200 hover:text-blue-600 transition-all shadow-sm"
                        >
                          <Globe size={12} />
                          {link.label}
                          <ExternalLink size={10} />
                        </a>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
            <div className="h-2 bg-gradient-to-r from-blue-400 to-indigo-600" />
          </div>
        ))}

        {departments.length === 0 && (
          <div className="col-span-full py-24 text-center bg-white rounded-[48px] border-2 border-dashed border-slate-100">
             <div className="bg-slate-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                <Users size={40} className="text-slate-200" />
             </div>
             <p className="text-slate-400 font-black uppercase tracking-widest text-xs">Nenhum departamento registrado</p>
          </div>
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-[80] flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-2xl rounded-[48px] shadow-2xl overflow-hidden flex flex-col animate-in zoom-in-95 duration-300 max-h-[90vh]">
            <div className="p-8 border-b border-slate-50 flex justify-between items-center bg-slate-50/50">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-blue-600 text-white rounded-2xl shadow-lg shadow-blue-100">
                  <Users size={20} />
                </div>
                <h3 className="text-2xl font-black text-slate-800 tracking-tight">Configurar Departamento</h3>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-slate-200 rounded-full transition-colors"><X /></button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-8 space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-slate-400 ml-2">Nome do Departamento</label>
                  <input 
                    placeholder="Ex: UMADEBAN" 
                    className="w-full bg-slate-50 p-4 rounded-2xl border border-slate-100 outline-none focus:ring-2 ring-blue-500 font-bold"
                    value={editing.name}
                    onChange={e => setEditing({...editing, name: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-slate-400 ml-2">Coordenador(a)</label>
                  <input 
                    placeholder="Nome da pessoa responsável" 
                    className="w-full bg-slate-50 p-4 rounded-2xl border border-slate-100 outline-none focus:ring-2 ring-blue-500 font-bold"
                    value={editing.coordinatorName}
                    onChange={e => setEditing({...editing, coordinatorName: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-slate-400 ml-2">WhatsApp Coordenador</label>
                  <input 
                    placeholder="(41) 99999-9999" 
                    className="w-full bg-slate-50 p-4 rounded-2xl border border-slate-100 outline-none focus:ring-2 ring-blue-500 font-bold"
                    value={editing.coordinatorWhatsapp}
                    onChange={e => setEditing({...editing, coordinatorWhatsapp: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-slate-400 ml-2">Descrição Curta</label>
                  <input 
                    placeholder="Objetivo do departamento" 
                    className="w-full bg-slate-50 p-4 rounded-2xl border border-slate-100 outline-none focus:ring-2 ring-blue-500 font-bold"
                    value={editing.description}
                    onChange={e => setEditing({...editing, description: e.target.value})}
                  />
                </div>
              </div>

              <div className="bg-slate-50 p-8 rounded-[32px] border border-slate-100 space-y-4">
                <div className="flex items-center gap-2 mb-2">
                  <LinkIcon size={18} className="text-blue-600" />
                  <h4 className="text-xs font-black uppercase tracking-widest text-slate-600">Links Externos</h4>
                </div>
                
                <div className="flex flex-wrap gap-2 mb-4">
                  {(editing.links || []).map(link => (
                    <div key={link.id} className="flex items-center gap-2 bg-white px-4 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 shadow-sm">
                      <Globe size={12} />
                      {link.label}
                      <button onClick={() => removeLink(link.id)} className="text-slate-300 hover:text-rose-500 ml-1"><X size={14}/></button>
                    </div>
                  ))}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
                  <div className="md:col-span-4">
                    <input 
                      placeholder="Nome do link" 
                      className="w-full bg-white p-3 rounded-xl border border-slate-200 outline-none text-sm font-bold"
                      value={newLinkLabel}
                      onChange={e => setNewLinkLabel(e.target.value)}
                    />
                  </div>
                  <div className="md:col-span-6">
                    <input 
                      placeholder="URL (ex: instagram.com/...)" 
                      className="w-full bg-white p-3 rounded-xl border border-slate-200 outline-none text-sm"
                      value={newLinkUrl}
                      onChange={e => setNewLinkUrl(e.target.value)}
                    />
                  </div>
                  <button 
                    onClick={addLink}
                    className="md:col-span-2 bg-slate-800 text-white p-3 rounded-xl font-black text-[10px] uppercase hover:bg-slate-900 transition-all"
                  >
                    Adicionar
                  </button>
                </div>
              </div>
            </div>

            <div className="p-8 bg-slate-50 flex gap-4">
              <button onClick={() => setIsModalOpen(false)} className="flex-1 py-4 bg-white border border-slate-200 text-slate-500 rounded-[20px] font-black uppercase tracking-widest text-xs hover:bg-slate-100 transition-colors">Cancelar</button>
              <button onClick={handleSave} className="flex-[2] py-4 bg-blue-600 text-white rounded-[20px] font-black uppercase tracking-widest text-xs shadow-xl shadow-blue-100 hover:bg-blue-700 transition-all active:scale-95">Salvar Departamento</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DepartmentsTab;
