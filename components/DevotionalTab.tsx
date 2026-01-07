
import React, { useState, useRef } from 'react';
import { GoogleGenAI } from '@google/genai';
import { Sparkles, Loader2, Share2, Image as ImageIcon, Heart, BookOpen, Download, Instagram, MessageCircle } from 'lucide-react';

const DevotionalTab: React.FC = () => {
  const [theme, setTheme] = useState('Renovo');
  const [content, setContent] = useState<{ text: string; imageUrl: string | null; title: string }>({ text: '', imageUrl: null, title: '' });
  const [loading, setLoading] = useState(false);
  const devotionalRef = useRef<HTMLDivElement>(null);

  const generateFullDevotional = async () => {
    setLoading(true);
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
    
    try {
      const textResponse = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Escreva um devocional cristão CURTO (estilo magazine) para a Igreja Assembleia de Deus Balsa Nova sobre "${theme}". 
        REGRAS CRÍTICAS: 
        1. Comece com um título curto e impactante.
        2. Inclua um versículo chave.
        3. Reflexão de 2 parágrafos.
        Use Markdown.`
      });

      const imgResponse = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: `Uma fotografia estética, minimalista e pacífica representando "${theme}". Luz divina suave, cores pastéis e naturais, estilo cinematográfico limpo para fundo de post social.`
      });

      let base64Img = null;
      for (const part of imgResponse.candidates[0].content.parts) {
        if (part.inlineData) base64Img = `data:image/png;base64,${part.inlineData.data}`;
      }

      let rawText = textResponse.text || '';
      // Tentar extrair o primeiro título como título oficial
      const titleMatch = rawText.match(/# (.*)/) || rawText.match(/(.*)\n/);
      const extractedTitle = titleMatch ? titleMatch[1].replace(/#/g, '').trim() : `Devocional: ${theme}`;

      setContent({
        text: rawText,
        imageUrl: base64Img,
        title: extractedTitle
      });
    } catch (err) {
      console.error(err);
      alert("Paz do Senhor! Não conseguimos buscar a palavra agora. Tente em instantes.");
    } finally {
      setLoading(false);
    }
  };

  const handleShareWhatsApp = () => {
    const shareText = `*IEADBAN - Devocional Diário*\n\n*Tema:* ${theme}\n*Título:* ${content.title}\n\n${content.text.replace(/#/g, '').trim()}\n\n_Acesse o App IEADBAN para mais conteúdo._`;
    const url = `https://wa.me/?text=${encodeURIComponent(shareText)}`;
    window.open(url, '_blank');
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Devocional IEADBAN - ${content.title}`,
          text: `Paz do Senhor! Confira o devocional de hoje sobre ${theme}: ${content.title}`,
          url: window.location.href,
        });
      } catch (err) { console.log(err); }
    } else {
      handleShareWhatsApp();
    }
  };

  const themes = ['Renovo', 'Esperança', 'Sabedoria', 'Fé', 'Gratidão', 'Família', 'Vitória', 'Promessa'];

  return (
    <div className="space-y-8 animate-in fade-in duration-700 max-w-5xl mx-auto pb-12">
      {/* Seletor de Temas */}
      <div className="bg-white p-10 rounded-[48px] shadow-sm border border-slate-100 text-center relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-400 via-indigo-500 to-purple-500" />
        <h2 className="text-4xl font-black text-slate-800 mb-2 tracking-tight uppercase">Pão Diário</h2>
        <p className="text-slate-400 mb-10 font-medium tracking-wide">ESCOLHA UM TEMA PARA MEDITAR</p>
        
        <div className="flex flex-wrap justify-center gap-3 mb-10">
          {themes.map(t => (
            <button
              key={t}
              onClick={() => setTheme(t)}
              className={`px-8 py-3 rounded-2xl text-sm font-black transition-all ${theme === t ? 'bg-slate-900 text-white shadow-xl scale-105' : 'bg-slate-50 text-slate-400 hover:bg-slate-100 hover:text-slate-600'}`}
            >
              {t}
            </button>
          ))}
        </div>

        <button
          onClick={generateFullDevotional}
          disabled={loading}
          className="bg-blue-600 text-white px-12 py-5 rounded-[24px] font-black flex items-center gap-4 mx-auto hover:bg-blue-700 transition-all disabled:opacity-50 shadow-2xl shadow-blue-100 active:scale-95"
        >
          {loading ? <Loader2 className="animate-spin" /> : <Sparkles size={20} className="text-blue-200" />}
          {loading ? 'Preparando Alimento...' : 'Receber Palavra do Dia'}
        </button>
      </div>

      {content.text && (
        <div className="space-y-6">
          {/* Botões de Ação Rápida Social */}
          <div className="flex justify-center gap-4">
             <button 
               onClick={handleShareWhatsApp}
               className="flex items-center gap-2 bg-emerald-500 text-white px-6 py-3 rounded-2xl font-black text-xs uppercase tracking-widest shadow-lg shadow-emerald-100 hover:scale-105 transition-all"
             >
                <MessageCircle size={18}/> WhatsApp
             </button>
             <button 
               onClick={handleNativeShare}
               className="flex items-center gap-2 bg-slate-900 text-white px-6 py-3 rounded-2xl font-black text-xs uppercase tracking-widest shadow-lg shadow-slate-200 hover:scale-105 transition-all"
             >
                <Share2 size={18}/> Compartilhar
             </button>
             <button 
               onClick={() => window.print()} 
               className="flex items-center gap-2 bg-white border border-slate-200 text-slate-600 px-6 py-3 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-slate-50 transition-all"
             >
                <Download size={18}/> Salvar PDF
             </button>
          </div>

          {/* Card do Devocional */}
          <div ref={devotionalRef} className="bg-white rounded-[56px] shadow-2xl border border-slate-100 overflow-hidden grid grid-cols-1 lg:grid-cols-12 min-h-[600px] print:shadow-none print:border-none">
            {/* Magazine Cover Image */}
            <div className="lg:col-span-5 relative min-h-[300px]">
              {content.imageUrl ? (
                <img src={content.imageUrl} alt="Capa" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full bg-slate-50 flex items-center justify-center">
                  <ImageIcon size={64} className="text-slate-200" />
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
              <div className="absolute bottom-10 left-10 right-10">
                 <div className="bg-white/10 backdrop-blur-xl px-5 py-3 rounded-3xl flex flex-col gap-1 border border-white/20">
                    <div className="flex items-center gap-2">
                      <Heart size={16} className="text-rose-400 fill-rose-400" />
                      <span className="text-[10px] font-black text-white uppercase tracking-[0.3em]">IEADBAN DIGITAL</span>
                    </div>
                    <p className="text-white font-black text-xl leading-tight mt-1">{content.title}</p>
                 </div>
              </div>
            </div>

            {/* Magazine Content */}
            <div className="lg:col-span-7 p-10 lg:p-16 flex flex-col justify-center bg-[#FDFEFE]">
              <div className="flex justify-between items-start mb-10 print:hidden">
                 <div className="bg-blue-50 text-blue-600 px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-[0.2em] border border-blue-100 shadow-sm">
                    {theme} • Devocional
                 </div>
                 <div className="flex gap-2">
                    <div className="p-3 bg-slate-50 text-slate-300 rounded-full"><Instagram size={20}/></div>
                 </div>
              </div>

              <div className="prose prose-slate max-w-none prose-h1:text-4xl prose-h1:font-black prose-h1:text-slate-900 prose-h1:tracking-tight prose-h1:mb-8 prose-p:text-slate-600 prose-p:text-lg prose-p:leading-[1.8] prose-strong:text-blue-600">
                 {content.text.split('\n').map((line, i) => {
                   if (line.trim() === '') return <br key={i} />;
                   if (line.startsWith('#')) return <h1 key={i} className="text-slate-900 font-black">{line.replace(/#/g, '').trim()}</h1>;
                   if (line.startsWith('>')) return <blockquote key={i} className="border-l-4 border-blue-500 pl-8 italic text-slate-500 my-10 text-xl font-medium leading-relaxed">{line.replace('>', '').trim()}</blockquote>;
                   if (line.startsWith('**')) return <p key={i} className="font-bold text-blue-700">{line.replace(/\*\*/g, '').trim()}</p>;
                   return <p key={i} className="mb-6">{line}</p>;
                 })}
              </div>
              
              <div className="mt-12 pt-10 border-t border-slate-100 flex items-center gap-5">
                 <div className="w-14 h-14 rounded-2xl bg-slate-900 flex items-center justify-center text-white shadow-xl">
                    <BookOpen size={24} />
                 </div>
                 <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Assembleia de Deus Balsa Nova</p>
                    <p className="text-sm font-black text-slate-800 tracking-tight">Pr. Elias Israel Dias</p>
                 </div>
              </div>
            </div>
          </div>
          
          <p className="text-center text-slate-400 text-[10px] font-bold uppercase tracking-widest">
            Dica: No celular, você pode tirar um print do card acima para postar nos seus Stories!
          </p>
        </div>
      )}
    </div>
  );
};

export default DevotionalTab;
