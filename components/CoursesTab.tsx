
import React, { useState } from 'react';
import { GraduationCap, Plus, Search, MessageCircle, Edit2, Trash2, X, ShieldCheck, Lock, ExternalLink, Camera, Image as ImageIcon, KeyRound, Save, RefreshCcw } from 'lucide-react';
import { Course } from '../types';

interface CoursesTabProps {
  courses: Course[];
  onSave: (c: Course) => void;
  onDelete: (id: string) => void;
}

const CoursesTab: React.FC<CoursesTabProps> = ({ courses, onSave, onDelete }) => {
  const [isAdminMode, setIsAdminMode] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showSecurityModal, setShowSecurityModal] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');
  const [error, setError] = useState('');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // Password State
  const COURSE_PASS_KEY = 'ieadban_course_pass';
  const [currentPass, setCurrentPass] = useState(localStorage.getItem(COURSE_PASS_KEY) || '123456');
  const [newPass, setNewPass] = useState('');

  // Form State
  const [editingCourse, setEditingCourse] = useState<Partial<Course>>({
    type: 'curso', name: '', responsible: '', contact: '', externalLink: '', imageUrl: '', description: ''
  });

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
      alert('Mínimo 4 dígitos.');
      return;
    }
    localStorage.setItem(COURSE_PASS_KEY, newPass);
    setCurrentPass(newPass);
    setShowSecurityModal(false);
    setNewPass('');
    alert('Senha atualizada!');
  };

  const openForm = (course?: Course) => {
    setEditingCourse(course || { 
      type: 'curso', name: '', responsible: '', contact: '', externalLink: '', imageUrl: '', description: '' 
    });
    setIsFormOpen(true);
  };

  const handleSaveCourse = () => {
    if (editingCourse.name && editingCourse.responsible) {
      onSave({
        ...editingCourse,
        id: editingCourse.id || Date.now().toString()
      } as Course);
      setIsFormOpen(false);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setEditingCourse({ ...editingCourse, imageUrl: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const filtered = courses.filter(c => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    c.type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-10 animate-in fade-in duration-700 pb-20">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 bg-white p-10 rounded-[48px] border border-slate-100 shadow-sm">
        <div>
          <h2 className="text-4xl font-black text-slate-800 tracking-tight">Cursos & Ensino</h2>
          <p className="text-slate-400 font-bold text-xs uppercase tracking-widest mt-2 flex items-center gap-2">
            <GraduationCap size={14} className="text-blue-500" /> Formação Teológica e Treinamentos
          </p>
        </div>
        
        <div className="flex gap-4">
          {!isAdminMode ? (
            <button 
              onClick={() => setShowLoginModal(true)}
              className="bg-slate-900 text-white px-8 py-4 rounded-3xl font-black text-xs uppercase tracking-widest flex items-center gap-3 hover:bg-slate-800 shadow-xl"
            >
              <ShieldCheck size={18} className="text-blue-400" /> Admin Ensino
            </button>
          ) : (
            <div className="flex gap-2">
               <button onClick={() => openForm()} className="bg-blue-600 text-white px-6 py-4 rounded-3xl font-black text-xs uppercase tracking-widest flex items-center gap-2 hover:bg-blue-700"><Plus size={16}/> Adicionar</button>
               <button onClick={() => setShowSecurityModal(true)} className="p-4 bg-slate-100 text-slate-600 rounded-2xl hover:bg-slate-200"><KeyRound size={20}/></button>
               <button onClick={() => setIsAdminMode(false)} className="bg-rose-50 text-rose-600 px-6 py-4 rounded-2xl font-black text-xs uppercase tracking-widest flex items-center gap-2 hover:bg-rose-100">Sair Admin</button>
            </div>
          )}
        </div>
      </div>

      {/* Grid de Conteúdo */}
      <div className="space-y-6">
        <div className="relative max-w-md">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input 
            placeholder="Buscar por curso ou seminário..." 
            className="w-full pl-12 pr-4 py-4 bg-white border border-slate-100 rounded-3xl font-bold outline-none focus:ring-2 ring-blue-500"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filtered.map(course => (
            <div key={course.id} className="bg-white rounded-[40px] border border-slate-50 shadow-sm hover:shadow-2xl transition-all group overflow-hidden flex flex-col">
              <div className="aspect-video relative overflow-hidden bg-slate-900">
                {course.imageUrl ? (
                  <img src={course.imageUrl} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt={course.name} />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-slate-600 bg-slate-100">
                    <ImageIcon size={48} />
                  </div>
                )}
                <div className="absolute top-4 left-4">
                  <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest text-white shadow-lg ${
                    course.type === 'seminario' ? 'bg-purple-600' : course.type === 'inscricao' ? 'bg-emerald-600' : 'bg-blue-600'
                  }`}>
                    {course.type}
                  </span>
                </div>
                {isAdminMode && (
                  <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => openForm(course)} className="p-3 bg-white text-blue-600 rounded-xl shadow-lg"><Edit2 size={16}/></button>
                    <button onClick={() => onDelete(course.id)} className="p-3 bg-white text-rose-600 rounded-xl shadow-lg"><Trash2 size={16}/></button>
                  </div>
                )}
              </div>
              
              <div className="p-8 flex-1 flex flex-col">
                <h3 className="text-xl font-black text-slate-800 mb-2 leading-tight">{course.name}</h3>
                <p className="text-slate-500 text-xs font-medium line-clamp-2 mb-6">{course.description || 'Ensino teológico de qualidade para o crescimento da igreja.'}</p>
                
                <div className="mt-auto space-y-4 pt-4 border-t border-slate-50">
                   <div className="flex justify-between items-center">
                      <div>
                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Responsável</p>
                        <p className="text-xs font-bold text-slate-700">{course.responsible}</p>
                      </div>
                      <a 
                        href={`https://wa.me/55${course.contact.replace(/\D/g,'')}`}
                        target="_blank"
                        className="p-3 bg-emerald-500 text-white rounded-xl hover:scale-110 transition-all shadow-lg shadow-emerald-100"
                      >
                        <MessageCircle size={18} />
                      </a>
                   </div>
                   
                   {course.externalLink && (
                     <a 
                      href={course.externalLink}
                      target="_blank"
                      className="w-full bg-slate-900 text-white py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-blue-600 transition-all"
                     >
                       <ExternalLink size={14} /> Mais Informações / Inscrição
                     </a>
                   )}
                </div>
              </div>
            </div>
          ))}
          
          {filtered.length === 0 && (
            <div className="col-span-full py-24 text-center bg-white rounded-[56px] border-2 border-dashed border-slate-100">
               <GraduationCap size={64} className="text-slate-100 mx-auto mb-4" />
               <p className="text-slate-400 font-bold uppercase text-xs tracking-widest">Nenhum registro educacional encontrado</p>
            </div>
          )}
        </div>
      </div>

      {/* Login Modal */}
      {showLoginModal && (
        <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-xl z-[130] flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-sm rounded-[48px] shadow-2xl p-10">
             <div className="flex flex-col items-center text-center mb-8">
                <div className="bg-blue-50 p-6 rounded-[32px] text-blue-600 mb-6"><Lock size={40} /></div>
                <h3 className="text-2xl font-black text-slate-800 tracking-tight">Painel de Ensino</h3>
             </div>
             <form onSubmit={handleLogin} className="space-y-4">
                <input type="password" autoFocus placeholder="Senha Admin" className="w-full bg-slate-50 border border-slate-100 p-5 rounded-3xl text-center font-black tracking-[0.5em] outline-none" value={passwordInput} onChange={e => setPasswordInput(e.target.value)} />
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
                   <h4 className="text-xs font-black uppercase text-slate-500 tracking-widest mb-2 flex items-center gap-2"><KeyRound size={14}/> Nova Senha Ensino</h4>
                   <input type="password" placeholder="Mínimo 4 dígitos" className="w-full bg-white border border-slate-200 p-4 rounded-2xl font-bold outline-none" value={newPass} onChange={e => setNewPass(e.target.value)} />
                   <button type="submit" className="w-full bg-blue-600 text-white py-4 rounded-2xl font-black uppercase text-[10px] tracking-widest flex items-center justify-center gap-2"><Save size={14}/> Salvar</button>
                </div>
                <button type="button" onClick={() => { localStorage.setItem(COURSE_PASS_KEY, '123456'); setCurrentPass('123456'); alert('Padrão 123456 restaurado'); setShowSecurityModal(false); }} className="w-full py-4 border-2 border-dashed border-rose-200 text-rose-500 rounded-2xl font-black uppercase text-[10px] flex items-center justify-center gap-2"><RefreshCcw size={14}/> Resetar Padrão</button>
             </form>
          </div>
        </div>
      )}

      {/* Editor Modal */}
      {isFormOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-[110] flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-lg rounded-[48px] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
             <div className="p-8 border-b border-slate-50 bg-slate-50/50 flex justify-between items-center">
               <h3 className="text-2xl font-black text-slate-800 tracking-tight uppercase">Configurar Curso</h3>
               <button onClick={() => setIsFormOpen(false)} className="p-2 hover:bg-slate-100 rounded-full"><X/></button>
             </div>
             <div className="p-10 space-y-6 overflow-y-auto max-h-[70vh]">
                <div className="grid grid-cols-2 gap-4">
                   <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase text-slate-400 ml-2">Tipo de Registro</label>
                      <select className="w-full bg-slate-50 p-4 rounded-2xl border border-slate-100 font-bold outline-none appearance-none" value={editingCourse.type} onChange={e => setEditingCourse({...editingCourse, type: e.target.value as any})}>
                         <option value="curso">Curso</option>
                         <option value="inscricao">Inscrição</option>
                         <option value="seminario">Seminário</option>
                      </select>
                   </div>
                   <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase text-slate-400 ml-2">Responsável</label>
                      <input placeholder="Coordenação" className="w-full bg-slate-50 p-4 rounded-2xl border border-slate-100 font-bold outline-none" value={editingCourse.responsible} onChange={e => setEditingCourse({...editingCourse, responsible: e.target.value})} />
                   </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-slate-400 ml-2">Nome do Curso / Seminário</label>
                  <input className="w-full bg-slate-50 p-4 rounded-2xl border border-slate-100 font-bold outline-none" value={editingCourse.name} onChange={e => setEditingCourse({...editingCourse, name: e.target.value})} />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-slate-400 ml-2">Descrição Curta</label>
                  <textarea rows={2} className="w-full bg-slate-50 p-4 rounded-2xl border border-slate-100 font-bold outline-none" value={editingCourse.description} onChange={e => setEditingCourse({...editingCourse, description: e.target.value})} />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-slate-400 ml-2">WhatsApp Contato</label>
                    <input placeholder="(41) 99999-9999" className="w-full bg-slate-50 p-4 rounded-2xl border border-slate-100 font-bold outline-none" value={editingCourse.contact} onChange={e => setEditingCourse({...editingCourse, contact: e.target.value})} />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-slate-400 ml-2">Link Externo</label>
                    <input placeholder="https://..." className="w-full bg-slate-50 p-4 rounded-2xl border border-slate-100 font-bold outline-none" value={editingCourse.externalLink} onChange={e => setEditingCourse({...editingCourse, externalLink: e.target.value})} />
                  </div>
                </div>

                <div className="space-y-2">
                   <label className="text-[10px] font-black uppercase text-slate-400 ml-2">Imagem de Capa</label>
                   <div className="relative h-32 bg-slate-50 border-2 border-dashed border-slate-200 rounded-2xl flex flex-col items-center justify-center overflow-hidden">
                      {editingCourse.imageUrl ? (
                        <>
                          <img src={editingCourse.imageUrl} className="w-full h-full object-cover" />
                          <button onClick={() => setEditingCourse({...editingCourse, imageUrl: ''})} className="absolute top-2 right-2 p-1 bg-rose-500 text-white rounded-full"><X size={12}/></button>
                        </>
                      ) : (
                        <>
                           <Camera size={24} className="text-slate-300 mb-1" />
                           <span className="text-[9px] font-black uppercase text-slate-400">Selecionar Foto</span>
                           <input type="file" accept="image/*" onChange={handleImageUpload} className="absolute inset-0 opacity-0 cursor-pointer" />
                        </>
                      )}
                   </div>
                </div>

                <button onClick={handleSaveCourse} className="w-full bg-blue-600 text-white py-5 rounded-3xl font-black uppercase tracking-widest text-xs shadow-xl shadow-blue-100 hover:bg-blue-700 transition-all">Salvar Registro</button>
             </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CoursesTab;
