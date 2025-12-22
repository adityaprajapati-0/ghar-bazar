
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { UserProfile, UserRole } from '../types';
import { ShieldCheck, MapPin, Phone, Edit3, Grid, Heart, Star, Bookmark, Camera, Settings, LogOut, Check, ArrowLeft } from 'lucide-react';

interface Props {
  user: UserProfile | null;
  onEdit: (user: UserProfile) => void;
  currentTab?: string;
  isPublicView?: boolean;
  onBack?: () => void;
  onLogout?: () => void;
}

const ProfilePage: React.FC<Props> = ({ user, onEdit, currentTab = 'listings', isPublicView = false, onBack, onLogout }) => {
  const [tab, setTab] = useState(currentTab);
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(user?.name || '');
  const [editPhone, setEditPhone] = useState(user?.phone || '');

  useEffect(() => {
    if (user) {
      setEditName(user.name);
      setEditPhone(user.phone);
      if (isPublicView) setIsEditing(false);
    }
  }, [user, isPublicView]);

  if (!user) return (
    <div className="py-40 text-center flex flex-col items-center">
      <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center text-gray-300 mb-6">
        <Bookmark size={40} />
      </div>
      <p className="text-gray-500 font-black uppercase tracking-[0.2em] text-sm">Auth Required</p>
      <p className="text-gray-400 mt-2">Please sign in to view your profile collection.</p>
    </div>
  );

  const handleSave = () => {
    onEdit({ ...user, name: editName, phone: editPhone });
    setIsEditing(false);
  };

  const tabs = [
    { id: 'listings', label: 'Estates', icon: Grid, show: user.role === UserRole.SELLER },
    { id: 'saved', label: 'Shortlist', icon: Bookmark, show: !isPublicView },
    { id: 'liked', label: 'Likes', icon: Heart, show: !isPublicView },
    { id: 'reviews', label: 'Feedback', icon: Star, show: true },
  ];

  return (
    <div className="max-w-6xl mx-auto py-12 px-4">
      {isPublicView && onBack && (
        <button 
          onClick={onBack}
          className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-indigo-600 mb-6 hover:translate-x-[-4px] transition-transform"
        >
          <ArrowLeft size={16} /> Back to Listings
        </button>
      )}

      <div className="bg-white dark:bg-gray-900 rounded-[4rem] shadow-2xl overflow-hidden border border-gray-100 dark:border-gray-800">
        <div className="h-48 bg-gradient-to-r from-indigo-600 via-violet-600 to-indigo-800 relative">
          <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '24px 24px' }}></div>
        </div>
        
        <div className="px-10 pb-10">
          <div className="relative -mt-24 mb-8 flex flex-col md:flex-row items-end gap-10">
            <div className="relative group">
              <div className="w-48 h-48 rounded-[3.5rem] border-[10px] border-white dark:border-gray-900 overflow-hidden shadow-2xl transition-transform duration-500 group-hover:scale-105">
                <img src={user.avatar} className="w-full h-full object-cover" />
              </div>
              {!isPublicView && (
                <button className="absolute bottom-4 right-4 p-4 bg-indigo-600 text-white rounded-[1.5rem] shadow-xl hover:scale-110 transition-all border-4 border-white dark:border-gray-900">
                  <Camera size={20} />
                </button>
              )}
            </div>

            <div className="flex-grow pb-2">
              <AnimatePresence mode="wait">
                {isEditing ? (
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} key="edit">
                    <input 
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      className="text-5xl font-black bg-white dark:bg-gray-800 border-b-4 border-indigo-600 outline-none w-full mb-4 dark:text-white px-2 rounded-t-xl"
                    />
                    <div className="flex items-center gap-2">
                      <span className="text-gray-400 font-black">+91</span>
                      <input 
                        value={editPhone}
                        onChange={(e) => setEditPhone(e.target.value)}
                        className="text-lg font-bold bg-transparent border-b-2 border-gray-200 outline-none w-48 dark:text-white"
                      />
                    </div>
                  </motion.div>
                ) : (
                  <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} key="display">
                    <div className="flex items-center gap-4 mb-2">
                      <h1 className="text-5xl font-black tracking-tighter dark:text-white">{user.name}</h1>
                      {user.isVerified && (
                        <div className="px-4 py-2 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 rounded-2xl flex items-center gap-2">
                          <ShieldCheck size={20} />
                          <span className="text-[10px] font-black uppercase tracking-widest">Verified</span>
                        </div>
                      )}
                    </div>
                    <div className="flex flex-wrap gap-6 text-gray-400 font-black uppercase text-[10px] tracking-widest">
                      <span className="flex items-center gap-2"><MapPin size={14} className="text-indigo-600" /> Mumbai, MH</span>
                      <span className="flex items-center gap-2"><Phone size={14} className="text-indigo-600" /> +91 {user.phone}</span>
                      <span className="flex items-center gap-2"><Star size={14} className="text-amber-500" /> 4.9 Agent Rating</span>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {!isPublicView && (
              <div className="flex flex-col sm:flex-row gap-3">
                <button 
                  onClick={isEditing ? handleSave : () => setIsEditing(true)}
                  className={`px-10 py-5 rounded-[2rem] font-black text-[11px] uppercase tracking-[0.2em] flex items-center justify-center gap-3 shadow-2xl transition-all active:scale-95 ${isEditing ? 'bg-emerald-600 text-white shadow-emerald-200' : 'bg-gray-900 dark:bg-indigo-600 text-white shadow-indigo-100 dark:shadow-none'}`}
                >
                  {isEditing ? <Check size={20} /> : <Edit3 size={18} />}
                  {isEditing ? 'Sync Changes' : 'Edit Profile'}
                </button>
                {!isEditing && onLogout && (
                  <button 
                    onClick={onLogout}
                    className="px-6 py-5 rounded-[2rem] bg-rose-50 dark:bg-rose-950/20 text-rose-600 border border-rose-100 dark:border-rose-900/50 font-black text-[11px] uppercase tracking-[0.2em] flex items-center justify-center gap-3 shadow-xl hover:bg-rose-600 hover:text-white transition-all active:scale-95"
                  >
                    <LogOut size={18} /> Logout
                  </button>
                )}
              </div>
            )}
          </div>

          <div className="mt-20">
            <div className="flex gap-10 border-b border-gray-100 dark:border-gray-800 overflow-x-auto no-scrollbar">
              {tabs.map(t => t.show && (
                <button 
                  key={t.id}
                  onClick={() => setTab(t.id as any)}
                  className={`flex items-center gap-3 text-xs font-black uppercase tracking-[0.2em] pb-8 border-b-4 transition-all relative ${tab === t.id ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-gray-400 hover:text-gray-600'}`}
                >
                  <t.icon size={18} /> {t.label}
                  {!isPublicView && (
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-black ${tab === t.id ? 'bg-indigo-600 text-white' : 'bg-gray-100 dark:bg-gray-800 text-gray-500'}`}>
                      {t.id === 'saved' ? user.savedProperties.length : t.id === 'liked' ? user.likedProperties.length : 0}
                    </span>
                  )}
                </button>
              ))}
            </div>

            <div className="mt-16">
              <AnimatePresence mode="wait">
                <motion.div 
                  key={tab}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="py-24 text-center bg-gray-50/50 dark:bg-gray-800/20 rounded-[4rem] border-4 border-dashed border-gray-100 dark:border-gray-800"
                >
                  <div className="w-24 h-24 bg-white dark:bg-gray-800 rounded-[2.5rem] flex items-center justify-center text-indigo-300 dark:text-indigo-900 mx-auto mb-8 shadow-inner">
                    <Grid size={40} />
                  </div>
                  <h3 className="text-2xl font-black text-gray-900 dark:text-white tracking-tighter">
                    {isPublicView ? `${user.name} has no public ${tab}` : 'Your collection is empty'}
                  </h3>
                  <p className="text-gray-400 mt-2 font-medium">
                    {isPublicView ? 'Check back later for new updates.' : 'Browse listings and save your favorites to see them here.'}
                  </p>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
