
import React from 'react';
import { motion } from 'framer-motion';
import { Bell, CheckCircle, Info, Calendar, X, Sparkles } from 'lucide-react';

interface Props {
  onClose: () => void;
  isDarkMode: boolean;
  notifications: any[];
}

const NotificationCenter: React.FC<Props> = ({ onClose, isDarkMode, notifications }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: -20, scale: 0.95 }} 
      animate={{ opacity: 1, y: 0, scale: 1 }} 
      exit={{ opacity: 0, y: -20, scale: 0.95 }}
      className={`fixed top-20 right-4 md:right-10 w-full max-w-[380px] z-[100] rounded-[2.5rem] shadow-[0_32px_64px_-12px_rgba(0,0,0,0.15)] border backdrop-blur-2xl ${isDarkMode ? 'bg-gray-900/90 border-gray-800 text-white' : 'bg-white/90 border-gray-100 text-gray-900'}`}
    >
      <div className="p-8">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white">
              <Bell size={20} />
            </div>
            <h3 className="font-black text-xl tracking-tight">Activity</h3>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full dark:hover:bg-gray-800 transition-colors text-gray-400">
            <X size={16} />
          </button>
        </div>
        
        <div className="space-y-6 max-h-[400px] overflow-y-auto no-scrollbar pr-1">
          {notifications.length > 0 ? (
            notifications.map(n => (
              <motion.div 
                layout
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                key={n.id} 
                className="flex gap-4 group cursor-pointer"
              >
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 shadow-sm ${
                  n.type === 'success' ? 'bg-emerald-500/10 text-emerald-500' : 
                  n.type === 'visit' ? 'bg-indigo-500/10 text-indigo-500' : 'bg-amber-500/10 text-amber-500'
                }`}>
                  {n.type === 'success' ? <CheckCircle size={20} /> : n.type === 'visit' ? <Calendar size={20} /> : <Info size={20} />}
                </div>
                <div className="flex-grow">
                  <p className="font-black text-sm mb-0.5">{n.title}</p>
                  <p className="text-xs text-gray-500 leading-snug font-medium">{n.desc}</p>
                  <p className="text-[10px] text-gray-400 font-black uppercase mt-2 tracking-widest">{n.time}</p>
                </div>
              </motion.div>
            ))
          ) : (
            <div className="py-12 text-center text-gray-400">
              <Sparkles size={40} className="mx-auto mb-4 opacity-20" />
              <p className="font-black uppercase tracking-widest text-xs">Stay Tuned</p>
              <p className="text-xs mt-1">Updates about your listings will appear here.</p>
            </div>
          )}
        </div>
        
        <button className="w-full mt-10 py-4 bg-gray-900 dark:bg-indigo-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] shadow-lg shadow-indigo-200 dark:shadow-none transition-all active:scale-95">
          Mark All As Read
        </button>
      </div>
    </motion.div>
  );
};

export default NotificationCenter;
