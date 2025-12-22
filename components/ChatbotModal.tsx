
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, Sparkles, Building2, MessageSquare, Zap, Target, Search, Landmark } from 'lucide-react';
import { GoogleGenAI } from '@google/genai';
import { Property, UserProfile } from '../types';

interface Props {
  onClose: () => void;
  isDarkMode: boolean;
  liveProperties: Property[];
  pendingProperties: Property[];
  user: UserProfile | null;
  currentView: string;
  activeProperty: Property | null;
}

const HUB_QUESTIONS = [
  { label: "Best Penthouses", query: "Show me the top verified penthouses in Mumbai." },
  { label: "Market Trends", query: "What are the latest real estate trends in major Indian cities?" },
  { label: "Upcoming Soon", query: "Show me new properties that are currently under verification." },
  { label: "Villas under 10Cr", query: "Find luxury villas under 10 Crore INR." }
];

const DETAIL_QUESTIONS = [
  { label: "Negotiability?", query: "Is the price of this property usually negotiable?" },
  { label: "Hidden Costs", query: "What are the typical maintenance and legal costs for an estate like this?" },
  { label: "Locality Intel", query: "Tell me more about the neighborhood and appreciation potential of this area." },
  { label: "Similar Estates", query: "Show me other properties similar to this one in the same price range." }
];

const ChatbotModal: React.FC<Props> = ({ onClose, isDarkMode, liveProperties, pendingProperties, user, currentView, activeProperty }) => {
  const [messages, setMessages] = useState<{ role: 'user' | 'model'; text: string; id: string }[]>([
    { 
      role: 'model', 
      id: '1',
      text: `Greetings ${user?.name?.split(' ')[0] || 'valued guest'}. I am your Elite Market Concierge. 
      ${activeProperty ? `I see you're looking at **${activeProperty.title}**. Would you like deep intel on this asset?` : "How can I guide your discovery across our premium marketplace today?"}` 
    }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-scroll on new messages
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleSend = async (text: string) => {
    if (!text.trim()) return;

    const userMsg = { role: 'user' as const, text, id: Date.now().toString() };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
      
      const systemInstruction = `
        You are the "GHAR BAZAR Elite Assistant". 
        CONTEXT:
        - Current User: ${user?.name || 'Anonymous'}.
        - Current View: ${currentView}.
        - Active Property (if any): ${activeProperty ? JSON.stringify({
            title: activeProperty.title,
            price: activeProperty.price,
            location: activeProperty.location,
            specs: `${activeProperty.beds}BHK, ${activeProperty.sqft}sqft`
          }) : 'None'}.

        DATABASE ACCESS:
        - Live Listings: ${JSON.stringify(liveProperties.map(p => ({ title: p.title, price: p.price, location: p.location, type: p.type })))}
        - Upcoming Listings: ${JSON.stringify(pendingProperties.map(p => ({ title: p.title, price: p.price, location: p.location })))}

        FORMATTING (MANDATORY):
        Arrange property information beautifully using this card structure:
        ---
        🏢 **[PROPERTY NAME]**
        📍 [LOCATION]
        🏷️ **Valuation:** ₹[Price in Cr/Lakh]
        ✨ **Market Status:** [Verified / Priority Early Access]
        📈 [Brief 1-line Highlight about the property]
        ---
        
        Keep responses elite, professional, and data-backed.
      `;

      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: text,
        config: {
          systemInstruction,
          temperature: 0.7,
        },
      });

      const modelMsg = { 
        role: 'model' as const, 
        text: response.text || "I've synthesized the market data. How else can I assist?", 
        id: (Date.now() + 1).toString() 
      };
      setMessages(prev => [...prev, modelMsg]);
    } catch (error) {
      setMessages(prev => [...prev, { 
        role: 'model', 
        id: 'err', 
        text: "My secure uplink is resetting. Please try again in a few moments." 
      }]);
    } finally {
      setIsTyping(false);
    }
  };

  const currentStamps = activeProperty || currentView === 'property-detail' ? DETAIL_QUESTIONS : HUB_QUESTIONS;

  return (
    <div className="fixed inset-0 z-[190] pointer-events-none flex items-end justify-end p-4 md:p-10">
      <motion.div 
        initial={{ opacity: 0, y: 50, scale: 0.9, originY: 1, originX: 1 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 30, scale: 0.9 }}
        style={{ 
          marginBottom: 'env(safe-area-inset-bottom)',
          bottom: window.innerWidth < 768 ? '11rem' : '8rem'
        }}
        className={`fixed right-4 md:right-10 pointer-events-auto w-[calc(100vw-32px)] md:w-[440px] max-h-[calc(100vh-200px)] flex flex-col rounded-[2.5rem] shadow-[0_30px_90px_-20px_rgba(0,0,0,0.4)] border overflow-hidden ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-100'}`}
      >
        {/* Elite Header */}
        <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between shrink-0 bg-indigo-600 text-white">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/20 flex items-center justify-center backdrop-blur-md">
              <Zap size={22} className="text-amber-300 fill-amber-300" />
            </div>
            <div>
              <h3 className="text-lg font-black tracking-tight leading-none uppercase italic">Elite Assist</h3>
              <div className="flex items-center gap-1.5 mt-1.5">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <p className="text-[9px] font-black uppercase tracking-widest text-indigo-100">Market Database Synced</p>
              </div>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-xl transition-all">
            <X size={24} />
          </button>
        </div>

        {/* Scrollable Intelligence Feed */}
        <div 
          ref={scrollRef}
          className="flex-grow overflow-y-auto p-5 space-y-6 no-scrollbar bg-slate-50/50 dark:bg-slate-950/40"
        >
          {messages.map((m) => (
            <div key={m.id} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[85%] p-4 rounded-3xl text-sm leading-relaxed shadow-sm ${
                m.role === 'user' 
                  ? 'bg-indigo-600 text-white rounded-tr-none' 
                  : 'bg-white dark:bg-slate-800 dark:text-slate-100 border border-slate-100 dark:border-slate-700 rounded-tl-none font-medium whitespace-pre-wrap'
              }`}>
                {m.role === 'model' && (
                  <div className="flex items-center gap-2 mb-2 text-indigo-500 dark:text-indigo-400">
                    <Target size={12} />
                    <span className="text-[8px] font-black uppercase tracking-widest">Ghar Bazar Intel</span>
                  </div>
                )}
                {m.text}
              </div>
            </div>
          ))}
          {isTyping && (
            <div className="flex justify-start">
              <div className="bg-white dark:bg-slate-800 px-4 py-3 rounded-2xl border border-slate-100 dark:border-slate-700 flex gap-1.5">
                <motion.div animate={{ opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 1 }} className="w-1.5 h-1.5 bg-indigo-500 rounded-full" />
                <motion.div animate={{ opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 1, delay: 0.2 }} className="w-1.5 h-1.5 bg-indigo-500 rounded-full" />
                <motion.div animate={{ opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 1, delay: 0.4 }} className="w-1.5 h-1.5 bg-indigo-500 rounded-full" />
              </div>
            </div>
          )}
        </div>

        {/* Dynamic Context stamps & Input */}
        <div className="p-4 border-t border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 shrink-0">
          <div className="flex gap-2 overflow-x-auto no-scrollbar mb-4 pb-1">
            {currentStamps.map((stamp, i) => (
              <button
                key={i}
                onClick={() => handleSend(stamp.query)}
                className="shrink-0 px-4 py-2 bg-slate-50 dark:bg-slate-800 text-slate-500 dark:text-slate-400 rounded-full text-[9px] font-black uppercase tracking-widest border border-slate-100 dark:border-slate-700 hover:bg-indigo-600 hover:text-white hover:border-indigo-600 transition-all flex items-center gap-2 group"
              >
                <Search size={12} className="group-hover:text-white" />
                {stamp.label}
              </button>
            ))}
          </div>

          <div className="relative flex items-center gap-2">
            <div className="relative flex-grow">
              <input 
                ref={inputRef}
                type="text" 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSend(input)}
                placeholder="Query market assets..."
                className="w-full pl-5 pr-5 py-3.5 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl text-sm font-bold dark:text-white outline-none focus:ring-2 focus:ring-indigo-600/20 transition-all"
              />
            </div>
            <button 
              onClick={() => handleSend(input)}
              disabled={!input.trim() || isTyping}
              className="p-4 bg-indigo-600 text-white rounded-2xl shadow-xl hover:scale-105 active:scale-95 transition-all disabled:opacity-30"
            >
              <Send size={18} />
            </button>
          </div>
          <div className="flex items-center justify-center gap-2 mt-3 opacity-50">
            <Landmark size={10} className="text-slate-400" />
            <p className="text-[7px] font-black uppercase tracking-[0.3em] text-slate-400">
              Verified Legal Intel Layer Active
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default ChatbotModal;
