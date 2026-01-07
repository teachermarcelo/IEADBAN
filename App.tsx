
import React, { useState, useEffect, useLayoutEffect } from 'react';
import { 
  Home, Users, Landmark, BookOpen, Book, Menu, X, Calendar, Layers, 
  Camera, BookType, HeartHandshake, Waves, GraduationCap, Download, Upload
} from 'lucide-react';
import { Member, Congregation, Department, Event, MediaItem, WeeklyCult, ChurchNotice, TabType, NewConvert, Baptism, CarouselItem, Course } from './types';
import MembersTab from './components/MembersTab';
import CongregationsTab from './components/CongregationsTab';
import DevotionalTab from './components/DevotionalTab';
import ReadingPlanTab from './components/ReadingPlanTab';
import HomeTab from './components/HomeTab';
import DepartmentsTab from './components/DepartmentsTab';
import EventsTab from './components/EventsTab';
import MediaTab from './components/MediaTab';
import BibleTab from './components/BibleTab';
import DiscipleshipTab from './components/DiscipleshipTab';
import BaptismsTab from './components/BaptismsTab';
import CoursesTab from './components/CoursesTab';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('home');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
  // Estados de Dados
  const [members, setMembers] = useState<Member[]>([]);
  const [newConverts, setNewConverts] = useState<NewConvert[]>([]);
  const [baptisms, setBaptisms] = useState<Baptism[]>([]);
  const [carouselItems, setCarouselItems] = useState<CarouselItem[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [congregations, setCongregations] = useState<Congregation[]>([
    { id: '1', name: 'Templo Sede', address: 'Balsa Nova - PR', responsible: 'Pr. Elias Israel Dias' }
  ]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [mediaItems, setMediaItems] = useState<MediaItem[]>([]);
  const [weeklyCults, setWeeklyCults] = useState<WeeklyCult[]>([
    { id: '1', day: 'Terça-feira', name: 'Culto de Doutrina', time: '19:30' },
    { id: '2', day: 'Quinta-feira', name: 'Culto de Vitória', time: '19:30' },
    { id: '3', day: 'Sábado', name: 'Culto de Jovens', time: '19:30' },
    { id: '4', day: 'Domingo', name: 'EBD', time: '09:00' },
    { id: '5', day: 'Domingo', name: 'Culto de Louvor', time: '19:00' },
  ]);
  const [notices, setNotices] = useState<ChurchNotice[]>([]);

  // UseLayoutEffect para carregar ANTES da primeira pintura na tela
  useLayoutEffect(() => {
    const keys = [
      ['ieadban_members', setMembers],
      ['ieadban_converts', setNewConverts],
      ['ieadban_baptisms', setBaptisms],
      ['ieadban_carousel', setCarouselItems],
      ['ieadban_congs', setCongregations],
      ['ieadban_deps', setDepartments],
      ['ieadban_events', setEvents],
      ['ieadban_media', setMediaItems],
      ['ieadban_cults', setWeeklyCults],
      ['ieadban_notices', setNotices],
      ['ieadban_courses', setCourses]
    ] as const;

    keys.forEach(([key, setter]) => {
      const saved = localStorage.getItem(key);
      if (saved) {
        try {
          setter(JSON.parse(saved));
        } catch (e) {
          console.error(`Erro ao ler ${key}`, e);
        }
      }
    });
  }, []);

  const saveToStorage = (key: string, data: any) => {
    localStorage.setItem(`ieadban_${key}`, JSON.stringify(data));
  };

  // Função para sincronização manual (Exportar tudo)
  const exportData = () => {
    const allData = {
      members, newConverts, baptisms, carouselItems, courses,
      congregations, departments, events, mediaItems, weeklyCults, notices
    };
    const blob = new Blob([JSON.stringify(allData)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ieadban_backup_${new Date().toLocaleDateString()}.json`;
    a.click();
  };

  const navItems = [
    { id: 'home', icon: Home, label: 'Início' },
    { id: 'courses', icon: GraduationCap, label: 'Cursos & Ensino' },
    { id: 'discipleship', icon: HeartHandshake, label: 'Discipulado' },
    { id: 'baptisms', icon: Waves, label: 'Batismos' },
    { id: 'members', icon: Users, label: 'Membros' },
    { id: 'departments', icon: Layers, label: 'Departamentos' },
    { id: 'congregations', icon: Landmark, label: 'Congregações' },
    { id: 'events', icon: Calendar, label: 'Agenda & Admin' },
    { id: 'bible', icon: BookType, label: 'Bíblia Sagrada' },
    { id: 'devotional', icon: BookOpen, label: 'Devocional' },
    { id: 'media', icon: Camera, label: 'Mídia & TV' },
    { id: 'reading-plan', icon: Book, label: 'Plano Leitura' },
  ];

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-[#F8FAFC]">
      {/* Sidebar Mobile */}
      <div className={`fixed inset-0 bg-slate-900/60 z-[100] md:hidden transition-opacity ${isSidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`} onClick={() => setIsSidebarOpen(false)} />
      
      <aside className={`fixed md:sticky top-0 left-0 h-screen w-[280px] bg-white border-r border-slate-100 z-[110] transition-transform duration-300 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 flex flex-col`}>
        <div className="p-8">
          <div className="flex items-center gap-3 mb-8">
            <div className="bg-blue-600 p-2 rounded-xl text-white"><Landmark size={24} /></div>
            <h1 className="font-black text-xl text-slate-800">IEADBAN</h1>
          </div>
          <nav className="space-y-1 overflow-y-auto max-h-[calc(100vh-200px)] pr-2">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => { setActiveTab(item.id as TabType); setIsSidebarOpen(false); }}
                className={`w-full flex items-center gap-4 px-5 py-3 rounded-2xl transition-all ${activeTab === item.id ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-500 hover:bg-slate-50'}`}
              >
                <item.icon size={18} />
                <span className="font-bold text-sm">{item.label}</span>
              </button>
            ))}
          </nav>
        </div>
        
        <div className="mt-auto p-6 border-t border-slate-50">
           <button onClick={exportData} className="w-full flex items-center justify-center gap-2 py-3 bg-slate-50 text-slate-400 rounded-xl text-[10px] font-black uppercase hover:bg-slate-100 transition-all">
             <Download size={14} /> Backup de Dados
           </button>
           <p className="text-[10px] text-center text-slate-300 mt-4 font-bold italic">Balsa Nova - PR</p>
        </div>
      </aside>

      <main className="flex-1 flex flex-col min-w-0">
        <header className="md:hidden bg-white border-b border-slate-100 p-4 flex justify-between items-center sticky top-0 z-50">
          <div className="flex items-center gap-2">
            <Landmark size={20} className="text-blue-600" />
            <span className="font-black text-slate-800">IEADBAN</span>
          </div>
          <button onClick={() => setIsSidebarOpen(true)} className="p-2 bg-slate-50 rounded-xl"><Menu size={20}/></button>
        </header>

        <div className="flex-1 p-4 md:p-10 max-w-7xl mx-auto w-full">
          {activeTab === 'home' && <HomeTab carouselItems={carouselItems} membersCount={members.length} congsCount={congregations.length} baptisms={baptisms} onNavigate={setActiveTab} />}
          {activeTab === 'members' && <MembersTab members={members} congregations={congregations} onAdd={(m) => { const n = [...members, m]; setMembers(n); saveToStorage('members', n); }} onUpdate={(m) => { const n = members.map(p => p.id === m.id ? m : p); setMembers(n); saveToStorage('members', n); }} onDelete={(id) => { const n = members.filter(p => p.id !== id); setMembers(n); saveToStorage('members', n); }} />}
          {activeTab === 'congregations' && <CongregationsTab congregations={congregations} onAdd={(c) => { const n = [...congregations, c]; setCongregations(n); saveToStorage('congs', n); }} onUpdate={(c) => { const n = congregations.map(p => p.id === c.id ? c : p); setCongregations(n); saveToStorage('congs', n); }} onDelete={(id) => { const n = congregations.filter(p => p.id !== id); setCongregations(n); saveToStorage('congs', n); }} />}
          {activeTab === 'departments' && <DepartmentsTab departments={departments} onSave={(d) => { const n = departments.some(x => x.id === d.id) ? departments.map(x => x.id === d.id ? d : x) : [...departments, d]; setDepartments(n); saveToStorage('deps', n); }} onDelete={(id) => { const n = departments.filter(x => x.id !== id); setDepartments(n); saveToStorage('deps', n); }} />}
          {activeTab === 'events' && <EventsTab carouselItems={carouselItems} onSaveCarouselItem={(item) => { const n = carouselItems.some(x => x.id === item.id) ? carouselItems.map(x => x.id === item.id ? item : x) : [...carouselItems, item]; setCarouselItems(n); saveToStorage('carousel', n); }} onDeleteCarouselItem={(id) => { const n = carouselItems.filter(x => x.id !== id); setCarouselItems(n); saveToStorage('carousel', n); }} events={events} weeklyCults={weeklyCults} notices={notices} onSaveEvent={(e) => { const n = events.some(x => x.id === e.id) ? events.map(x => x.id === e.id ? e : x) : [...events, e]; setEvents(n); saveToStorage('events', n); }} onDeleteEvent={(id) => { const n = events.filter(x => x.id !== id); setEvents(n); saveToStorage('events', n); }} onSaveCult={(c) => { const n = weeklyCults.some(x => x.id === c.id) ? weeklyCults.map(x => x.id === c.id ? c : x) : [...weeklyCults, c]; setWeeklyCults(n); saveToStorage('cults', n); }} onDeleteCult={(id) => { const n = weeklyCults.filter(x => x.id !== id); setWeeklyCults(n); saveToStorage('cults', n); }} onSaveNotice={(notice) => { const n = notices.some(x => x.id === notice.id) ? notices.map(x => x.id === notice.id ? notice : x) : [...notices, notice]; setNotices(n); saveToStorage('notices', n); }} onDeleteNotice={(id) => { const n = notices.filter(x => x.id !== id); setNotices(n); saveToStorage('notices', n); }} onReorderCults={(newList) => { setWeeklyCults(newList); saveToStorage('cults', newList); }} />}
          {activeTab === 'devotional' && <DevotionalTab />}
          {activeTab === 'bible' && <BibleTab />}
          {activeTab === 'reading-plan' && <ReadingPlanTab />}
          {activeTab === 'discipleship' && <DiscipleshipTab newConverts={newConverts} congregations={congregations} onSaveConvert={(c) => { const n = [...newConverts.filter(x => x.id !== c.id), c]; setNewConverts(n); saveToStorage('converts', n); }} onDeleteConvert={(id) => { const n = newConverts.filter(x => x.id !== id); setNewConverts(n); saveToStorage('converts', n); }} onConvertToMember={(m, id) => { setMembers([...members, m]); saveToStorage('members', [...members, m]); setNewConverts(newConverts.filter(x => x.id !== id)); saveToStorage('converts', newConverts.filter(x => x.id !== id)); }} />}
          {activeTab === 'baptisms' && <BaptismsTab baptisms={baptisms} congregations={congregations} onSave={(b) => { const n = [...baptisms.filter(x => x.id !== b.id), b]; setBaptisms(n); saveToStorage('baptisms', n); }} onDelete={(id) => { const n = baptisms.filter(x => x.id !== id); setBaptisms(n); saveToStorage('baptisms', n); }} />}
          {activeTab === 'courses' && <CoursesTab courses={courses} onSave={(c) => { const n = [...courses.filter(x => x.id !== c.id), c]; setCourses(n); saveToStorage('courses', n); }} onDelete={(id) => { const n = courses.filter(x => x.id !== id); setCourses(n); saveToStorage('courses', n); }} />}
          {activeTab === 'media' && <MediaTab mediaItems={mediaItems} onSave={(m) => { const n = [...mediaItems.filter(x => x.id !== m.id), m]; setMediaItems(n); saveToStorage('media', n); }} onDelete={(id) => { const n = mediaItems.filter(x => x.id !== id); setMediaItems(n); saveToStorage('media', n); }} />}
        </div>
      </main>
    </div>
  );
};

export default App;
