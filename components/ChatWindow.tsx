
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, X, ArrowLeft, User, ShieldCheck } from 'lucide-react';
import { UserProfile, Message } from '../types';

interface Props {
  user: UserProfile | null;
  partner: UserProfile | null;
  onClose: () => void;
  translations: any;
}

const ChatWindow: React.FC<Props> = ({ user, partner, onClose, translations }) => {
  const [messages, setMessages] = useState<Message[]>([
    { id: '1', senderId: partner?.id || 'sys', text: "Hello! I saw you were interested in my property. How can I help you today?", timestamp: Date.now() - 100000 }
  ]);
  const [inputText, setInputText] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = () => {
    if (!inputText.trim() || !user) return;
    const newMessage: Message = {
      id: Date.now().toString(),
      senderId: user.id,
      text: inputText,
      timestamp: Date.now()
    };
    setMessages([...messages, newMessage]);
    setInputText('');

    // Mock auto-reply
    setTimeout(() => {
      const reply: Message = {
        id: (Date.now() + 1).toString(),
        senderId: partner?.id || 'sys',
        text: "That sounds great! Would you like to schedule a site visit for this weekend?",
        timestamp: Date.now()
      };
      setMessages(prev => [...prev, reply]);
    }, 1500);
  };

  if (!partner) return null;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }} 
      animate={{ opacity: 1, y: 0 }} 
      className="max-w-4xl mx-auto py-6 h-[80vh] flex flex-col bg-white dark:bg-slate-900 rounded-[3rem] shadow-2xl border border-slate-100 dark:border-slate-800 overflow-hidden"
    >
      {/* Header */}
      <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button onClick={onClose} className="p-2 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl transition-colors">
            <ArrowLeft size={20} className="text-slate-400" />
          </button>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl overflow-hidden border-2 border-indigo-100">
              <img src={partner.avatar} className="w-full h-full object-cover" />
            </div>
            <div>
              <h3 className="font-black text-lg dark:text-white flex items-center gap-1.5">
                {partner.name}
                {partner.isVerified && <ShieldCheck size={14} className="text-indigo-600" />}
              </h3>
              <p className="text-[10px] text-emerald-500 font-black uppercase tracking-widest">Active Now</p>
            </div>
          </div>
        </div>
        <button onClick={onClose} className="p-3 text-slate-400 hover:text-rose-500 transition-colors">
          <X size={24} />
        </button>
      </div>

      {/* Messages Area */}
      <div ref={scrollRef} className="flex-grow overflow-y-auto p-8 space-y-6 no-scrollbar">
        {messages.map((msg) => {
          const isOwn = msg.senderId === user?.id;
          return (
            <motion.div 
              key={msg.id}
              initial={{ opacity: 0, x: isOwn ? 10 : -10 }}
              animate={{ opacity: 1, x: 0 }}
              className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`max-w-[70%] p-5 rounded-3xl font-medium text-sm shadow-sm ${
                isOwn 
                ? 'bg-indigo-600 text-white rounded-tr-none' 
                : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-200 rounded-tl-none border border-slate-100 dark:border-slate-700'
              }`}>
                {msg.text}
                <p className={`text-[8px] mt-2 font-black uppercase tracking-widest ${isOwn ? 'text-indigo-200' : 'text-slate-400'}`}>
                  {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Input Area */}
      <div className="p-6 border-t border-slate-100 dark:border-slate-800">
        <div className="relative flex items-center gap-3">
          <input 
            type="text" 
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Type your message..."
            className="flex-grow bg-slate-50 dark:bg-slate-800 border-none rounded-2xl px-6 py-4 text-sm font-bold dark:text-white outline-none focus:ring-2 focus:ring-indigo-600 transition-all"
          />
          <button 
            onClick={handleSend}
            disabled={!inputText.trim()}
            className="p-4 bg-indigo-600 text-white rounded-2xl shadow-xl shadow-indigo-100 dark:shadow-none hover:scale-105 active:scale-95 transition-all disabled:opacity-50"
          >
            <Send size={20} />
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default ChatWindow;
