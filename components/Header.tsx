
import React from 'react';
import { UserRole, UserProfile } from '../types';
import { User, Bell, Search, MoreVertical, Building2, Home, LayoutDashboard, Map as MapIcon, Bookmark, PlusCircle, ShieldCheck } from 'lucide-react';
import { motion } from 'framer-motion';

interface Props {
  role: UserRole;
  user: UserProfile | null;
  onLogout: () => void;
  onOpenSettings: () => void;
  onOpenNotifications: () => void;
  onSearchClick: () => void;
  onOpenAdmin?: () => void;
  translations: any;
  onTabChange: (id: string) => void;
}

const Header: React.FC<Props> = ({ role, user, onLogout, onOpenSettings, onOpenNotifications, onSearchClick, translations, onTabChange }) => {
  const buyerNav = [
    { id: 'home', icon: Home, label: 'Hub' },
    { id: 'map', icon: MapIcon, label: 'Market Map' },
    { id: 'bookings', icon: Bookmark, label: 'Collection' }
  ];

  const sellerNav = [
    { id: 'home', icon: LayoutDashboard, label: 'Console' },
    { id: 'inventory', icon: Building2, label: 'Inventory' },
    { id: 'add-property', icon: PlusCircle, label: 'New Asset' }
  ];

  const adminNav = [
    { id: 'admin', icon: ShieldCheck, label: 'Governance' },
    { id: 'inventory', icon: Building2, label: 'Audit' }
  ];

  const getNav = () => {
    switch(role) {
      case UserRole.BUYER: return buyerNav;
      case UserRole.SELLER: return sellerNav;
      case UserRole.ADMIN: return adminNav;
      default: return [];
    }
  };

  const navItems = getNav();

  return (
    <header className="fixed top-0 left-0 right-0 bg-white/70 dark:bg-slate-950/70 backdrop-blur-xl z-40 border-b border-slate-200/50 dark:border-slate-800/50 h-16 md:h-18">
      <div className="w-full h-full px-4 md:px-10 flex items-center justify-between">
        <div className="flex items-center gap-10">
          <motion.div 
            whileHover={{ scale: 1.02 }} 
            className="flex items-center gap-2 cursor-pointer group" 
            onClick={() => onTabChange('home')}
          >
            <div className="w-9 h-9 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
              <Building2 size={18} className="text-white" />
            </div>
            <div className="flex flex-col leading-none">
              <span className="font-black text-lg tracking-tighter dark:text-white uppercase">GHAR <span className="text-indigo-600">BAZAR</span></span>
              <span className="text-[7px] font-black uppercase tracking-[0.4em] text-slate-400">Premium Realty</span>
            </div>
          </motion.div>

          <nav className="hidden lg:flex items-center gap-1">
            {navItems.map(item => (
              <button
                key={item.id}
                onClick={() => onTabChange(item.id)}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-[9px] font-black uppercase tracking-[0.2em] text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 transition-all"
              >
                <item.icon size={14} />
                {item.label}
              </button>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-2">
          <div className="hidden sm:flex items-center gap-1">
            <button onClick={onSearchClick} className="p-2.5 text-slate-400 hover:text-indigo-600 transition-colors"><Search size={18} /></button>
            <button onClick={onOpenNotifications} className="p-2.5 text-slate-400 hover:text-indigo-600 relative transition-colors">
              <Bell size={18} />
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white dark:border-slate-950"></span>
            </button>
          </div>
          
          <div className="h-6 w-px bg-slate-200 dark:bg-slate-800 mx-3 hidden md:block"></div>
          
          <div className="flex items-center gap-3 group cursor-pointer" onClick={() => onTabChange('profile')}>
            <div className="hidden md:block text-right leading-none">
              <p className="text-[11px] font-black text-slate-900 dark:text-white group-hover:text-indigo-600 transition-colors uppercase tracking-widest">{user?.name || 'Guest'}</p>
              <button onClick={(e) => { e.stopPropagation(); onLogout(); }} className="text-[8px] text-rose-500 font-bold uppercase tracking-widest hover:underline mt-1">{translations.logout}</button>
            </div>
            <div className="w-9 h-9 rounded-xl bg-slate-100 dark:bg-slate-800 overflow-hidden border-2 border-white dark:border-slate-700 shadow-sm transition-transform group-hover:scale-105">
              {user?.avatar ? <img src={user.avatar} className="w-full h-full object-cover" /> : <User size={18} className="text-slate-400 m-auto mt-2" />}
            </div>
          </div>
          <button onClick={onOpenSettings} className="p-2.5 text-slate-400 hover:text-indigo-600 transition-colors"><MoreVertical size={20} /></button>
        </div>
      </div>
    </header>
  );
};

export default Header;
