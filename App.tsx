
import React, { useState, useEffect, useLayoutEffect } from 'react';
import { 
  Home, Users, Landmark, BookOpen, Book, Menu, X, Calendar, Layers, 
  Camera, BookType, HeartHandshake, Waves, GraduationCap, Download, Upload, RefreshCcw
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

  const loadData = () => {
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
  };

  useLayoutEffect(() => {
    loadData();
    window.addEventListener('storage', loadData);
    return () => window.removeEventListener('storage', loadData);
  }, []);

  const saveToStorage = (key: string, data: any) => {
    localStorage.setItem(`ieadban_${key}`, JSON.stringify(data));
  };

  const exportData = () => {
    const allData = {
      members, newConverts, baptisms, carouselItems, courses,
      congregations, departments, events, mediaItems, weeklyCults, notices
    };
    const blob = new Blob([JSON.stringify(allData)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ieadban_backup.json`;
    a.click();
  };

  const importData = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const data = JSON.parse(event.target?.result as string);
          Object.keys(data).forEach(key => {
            const storageKey = key === 'congregations' ? 'ieadban_congs' : 
                               key === 'carouselItems' ? 'ieadban_carousel' : 
                               key === 'weeklyCults' ? 'ieadban_cults' : 
                               key === 'newConverts' ? 'ieadban_converts' : 
                               key === 'mediaItems' ? 'ieadban_media' : `ieadban_${key}`;
            localStorage.setItem(storageKey, JSON.stringify(data[key]));
          });
          window.location.reload();
        } catch (err) {
          alert("Erro ao importar arquivo.");
        }
      };
      reader.readAsText(file);
    }
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
      {/* Sidebar - Fixa no Desktop, Drawer no Mobile */}
      <div className={`fixed inset-0 bg-slate-900/60 z-[100] md:hidden transition-opacity ${isSidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`} onClick={() => setIsSidebarOpen(false)} />
      
      <aside className={`fixed md:sticky top-0 left-0 h-screen w-[260px] bg-white border-r border-slate-100 z-[110] transition-transform duration-300 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 flex flex-col shadow-xl md:shadow-none`}>
        <div className="p-6 flex flex-col h-full">
          <div className="flex items-center gap-3 mb-10 px-2">
            <div className="bg-blue-600 p-2.5 rounded-xl text-white shadow-lg shadow-blue-100">
              <Landmark size={22} />
            </div>
            <h1 className="font-black text-xl text-slate-800 tracking-tighter">IEADBAN</h1>
          </div>
          
          <nav className="flex-1 space-y-1 overflow-y-auto pr-2 custom-scrollbar">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => { setActiveTab(item.id as TabType); setIsSidebarOpen(false); }}
                className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-xl transition-all font-bold text-sm ${activeTab === item.id ? 'bg-blue-600 text-white shadow-md' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800'}`}
              >
                <item.icon size={18} strokeWidth={activeTab === item.id ? 2.5 : 2} />
                <span>{item.label}</span>
              </button>
            ))}
          </nav>

          <div className="mt-6 pt-6 border-t border-slate-50 space-y-2">
            <button onClick={exportData} className="w-full flex items-center justify-center gap-2 py-2.5 bg-slate-50 text-slate-500 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-100 transition-all">
              <Download size={14} /> Exportar Backup
            </button>
            <label className="w-full flex items-center justify-center gap-2 py-2.5 bg-blue-50 text-blue-600 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-blue-100 transition-all cursor-pointer">
              <Upload size={14} /> Importar Dados
              <input type="file" className="hidden" accept=".json" onChange={importData} />
            </label>
            <p className="text-[9px] text-center text-slate-300 mt-2 font-bold">Balsa Nova - PR</p>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 min-h-screen">
        <header className="md:hidden bg-white border-b border-slate-100 p-4 flex justify-between items-center sticky top-0 z-50 shadow-sm">
          <div className="flex items-center gap-2">
            <div className="bg-blue-600 p-1.5 rounded-lg text-white"><Landmark size={18} /></div>
            <span className="font-black text-slate-800 tracking-tighter">IEADBAN</span>
          </div>
          <button onClick={() => setIsSidebarOpen(true)} className="p-2 bg-slate-50 rounded-lg text-slate-600"><Menu size={22}/></button>
        </header>

        <div className="flex-1 p-4 md:p-8 lg:p-12 max-w-7xl mx-auto w-full">
          {(() => {
            switch (activeTab) {
              case 'home': return <HomeTab carouselItems={carouselItems} membersCount={members.length} congsCount={congregations.length} baptisms={baptisms} onNavigate={setActiveTab} />;
              case 'members': return <MembersTab members={members} congregations={congregations} onAdd={(m) => { const n = [...members, m]; setMembers(n); saveToStorage('members', n); }} onUpdate={(m) => { const n = members.map(p => p.id === m.id ? m : p); setMembers(n); saveToStorage('members', n); }} onDelete={(id) => { const n = members.filter(p => p.id !== id); setMembers(n); saveToStorage('members', n); }} />;
              case 'congregations': return <CongregationsTab congregations={congregations} onAdd={(c) => { const n = [...congregations, c]; setCongregations(n); saveToStorage('congs', n); }} onUpdate={(c) => { const n = congregations.map(p => p.id === c.id ? c : p); setCongregations(n); saveToStorage('congs', n); }} onDelete={(id) => { const n = congregations.filter(p => p.id !== id); setCongregations(n); saveToStorage('congs', n); }} />;
              case 'departments': return <DepartmentsTab departments={departments} onSave={(d) => { const n = [...departments.filter(x => x.id !== d.id), d]; setDepartments(n); saveToStorage('deps', n); }} onDelete={(id) => { const n = departments.filter(x => x.id !== id); setDepartments(n); saveToStorage('deps', n); }} />;
              case 'events': return <EventsTab carouselItems={carouselItems} onSaveCarouselItem={(item) => { const n = [...carouselItems.filter(x => x.id !== item.id), item]; setCarouselItems(n); saveToStorage('carousel', n); }} onDeleteCarouselItem={(id) => { const n = carouselItems.filter(x => x.id !== id); setCarouselItems(n); saveToStorage('carousel', n); }} events={events} weeklyCults={weeklyCults} notices={notices} onSaveEvent={(e) => { const n = [...events.filter(x => x.id !== e.id), e]; setEvents(n); saveToStorage('events', n); }} onDeleteEvent={(id) => { const n = events.filter(x => x.id !== id); setEvents(n); saveToStorage('events', n); }} onSaveCult={(c) => { const n = [...weeklyCults.filter(x => x.id !== c.id), c]; setWeeklyCults(n); saveToStorage('cults', n); }} onDeleteCult={(id) => { const n = weeklyCults.filter(x => x.id !== id); setWeeklyCults(n); saveToStorage('cults', n); }} onSaveNotice={(notice) => { const n = [...notices.filter(x => x.id !== notice.id), notice]; setNotices(n); saveToStorage('notices', n); }} onDeleteNotice={(id) => { const n = notices.filter(x => x.id !== id); setNotices(n); saveToStorage('notices', n); }} onReorderCults={(newList) => { setWeeklyCults(newList); saveToStorage('cults', newList); }} />;
              case 'devotional': return <DevotionalTab />;
              case 'bible': return <BibleTab />;
              case 'reading-plan': return <ReadingPlanTab />;
              case 'discipleship': return <DiscipleshipTab newConverts={newConverts} congregations={congregations} onSaveConvert={(c) => { const n = [...newConverts.filter(x => x.id !== c.id), c]; setNewConverts(n); saveToStorage('converts', n); }} onDeleteConvert={(id) => { const n = newConverts.filter(x => x.id !== id); setNewConverts(n); saveToStorage('converts', n); }} onConvertToMember={(m, id) => { setMembers([...members, m]); saveToStorage('members', [...members, m]); setNewConverts(newConverts.filter(x => x.id !== id)); saveToStorage('converts', newConverts.filter(x => x.id !== id)); }} />;
              case 'baptisms': return <BaptismsTab baptisms={baptisms} congregations={congregations} onSave={(b) => { const n = [...baptisms.filter(x => x.id !== b.id), b]; setBaptisms(n); saveToStorage('baptisms', n); }} onDelete={(id) => { const n = baptisms.filter(x => x.id !== id); setBaptisms(n); saveToStorage('baptisms', n); }} />;
              case 'courses': return <CoursesTab courses={courses} onSave={(c) => { const n = [...courses.filter(x => x.id !== c.id), c]; setCourses(n); saveToStorage('courses', n); }} onDelete={(id) => { const n = courses.filter(x => x.id !== id); setCourses(n); saveToStorage('courses', n); }} />;
              case 'media': return <MediaTab mediaItems={mediaItems} onSave={(m) => { const n = [...mediaItems.filter(x => x.id !== m.id), m]; setMediaItems(n); saveToStorage('media', n); }} onDelete={(id) => { const n = mediaItems.filter(x => x.id !== id); setMediaItems(n); saveToStorage('media', n); }} />;
              default: return <HomeTab carouselItems={carouselItems} membersCount={members.length} congsCount={congregations.length} baptisms={baptisms} onNavigate={setActiveTab} />;
            }
          })()}
        </div>
      </main>
    </div>
  );
};

export default App;
