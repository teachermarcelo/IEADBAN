
import React, { useState, useEffect } from 'react';
import { 
  Home, Users, Landmark, BookOpen, Book, Menu, X, Calendar, Layers, 
  Camera, BookType, HeartHandshake, Waves, GraduationCap 
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
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    try {
      const savedMembers = localStorage.getItem('ieadban_members');
      const savedConverts = localStorage.getItem('ieadban_converts');
      const savedBaptisms = localStorage.getItem('ieadban_baptisms');
      const savedCarousel = localStorage.getItem('ieadban_carousel');
      const savedCongs = localStorage.getItem('ieadban_congs');
      const savedDeps = localStorage.getItem('ieadban_deps');
      const savedEvents = localStorage.getItem('ieadban_events');
      const savedMedia = localStorage.getItem('ieadban_media');
      const savedCults = localStorage.getItem('ieadban_cults');
      const savedNotices = localStorage.getItem('ieadban_notices');
      const savedCourses = localStorage.getItem('ieadban_courses');
      
      if (savedMembers) setMembers(JSON.parse(savedMembers));
      if (savedConverts) setNewConverts(JSON.parse(savedConverts));
      if (savedBaptisms) setBaptisms(JSON.parse(savedBaptisms));
      if (savedCarousel) setCarouselItems(JSON.parse(savedCarousel));
      if (savedCongs) setCongregations(JSON.parse(savedCongs));
      if (savedDeps) setDepartments(JSON.parse(savedDeps));
      if (savedEvents) setEvents(JSON.parse(savedEvents));
      if (savedMedia) setMediaItems(JSON.parse(savedMedia));
      if (savedCults) setWeeklyCults(JSON.parse(savedCults));
      if (savedNotices) setNotices(JSON.parse(savedNotices));
      if (savedCourses) setCourses(JSON.parse(savedCourses));
    } catch (e) {
      console.error("Erro ao carregar dados do localStorage", e);
    }
  }, []);

  const saveToStorage = (key: string, data: any) => {
    localStorage.setItem(`ieadban_${key}`, JSON.stringify(data));
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'home': return <HomeTab carouselItems={carouselItems} membersCount={members.length} congsCount={congregations.length} baptisms={baptisms} onNavigate={setActiveTab} />;
      case 'members': return <MembersTab members={members} congregations={congregations} onAdd={(m) => { const n = [...members, m]; setMembers(n); saveToStorage('members', n); }} onUpdate={(m) => { const n = members.map(p => p.id === m.id ? m : p); setMembers(n); saveToStorage('members', n); }} onDelete={(id) => { const n = members.filter(p => p.id !== id); setMembers(n); saveToStorage('members', n); }} />;
      case 'discipleship': return <DiscipleshipTab newConverts={newConverts} congregations={congregations} onSaveConvert={(c) => { const n = newConverts.some(x => x.id === c.id) ? newConverts.map(x => x.id === c.id ? c : x) : [...newConverts, c]; setNewConverts(n); saveToStorage('converts', n); }} onDeleteConvert={(id) => { const n = newConverts.filter(x => x.id !== id); setNewConverts(n); saveToStorage('converts', n); }} onConvertToMember={(m, convertId) => { const nMembers = [...members, m]; setMembers(nMembers); saveToStorage('members', nMembers); const nConverts = newConverts.filter(x => x.id !== convertId); setNewConverts(nConverts); saveToStorage('converts', nConverts); setActiveTab('members'); }} />;
      case 'baptisms': return <BaptismsTab baptisms={baptisms} congregations={congregations} onSave={(b) => { const n = baptisms.some(x => x.id === b.id) ? baptisms.map(x => x.id === b.id ? b : x) : [...baptisms, b]; setBaptisms(n); saveToStorage('baptisms', n); }} onDelete={(id) => { const n = baptisms.filter(x => x.id !== id); setBaptisms(n); saveToStorage('baptisms', n); }} />;
      case 'congregations': return <CongregationsTab congregations={congregations} onAdd={(c) => { const n = [...congregations, c]; setCongregations(n); saveToStorage('congs', n); }} onUpdate={(c) => { const n = congregations.map(p => p.id === c.id ? c : p); setCongregations(n); saveToStorage('congs', n); }} onDelete={(id) => { const n = congregations.filter(p => p.id !== id); setCongregations(n); saveToStorage('congs', n); }} />;
      case 'departments': return <DepartmentsTab departments={departments} onSave={(d) => { const n = departments.some(x => x.id === d.id) ? departments.map(x => x.id === d.id ? d : x) : [...departments, d]; setDepartments(n); saveToStorage('deps', n); }} onDelete={(id) => { const n = departments.filter(x => x.id !== id); setDepartments(n); saveToStorage('deps', n); }} />;
      case 'courses': return <CoursesTab courses={courses} onSave={(c) => { const n = courses.some(x => x.id === c.id) ? courses.map(x => x.id === c.id ? c : x) : [...courses, c]; setCourses(n); saveToStorage('courses', n); }} onDelete={(id) => { const n = courses.filter(x => x.id !== id); setCourses(n); saveToStorage('courses', n); }} />;
      case 'events': return <EventsTab carouselItems={carouselItems} onSaveCarouselItem={(item) => { const n = carouselItems.some(x => x.id === item.id) ? carouselItems.map(x => x.id === item.id ? item : x) : [...carouselItems, item]; setCarouselItems(n); saveToStorage('carousel', n); }} onDeleteCarouselItem={(id) => { const n = carouselItems.filter(x => x.id !== id); setCarouselItems(n); saveToStorage('carousel', n); }} events={events} weeklyCults={weeklyCults} notices={notices} onSaveEvent={(e) => { const n = events.some(x => x.id === e.id) ? events.map(x => x.id === e.id ? e : x) : [...events, e]; setEvents(n); saveToStorage('events', n); }} onDeleteEvent={(id) => { const n = events.filter(x => x.id !== id); setEvents(n); saveToStorage('events', n); }} onSaveCult={(c) => { const n = weeklyCults.some(x => x.id === c.id) ? weeklyCults.map(x => x.id === c.id ? c : x) : [...weeklyCults, c]; setWeeklyCults(n); saveToStorage('cults', n); }} onDeleteCult={(id) => { const n = weeklyCults.filter(x => x.id !== id); setWeeklyCults(n); saveToStorage('cults', n); }} onSaveNotice={(notice) => { const n = notices.some(x => x.id === notice.id) ? notices.map(x => x.id === notice.id ? notice : x) : [...notices, notice]; setNotices(n); saveToStorage('notices', n); }} onDeleteNotice={(id) => { const n = notices.filter(x => x.id !== id); setNotices(n); saveToStorage('notices', n); }} onReorderCults={(newList) => { setWeeklyCults(newList); saveToStorage('cults', newList); }} />;
      case 'devotional': return <DevotionalTab />;
      case 'media': return <MediaTab mediaItems={mediaItems} onSave={(m) => { const n = mediaItems.some(x => x.id === m.id) ? mediaItems.map(x => x.id === m.id ? m : x) : [...mediaItems, m]; setMediaItems(n); saveToStorage('media', n); }} onDelete={(id) => { const n = mediaItems.filter(x => x.id !== id); setMediaItems(n); saveToStorage('media', n); }} />;
      case 'reading-plan': return <ReadingPlanTab />;
      case 'bible': return <BibleTab />;
      default: return <HomeTab carouselItems={carouselItems} membersCount={members.length} congsCount={congregations.length} baptisms={baptisms} onNavigate={setActiveTab} />;
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
      <header className="md:hidden bg-[#1E293B] text-white p-4 flex justify-between items-center sticky top-0 z-50 shadow-md">
        <h1 className="font-bold text-xl tracking-tight">IEADBAN</h1>
        <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} aria-label="Menu"><Menu /></button>
      </header>

      <aside className={`fixed md:sticky top-0 left-0 h-full w-72 bg-white border-r border-slate-100 z-40 transition-all ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 flex flex-col shadow-xl md:shadow-none`}>
        <div className="p-8 hidden md:block">
          <div className="flex items-center gap-3 mb-8">
            <div className="bg-blue-600 p-2.5 rounded-2xl text-white shadow-lg shadow-blue-200">
              <Landmark size={24} />
            </div>
            <div>
              <h1 className="font-black text-xl text-slate-800 tracking-tight">IEADBAN</h1>
              <p className="text-[10px] font-bold text-blue-500 uppercase tracking-widest">Gestão Digital</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 px-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => { setActiveTab(item.id as TabType); setIsSidebarOpen(false); }}
              className={`w-full flex items-center gap-4 px-5 py-3.5 rounded-2xl transition-all ${activeTab === item.id ? 'bg-blue-600 text-white shadow-lg shadow-blue-100' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800'}`}
            >
              <item.icon size={22} strokeWidth={activeTab === item.id ? 2.5 : 2} />
              <span className="font-bold text-sm">{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="m-6 p-5 rounded-3xl bg-slate-50 border border-slate-100">
           <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest mb-1">Presidente</p>
           <p className="text-sm font-black text-slate-800">Pr. Elias Israel Dias</p>
        </div>
      </aside>

      <main className="flex-1 p-6 md:p-10 lg:p-12 overflow-y-auto w-full">
        <div className="max-w-6xl mx-auto">
          {renderContent()}
        </div>
      </main>
    </div>
  );
};

export default App;
