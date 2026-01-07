
import React, { useState, useEffect } from 'react';
import { BookType, ChevronRight, Search, BookOpen, Scroll, X, Loader2, ArrowLeft } from 'lucide-react';

const BIBLE_BOOKS = {
  antigo: [
    { name: "Gênesis", chapters: 50 }, { name: "Êxodo", chapters: 40 }, { name: "Levítico", chapters: 27 },
    { name: "Números", chapters: 36 }, { name: "Deuteronômio", chapters: 34 }, { name: "Josué", chapters: 24 },
    { name: "Juízes", chapters: 21 }, { name: "Rute", chapters: 4 }, { name: "1 Samuel", chapters: 31 },
    { name: "2 Samuel", chapters: 24 }, { name: "1 Reis", chapters: 22 }, { name: "2 Reis", chapters: 25 },
    { name: "1 Crônicas", chapters: 29 }, { name: "2 Crônicas", chapters: 36 }, { name: "Esdras", chapters: 10 },
    { name: "Neemias", chapters: 13 }, { name: "Ester", chapters: 10 }, { name: "Jó", chapters: 42 },
    { name: "Salmos", chapters: 150 }, { name: "Provérbios", chapters: 31 }, { name: "Eclesiastes", chapters: 12 },
    { name: "Cantares", chapters: 8 }, { name: "Isaías", chapters: 66 }, { name: "Jeremias", chapters: 52 },
    { name: "Lamentações", chapters: 5 }, { name: "Ezequiel", chapters: 48 }, { name: "Daniel", chapters: 12 },
    { name: "Oseias", chapters: 14 }, { name: "Joel", chapters: 3 }, { name: "Amós", chapters: 9 },
    { name: "Obadias", chapters: 1 }, { name: "Jonas", chapters: 4 }, { name: "Miqueias", chapters: 7 },
    { name: "Naum", chapters: 3 }, { name: "Habacuque", chapters: 3 }, { name: "Sofonias", chapters: 3 },
    { name: "Ageu", chapters: 2 }, { name: "Zacarias", chapters: 14 }, { name: "Malaquias", chapters: 4 }
  ],
  novo: [
    { name: "Mateus", chapters: 28 }, { name: "Marcos", chapters: 16 }, { name: "Lucas", chapters: 24 },
    { name: "João", chapters: 21 }, { name: "Atos", chapters: 28 }, { name: "Romanos", chapters: 16 },
    { name: "1 Coríntios", chapters: 16 }, { name: "2 Coríntios", chapters: 13 }, { name: "Gálatas", chapters: 6 },
    { name: "Efésios", chapters: 6 }, { name: "Filipenses", chapters: 4 }, { name: "Colossenses", chapters: 4 },
    { name: "1 Tessalonicenses", chapters: 5 }, { name: "2 Tessalonicenses", chapters: 3 }, { name: "1 Timóteo", chapters: 6 },
    { name: "2 Timóteo", chapters: 4 }, { name: "Tito", chapters: 3 }, { name: "Filemom", chapters: 1 },
    { name: "Hebreus", chapters: 13 }, { name: "Tiago", chapters: 5 }, { name: "1 Pedro", chapters: 5 },
    { name: "2 Pedro", chapters: 3 }, { name: "1 João", chapters: 5 }, { name: "2 João", chapters: 1 },
    { name: "3 João", chapters: 1 }, { name: "Judas", chapters: 1 }, { name: "Apocalipse", chapters: 22 }
  ]
};

const BibleTab: React.FC = () => {
  const [selectedBook, setSelectedBook] = useState<{name: string, chapters: number} | null>(null);
  const [selectedChapter, setSelectedChapter] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [chapterContent, setChapterContent] = useState<{number: number, text: string}[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchChapter = async (book: string, chapter: number) => {
    setLoading(true);
    setSelectedChapter(chapter);
    try {
      // Usando uma API pública de Bíblia (Abba API ou similar - Simulação de dados estruturados para o exemplo)
      // Em produção, você conectaria aqui a https://www.abibliadigital.com.br/api ou similar
      // Simulando versículos para demonstração imediata:
      const mockVerses = Array.from({ length: 25 }, (_, i) => ({
        number: i + 1,
        text: `Este é o versículo ${i + 1} do capítulo ${chapter} de ${book}. "Lâmpada para os meus pés é tua palavra, e luz para o meu caminho."`
      }));
      
      setChapterContent(mockVerses);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err) {
      alert("Erro ao carregar capítulo.");
    } finally {
      setLoading(false);
    }
  };

  const filterBooks = (list: any[]) => 
    list.filter(b => b.name.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <div className="space-y-10 animate-in fade-in duration-700 pb-20">
      {/* Header */}
      <div className="bg-white p-10 rounded-[48px] border border-slate-100 shadow-sm flex flex-col md:flex-row justify-between items-center gap-8">
        <div>
          <h2 className="text-4xl font-black text-slate-800 tracking-tight">Bíblia Sagrada</h2>
          <p className="text-slate-400 font-bold text-xs uppercase tracking-widest mt-2 flex items-center gap-2">
            <Scroll size={14} className="text-blue-500" /> Versão Almeida Revista e Corrigida
          </p>
        </div>
        {!selectedChapter && (
          <div className="relative w-full md:w-80">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="Buscar livro..." 
              className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-3xl font-bold outline-none focus:ring-2 ring-blue-500 transition-all"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />
          </div>
        )}
      </div>

      {!selectedBook ? (
        /* Lista de Livros */
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          <div className="space-y-6">
            <div className="flex items-center gap-3 ml-4">
              <div className="w-2 h-8 bg-blue-600 rounded-full" />
              <h3 className="text-xl font-black text-slate-800 uppercase tracking-tight">Antigo Testamento</h3>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {filterBooks(BIBLE_BOOKS.antigo).map(book => (
                <button 
                  key={book.name}
                  onClick={() => setSelectedBook(book)}
                  className="bg-white p-4 rounded-2xl border border-slate-100 text-left font-bold text-slate-700 hover:border-blue-500 hover:shadow-lg transition-all flex items-center justify-between group"
                >
                  <span className="truncate">{book.name}</span>
                  <ChevronRight size={14} className="text-slate-200 group-hover:text-blue-500" />
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-6">
            <div className="flex items-center gap-3 ml-4">
              <div className="w-2 h-8 bg-indigo-600 rounded-full" />
              <h3 className="text-xl font-black text-slate-800 uppercase tracking-tight">Novo Testamento</h3>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {filterBooks(BIBLE_BOOKS.novo).map(book => (
                <button 
                  key={book.name}
                  onClick={() => setSelectedBook(book)}
                  className="bg-white p-4 rounded-2xl border border-slate-100 text-left font-bold text-slate-700 hover:border-indigo-500 hover:shadow-lg transition-all flex items-center justify-between group"
                >
                  <span className="truncate">{book.name}</span>
                  <ChevronRight size={14} className="text-slate-200 group-hover:text-indigo-500" />
                </button>
              ))}
            </div>
          </div>
        </div>
      ) : !selectedChapter ? (
        /* Seleção de Capítulos */
        <div className="bg-white rounded-[56px] border border-slate-100 shadow-2xl p-10 min-h-[500px] animate-in zoom-in-95">
          <button 
            onClick={() => setSelectedBook(null)}
            className="text-xs font-black uppercase text-blue-600 flex items-center gap-2 hover:bg-blue-50 px-4 py-2 rounded-xl mb-8"
          >
            <ArrowLeft size={16}/> Voltar para Livros
          </button>
          
          <div className="text-center mb-12">
            <h3 className="text-4xl font-black text-slate-800">{selectedBook.name}</h3>
            <p className="text-slate-400 font-bold uppercase text-[10px] tracking-widest mt-2">Selecione o Capítulo</p>
          </div>

          <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 gap-3 max-w-4xl mx-auto">
            {Array.from({ length: selectedBook.chapters }, (_, i) => (
              <button 
                key={i + 1}
                onClick={() => fetchChapter(selectedBook.name, i + 1)}
                className="aspect-square bg-slate-50 rounded-2xl flex items-center justify-center font-black text-slate-500 hover:bg-blue-600 hover:text-white transition-all shadow-sm border border-slate-100"
              >
                {i + 1}
              </button>
            ))}
          </div>
        </div>
      ) : (
        /* Visualização do Capítulo (Versículos) */
        <div className="bg-white rounded-[56px] border border-slate-100 shadow-2xl p-8 md:p-16 min-h-[600px] animate-in slide-in-from-bottom-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-16 pb-8 border-b border-slate-50">
            <button 
              onClick={() => { setSelectedChapter(null); setChapterContent([]); }}
              className="text-xs font-black uppercase text-slate-400 flex items-center gap-2 hover:text-blue-600 transition-all"
            >
              <ArrowLeft size={16}/> Mudar Capítulo
            </button>
            
            <div className="text-center">
              <h3 className="text-3xl font-black text-slate-800 tracking-tight">{selectedBook.name} {selectedChapter}</h3>
              <p className="text-[10px] font-black text-blue-500 uppercase tracking-[0.3em] mt-1">Leitura Sagrada</p>
            </div>

            <div className="flex gap-2">
               {/* Placeholders para botões de áudio ou tradução futuramente */}
               <div className="w-10 h-10 bg-slate-50 rounded-full flex items-center justify-center text-slate-300"><BookOpen size={18}/></div>
            </div>
          </div>

          {loading ? (
            <div className="flex flex-col items-center justify-center py-24 space-y-4">
               <Loader2 className="animate-spin text-blue-600" size={40} />
               <p className="text-slate-400 font-black uppercase text-[10px] tracking-widest">Buscando versículos...</p>
            </div>
          ) : (
            <div className="max-w-3xl mx-auto space-y-8 pb-20">
              {chapterContent.map(v => (
                <div key={v.number} className="flex gap-6 group">
                   <span className="text-blue-600 font-black text-sm mt-1 shrink-0 opacity-40 group-hover:opacity-100 transition-opacity">{v.number}</span>
                   <p className="text-slate-700 text-lg leading-[1.8] font-medium tracking-tight">
                     {v.text}
                   </p>
                </div>
              ))}
              
              <div className="pt-20 text-center">
                <button 
                  onClick={() => { setSelectedChapter(null); setChapterContent([]); }}
                  className="bg-slate-900 text-white px-10 py-4 rounded-3xl font-black uppercase text-xs tracking-widest hover:scale-105 transition-all shadow-xl"
                >
                  Concluir Leitura
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default BibleTab;
