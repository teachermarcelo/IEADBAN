
import React, { useState } from 'react';
import { Congregation } from '../types';
import { Plus, MapPin, User, Edit2, Trash2, X, Landmark } from 'lucide-react';

interface CongregationsTabProps {
  congregations: Congregation[];
  onAdd: (c: Congregation) => void;
  onUpdate: (c: Congregation) => void;
  onDelete: (id: string) => void;
}

const CongregationsTab: React.FC<CongregationsTabProps> = ({ congregations, onAdd, onUpdate, onDelete }) => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingCong, setEditingCong] = useState<Congregation | null>(null);
  const [formData, setFormData] = useState<Partial<Congregation>>({ name: '', address: '', responsible: '' });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingCong) {
      onUpdate({ ...editingCong, ...formData } as Congregation);
    } else {
      onAdd({ ...formData, id: Date.now().toString() } as Congregation);
    }
    closeForm();
  };

  const closeForm = () => {
    setIsFormOpen(false);
    setEditingCong(null);
    setFormData({ name: '', address: '', responsible: '' });
  };

  const handleEdit = (c: Congregation) => {
    setEditingCong(c);
    setFormData(c);
    setIsFormOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <button
          onClick={() => setIsFormOpen(true)}
          className="bg-indigo-600 text-white px-6 py-2 rounded-xl font-bold flex items-center gap-2 hover:bg-indigo-700 shadow-lg shadow-indigo-200 transition-all"
        >
          <Plus size={18} />
          Nova Congregação
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {congregations.map((c) => (
          <div key={c.id} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm group hover:shadow-md transition-all">
            <div className="flex justify-between items-start mb-4">
              <div className="bg-indigo-50 p-3 rounded-xl text-indigo-600">
                <Landmark size={24} />
              </div>
              <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button onClick={() => handleEdit(c)} className="p-2 text-slate-400 hover:text-indigo-600 rounded-lg hover:bg-slate-50">
                  <Edit2 size={16} />
                </button>
                <button onClick={() => onDelete(c.id)} className="p-2 text-slate-400 hover:text-red-600 rounded-lg hover:bg-slate-50">
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
            <h4 className="text-xl font-bold text-slate-800 mb-3">{c.name}</h4>
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2 text-slate-500">
                <MapPin size={16} />
                {c.address}
              </div>
              <div className="flex items-center gap-2 text-slate-500">
                <User size={16} />
                Resp: {c.responsible || 'Não definido'}
              </div>
            </div>
          </div>
        ))}
        {congregations.length === 0 && (
          <div className="col-span-full py-20 text-center bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200 text-slate-400">
            Nenhuma congregação cadastrada.
          </div>
        )}
      </div>

      {isFormOpen && (
        <div className="fixed inset-0 bg-black/50 z-[60] flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <h3 className="text-xl font-bold text-slate-800">{editingCong ? 'Editar Congregação' : 'Nova Congregação'}</h3>
              <button onClick={closeForm} className="text-slate-400 hover:text-slate-600"><X /></button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Nome da Congregação</label>
                <input
                  required
                  type="text"
                  placeholder="Ex: Congregação Bairro X"
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Endereço</label>
                <input
                  required
                  type="text"
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
                  value={formData.address}
                  onChange={e => setFormData({ ...formData, address: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Responsável (Pastor/Obreiro)</label>
                <input
                  type="text"
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
                  value={formData.responsible}
                  onChange={e => setFormData({ ...formData, responsible: e.target.value })}
                />
              </div>
              <div className="pt-4 flex gap-3">
                <button type="button" onClick={closeForm} className="flex-1 py-3 bg-slate-100 text-slate-600 rounded-xl font-bold hover:bg-slate-200">Cancelar</button>
                <button type="submit" className="flex-1 py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700">Salvar</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CongregationsTab;
