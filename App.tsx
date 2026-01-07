
import React, { useState, useEffect } from 'react';
import { 
  Home, Users, Landmark, BookOpen, Book, Menu, X, Calendar, Layers, 
  Camera, BookType, HeartHandshake, Waves, GraduationCap, Cloud
} from 'lucide-react';
import { Member, Congregation, Department, Event, MediaItem, WeeklyCult, ChurchNotice, TabType, NewConvert, Baptism, CarouselItem, Course } from './types';
import { syncToCloud, subscribeToCloud } from './services/firebase';
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
  const [syncStatus, setSyncStatus] = useState<'online' | 'syncing'>('online');
  
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
  const [weeklyCults, setWeeklyCults] = useState<WeeklyCult[]>([]);
  const [notices, setNotices] = useState<ChurchNotice[]>([]);

  // 1. Carregar cache local imediatamente
  useEffect(() => {
    const keys = ['members', 'converts', 'baptisms', 'carousel', 'congs', 'deps', 'events', 'media', 'cults', 'notices', 'courses'];
    keys.forEach(key => {
      const saved = localStorage.getItem(`ieadban_${key}`);
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          switch(key) {
            case 'members': setMembers(parsed); break;
            case 'converts': setNewConverts(parsed); break;
            case 'baptisms': setBaptisms(parsed); break;
            case 'carousel': setCarouselItems(parsed); break;
            case 'congs': setCongregations(parsed); break;
            case 'deps': setDepartments(parsed); break;
            case 'events': setEvents(parsed); break;
            case 'media': setMediaItems(parsed); break;
            case 'cults': setWeeklyCults(parsed); break;
            case 'notices': setNotices(parsed); break;
            case 'courses': setCourses(parsed); break;
          }
        } catch (e) { console.error("Erro ao carregar cache:", e); }
      }
    });
  }, []);

  // 2. Escuta em Tempo Real
  useEffect(() => {
    const unsubscribes = [
      subscribeToCloud('members', setMembers),
      subscribeToCloud('converts', setNewConverts),
      subscribeToCloud('baptisms', setBaptisms),
      subscribeToCloud('carousel', setCarouselItems),
      subscribeToCloud('congs', setCongregations),
      subscribeToCloud('deps', setDepartments),
      subscribeToCloud('events', setEvents),
      subscribeToCloud('media', setMediaItems),
      subscribeToCloud('cults', setWeeklyCults),
      subscribeToCloud('notices', setNotices),
      subscribeToCloud('courses', setCourses)
    ];
    return () => unsubscribes.forEach(unsub => unsub?.());
  }, []);

  const handleGlobalUpdate = async (key: string, data: any) => {
    setSyncStatus('syncing');
    
    // UI Instantânea: Atualiza o estado local antes mesmo da rede
    switch(key) {
      case 'members': setMembers(data); break;
      case 'converts': setNewConverts(data); break;
      case 'baptisms': setBaptisms(data); break;
      case 'carousel': setCarouselItems(data); break;
      case 'congs': setCongregations(data); break;
      case 'deps': setDepartments(data); break;
      case 'events': setEvents(data); break;
      case 'media': setMediaItems(data); break;
      case 'cults': setWeeklyCults(data); break;
      case 'notices': setNotices(data); break;
      case 'courses': setCourses(data); break;
    }

    try {
      await syncToCloud(key, data);
    } catch (e) {
      console.error("Falha ao sincronizar com a nuvem:", e);
    } finally {
      // Força a limpeza do status "Sincronizando" após um curto delay
      setTimeout(() => setSyncStatus('online'), 1000);
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
      <aside className={`fixed md:sticky top-0 left-0 h-screen w-[260px] bg-white border-r border-slate-100 z-[110] transition-transform duration-300 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 flex flex-col`}>
        <div className="p-6 flex flex-col h-full">
          <div className="flex items-center gap-3 mb-10 px-2">
            <div className="bg-blue-600 p-2.5 rounded-xl text-white shadow-lg">
              <Landmark size={22} />
            </div>
            <div>
              <h1 className="font-black text-xl text-slate-800 tracking-tighter">IEADBAN</h1>
              <div className="flex items-center gap-1.5">
                <div className={`w-1.5 h-1.5 rounded-full ${syncStatus === 'online' ? 'bg-emerald-500' : 'bg-amber-500 animate-pulse'}`} />
                <span className={`text-[9px] font-black uppercase tracking-widest ${syncStatus === 'syncing' ? 'text-amber-500' : 'text-slate-400'}`}>
                  {syncStatus === 'syncing' ? 'Sincronizando...' : 'Nuvem IEADBAN'}
                </span>
              </div>
            </div>
          </div>
          
          <nav className="flex-1 space-y-1 overflow-y-auto pr-2 custom-scrollbar">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => { setActiveTab(item.id as TabType); setIsSidebarOpen(false); }}
                className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-xl transition-all font-bold text-sm ${activeTab === item.id ? 'bg-blue-600 text-white shadow-md' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800'}`}
              >
                <item.icon size={18} />
                <span>{item.label}</span>
              </button>
            ))}
          </nav>

          <div className="mt-6 pt-6 border-t border-slate-50">
            <div className="p-4 bg-slate-50 rounded-2xl flex items-center gap-3">
               <div className="bg-white p-2 rounded-lg text-blue-600 shadow-sm">
                 <Cloud size={16} />
               </div>
               <div>
                 <p className="text-[9px] font-black text-slate-400 uppercase mb-1">Status Global</p>
                 <p className="text-[10px] font-bold text-slate-600 leading-tight">Backup Real-Time</p>
               </div>
            </div>
          </div>
        </div>
      </aside>

      <main className="flex-1 flex flex-col min-w-0 min-h-screen">
        <header className="md:hidden bg-white border-b border-slate-100 p-4 flex justify-between items-center sticky top-0 z-50">
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
              case 'members': return <MembersTab members={members} congregations={congregations} onAdd={(m) => { handleGlobalUpdate('members', [...members, m]); }} onUpdate={(m) => { handleGlobalUpdate('members', members.map(p => p.id === m.id ? m : p)); }} onDelete={(id) => { handleGlobalUpdate('members', members.filter(p => p.id !== id)); }} />;
              case 'congregations': return <CongregationsTab congregations={congregations} onAdd={(c) => { handleGlobalUpdate('congs', [...congregations, c]); }} onUpdate={(c) => { handleGlobalUpdate('congs', congregations.map(p => p.id === c.id ? c : p)); }} onDelete={(id) => { handleGlobalUpdate('congs', congregations.filter(p => p.id !== id)); }} />;
              case 'departments': return <DepartmentsTab departments={departments} onSave={(d) => { handleGlobalUpdate('deps', [...departments.filter(x => x.id !== d.id), d]); }} onDelete={(id) => { handleGlobalUpdate('deps', departments.filter(x => x.id !== id)); }} />;
              case 'events': return <EventsTab carouselItems={carouselItems} onSaveCarouselItem={(item) => { handleGlobalUpdate('carousel', [...carouselItems.filter(x => x.id !== item.id), item]); }} onDeleteCarouselItem={(id) => { handleGlobalUpdate('carousel', carouselItems.filter(x => x.id !== id)); }} events={events} weeklyCults={weeklyCults} notices={notices} onSaveEvent={(e) => { handleGlobalUpdate('events', [...events.filter(x => x.id !== e.id), e]); }} onDeleteEvent={(id) => { handleGlobalUpdate('events', events.filter(x => x.id !== id)); }} onSaveCult={(c) => { handleGlobalUpdate('cults', [...weeklyCults.filter(x => x.id !== c.id), c]); }} onDeleteCult={(id) => { handleGlobalUpdate('cults', weeklyCults.filter(x => x.id !== id)); }} onSaveNotice={(notice) => { handleGlobalUpdate('notices', [...notices.filter(x => x.id !== notice.id), notice]); }} onDeleteNotice={(id) => { handleGlobalUpdate('notices', notices.filter(x => x.id !== id)); }} onReorderCults={(newList) => { handleGlobalUpdate('cults', newList); }} />;
              case 'devotional': return <DevotionalTab />;
              case 'bible': return <BibleTab />;
              case 'reading-plan': return <ReadingPlanTab />;
              case 'discipleship': return <DiscipleshipTab newConverts={newConverts} congregations={congregations} onSaveConvert={(c) => { handleGlobalUpdate('converts', [...newConverts.filter(x => x.id !== c.id), c]); }} onDeleteConvert={(id) => { handleGlobalUpdate('converts', newConverts.filter(x => x.id !== id)); }} onConvertToMember={(m, id) => { handleGlobalUpdate('members', [...members, m]); handleGlobalUpdate('converts', newConverts.filter(x => x.id !== id)); }} />;
              case 'baptisms': return <BaptismsTab baptisms={baptisms} congregations={congregations} onSave={(b) => { handleGlobalUpdate('baptisms', [...baptisms.filter(x => x.id !== b.id), b]); }} onDelete={(id) => { handleGlobalUpdate('baptisms', baptisms.filter(x => x.id !== id)); }} />;
              case 'courses': return <CoursesTab courses={courses} onSave={(c) => { handleGlobalUpdate('courses', [...courses.filter(x => x.id !== c.id), c]); }} onDelete={(id) => { handleGlobalUpdate('courses', courses.filter(x => x.id !== id)); }} />;
              case 'media': return <MediaTab mediaItems={mediaItems} onSave={(m) => { handleGlobalUpdate('media', [...mediaItems.filter(x => x.id !== m.id), m]); }} onDelete={(id) => { handleGlobalUpdate('media', mediaItems.filter(x => x.id !== id)); }} />;
              default: return <HomeTab carouselItems={carouselItems} membersCount={members.length} congsCount={congregations.length} baptisms={baptisms} onNavigate={setActiveTab} />;
            }
          })()}
        </div>
      </main>
    </div>
  );
};

export default App;
