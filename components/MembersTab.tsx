
import React, { useState } from 'react';
import { Member, Congregation, MemberRole, MaritalStatus } from '../types';
import { Plus, Search, MessageCircle, Edit2, Trash2, UserPlus, X, FileText, User, MapPin, Calendar, Heart } from 'lucide-react';

interface MembersTabProps {
  members: Member[];
  congregations: Congregation[];
  onAdd: (m: Member) => void;
  onUpdate: (m: Member) => void;
  onDelete: (id: string) => void;
}

const MembersTab: React.FC<MembersTabProps> = ({ members, congregations, onAdd, onUpdate, onDelete }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingMember, setEditingMember] = useState<Member | null>(null);

  const initialFormData: Partial<Member> = {
    name: '',
    whatsapp: '',
    role: MemberRole.MEMBRO,
    congregationId: congregations[0]?.id || '',
    email: '',
    birthDate: '',
    cpf: '',
    rg: '',
    address: '',
    maritalStatus: MaritalStatus.SOLTEIRO,
    spouseName: '',
    fatherName: '',
    motherName: '',
    baptismDate: '',
    membershipDate: '',
    occupation: ''
  };

  const [formData, setFormData] = useState<Partial<Member>>(initialFormData);

  const filteredMembers = members.filter(m => 
    m.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    m.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingMember) {
      onUpdate({ ...editingMember, ...formData } as Member);
    } else {
      onAdd({
        ...formData,
        id: Date.now().toString(),
      } as Member);
    }
    closeForm();
  };

  const closeForm = () => {
    setIsFormOpen(false);
    setEditingMember(null);
    setFormData(initialFormData);
  };

  const handleEdit = (m: Member) => {
    setEditingMember(m);
    setFormData(m);
    setIsFormOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
        <div className="relative w-full sm:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input
            type="text"
            placeholder="Buscar por nome ou cargo..."
            className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm transition-all"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <button
          onClick={() => setIsFormOpen(true)}
          className="bg-blue-600 text-white px-8 py-3 rounded-2xl font-black flex items-center gap-2 hover:bg-blue-700 shadow-xl shadow-blue-100 transition-all w-full sm:w-auto justify-center active:scale-95"
        >
          <UserPlus size={20} />
          Cadastrar Membro
        </button>
      </div>

      <div className="bg-white rounded-[32px] border border-slate-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50 border-b border-slate-100">
              <tr>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Membro / ID</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Cargo e Local</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Estado Civil</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">WhatsApp</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filteredMembers.map((m) => (
                <tr key={m.id} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-50 to-blue-100 text-blue-600 flex items-center justify-center font-black text-lg shadow-inner">
                        {m.name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-black text-slate-800">{m.name}</p>
                        <p className="text-[10px] text-slate-400 font-bold">Matrícula: #{m.id.slice(-5)}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <span className={`inline-block px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider mb-1 ${
                      m.role === MemberRole.PASTOR ? 'bg-purple-50 text-purple-600 border border-purple-100' :
                      m.role === MemberRole.EVANGELISTA ? 'bg-blue-50 text-blue-600 border border-blue-100' :
                      m.role === MemberRole.PRESBITERO ? 'bg-indigo-50 text-indigo-600 border border-indigo-100' :
                      'bg-slate-50 text-slate-500 border border-slate-100'
                    }`}>
                      {m.role}
                    </span>
                    <p className="text-xs font-bold text-slate-400 truncate max-w-[150px]">
                      {congregations.find(c => c.id === m.congregationId)?.name || 'Sede'}
                    </p>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-2 text-slate-600 text-sm font-medium">
                      <Heart size={14} className={m.maritalStatus === MaritalStatus.CASADO ? 'text-rose-400 fill-rose-400' : 'text-slate-300'} />
                      {m.maritalStatus}
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    {m.whatsapp ? (
                      <a
                        href={`https://wa.me/55${m.whatsapp.replace(/\D/g,'')}`}
                        target="_blank"
                        className="bg-emerald-50 text-emerald-600 px-4 py-2 rounded-xl flex items-center gap-2 text-xs font-black uppercase tracking-wider hover:bg-emerald-600 hover:text-white transition-all w-fit"
                      >
                        <MessageCircle size={14} />
                        Conversar
                      </a>
                    ) : <span className="text-slate-300 text-xs">—</span>}
                  </td>
                  <td className="px-8 py-6 text-right">
                    <div className="flex justify-end gap-3">
                      <button onClick={() => handleEdit(m)} className="p-3 bg-white border border-slate-100 rounded-xl text-slate-400 hover:text-blue-600 hover:shadow-md transition-all">
                        <Edit2 size={16} />
                      </button>
                      <button onClick={() => onDelete(m.id)} className="p-3 bg-white border border-slate-100 rounded-xl text-slate-400 hover:text-rose-600 hover:shadow-md transition-all">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredMembers.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-8 py-20 text-center text-slate-400">
                    <User size={48} className="mx-auto mb-4 opacity-10" />
                    <p className="font-bold">Nenhum registro encontrado.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {isFormOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[70] flex items-center justify-center p-4">
          <div className="bg-white rounded-[40px] w-full max-w-4xl max-h-[90vh] shadow-2xl overflow-hidden flex flex-col animate-in zoom-in-95 duration-200">
            <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-blue-600 text-white rounded-2xl shadow-lg shadow-blue-200">
                  <FileText size={20} />
                </div>
                <div>
                  <h3 className="text-2xl font-black text-slate-800 tracking-tight">{editingMember ? 'Editar Registro' : 'Ficha de Cadastro'}</h3>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Assembleia de Deus Balsa Nova</p>
                </div>
              </div>
              <button onClick={closeForm} className="p-3 hover:bg-slate-100 rounded-full transition-colors"><X /></button>
            </div>
            
            <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-8 lg:p-12 space-y-12">
              {/* Seção: Dados Pessoais */}
              <div className="space-y-6">
                <div className="flex items-center gap-3 mb-2">
                  <User className="text-blue-600" size={18} />
                  <h4 className="text-xs font-black uppercase tracking-[0.2em] text-blue-600">Dados Pessoais</h4>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="md:col-span-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 mb-1 block">Nome Completo</label>
                    <input
                      required
                      type="text"
                      className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 ring-blue-500 outline-none font-bold text-slate-700"
                      value={formData.name}
                      onChange={e => setFormData({ ...formData, name: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 mb-1 block">Nascimento</label>
                    <input
                      type="date"
                      className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 ring-blue-500 outline-none font-bold text-slate-700"
                      value={formData.birthDate}
                      onChange={e => setFormData({ ...formData, birthDate: e.target.value })}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  <div>
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 mb-1 block">CPF</label>
                    <input
                      type="text"
                      placeholder="000.000.000-00"
                      className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 ring-blue-500 outline-none font-bold text-slate-700"
                      value={formData.cpf}
                      onChange={e => setFormData({ ...formData, cpf: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 mb-1 block">RG</label>
                    <input
                      type="text"
                      className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 ring-blue-500 outline-none font-bold text-slate-700"
                      value={formData.rg}
                      onChange={e => setFormData({ ...formData, rg: e.target.value })}
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 mb-1 block">Profissão / Ocupação</label>
                    <input
                      type="text"
                      className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 ring-blue-500 outline-none font-bold text-slate-700"
                      value={formData.occupation}
                      onChange={e => setFormData({ ...formData, occupation: e.target.value })}
                    />
                  </div>
                </div>
              </div>

              {/* Seção: Endereço e Contato */}
              <div className="space-y-6 pt-4 border-t border-slate-50">
                <div className="flex items-center gap-3 mb-2">
                  <MapPin className="text-blue-600" size={18} />
                  <h4 className="text-xs font-black uppercase tracking-[0.2em] text-blue-600">Localização e Contato</h4>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="md:col-span-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 mb-1 block">Endereço Residencial</label>
                    <input
                      type="text"
                      placeholder="Rua, Número, Bairro, Cidade - PR"
                      className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 ring-blue-500 outline-none font-bold text-slate-700"
                      value={formData.address}
                      onChange={e => setFormData({ ...formData, address: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 mb-1 block">WhatsApp / Celular</label>
                    <input
                      type="text"
                      placeholder="(41) 00000-0000"
                      className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 ring-blue-500 outline-none font-bold text-slate-700"
                      value={formData.whatsapp}
                      onChange={e => setFormData({ ...formData, whatsapp: e.target.value })}
                    />
                  </div>
                </div>
              </div>

              {/* Seção: Família e Estado Civil */}
              <div className="space-y-6 pt-4 border-t border-slate-50">
                <div className="flex items-center gap-3 mb-2">
                  <Heart className="text-rose-500" size={18} />
                  <h4 className="text-xs font-black uppercase tracking-[0.2em] text-rose-500">Família e Estado Civil</h4>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  <div>
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 mb-1 block">Estado Civil</label>
                    <select
                      className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 ring-blue-500 outline-none font-bold text-slate-700"
                      value={formData.maritalStatus}
                      onChange={e => setFormData({ ...formData, maritalStatus: e.target.value as MaritalStatus })}
                    >
                      {Object.values(MaritalStatus).map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>
                  <div className="md:col-span-3">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 mb-1 block">Nome do Cônjuge (Opcional)</label>
                    <input
                      type="text"
                      disabled={formData.maritalStatus === MaritalStatus.SOLTEIRO}
                      placeholder={formData.maritalStatus === MaritalStatus.SOLTEIRO ? "Não aplicável para solteiros" : "Nome completo do esposo(a)"}
                      className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 ring-blue-500 outline-none font-bold text-slate-700 disabled:opacity-50"
                      value={formData.spouseName}
                      onChange={e => setFormData({ ...formData, spouseName: e.target.value })}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 mb-1 block">Nome do Pai</label>
                    <input
                      type="text"
                      className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 ring-blue-500 outline-none font-bold text-slate-700"
                      value={formData.fatherName}
                      onChange={e => setFormData({ ...formData, fatherName: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 mb-1 block">Nome da Mãe</label>
                    <input
                      type="text"
                      className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 ring-blue-500 outline-none font-bold text-slate-700"
                      value={formData.motherName}
                      onChange={e => setFormData({ ...formData, motherName: e.target.value })}
                    />
                  </div>
                </div>
              </div>

              {/* Seção: Ministério */}
              <div className="space-y-6 pt-4 border-t border-slate-50">
                <div className="flex items-center gap-3 mb-2">
                  <Calendar className="text-indigo-600" size={18} />
                  <h4 className="text-xs font-black uppercase tracking-[0.2em] text-indigo-600">Ministério e Cargo</h4>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 mb-1 block">Cargo Ministerial</label>
                    <select
                      className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 ring-blue-500 outline-none font-bold text-slate-700"
                      value={formData.role}
                      onChange={e => setFormData({ ...formData, role: e.target.value as MemberRole })}
                    >
                      {Object.values(MemberRole).map(role => (
                        <option key={role} value={role}>{role}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 mb-1 block">Congregação</label>
                    <select
                      className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 ring-blue-500 outline-none font-bold text-slate-700"
                      value={formData.congregationId}
                      onChange={e => setFormData({ ...formData, congregationId: e.target.value })}
                    >
                      {congregations.map(c => (
                        <option key={c.id} value={c.id}>{c.name}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1 mb-1 block">Batismo em Águas</label>
                    <input
                      type="date"
                      className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 ring-blue-500 outline-none font-bold text-slate-700"
                      value={formData.baptismDate}
                      onChange={e => setFormData({ ...formData, baptismDate: e.target.value })}
                    />
                  </div>
                </div>
              </div>
            </form>

            <div className="p-8 border-t border-slate-100 bg-slate-50 flex gap-4">
              <button type="button" onClick={closeForm} className="flex-1 py-4 bg-white border border-slate-200 text-slate-500 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-slate-100 transition-colors">Cancelar</button>
              <button onClick={handleSubmit} type="submit" className="flex-[2] py-4 bg-blue-600 text-white rounded-2xl font-black uppercase tracking-widest text-xs shadow-xl shadow-blue-200 hover:bg-blue-700 transition-all active:scale-95">
                {editingMember ? 'Atualizar Ficha' : 'Efetivar Cadastro'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MembersTab;
