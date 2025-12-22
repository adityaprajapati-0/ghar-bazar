
import React from 'react';
import { Home, Map as MapIcon, Heart, User, PlusCircle, LayoutDashboard, Building, Users, Clock, ShieldCheck, Search } from 'lucide-react';
import { motion } from 'framer-motion';
import { UserRole } from '../types';

interface Props {
  activeTab: string;
  onTabChange: (id: string) => void;
  role: UserRole;
}

const MobileNavBar: React.FC<Props> = ({ activeTab, onTabChange, role }) => {
  const buyerTabs = [
    { id: 'home', icon: Home, label: 'Hub' },
    { id: 'map', icon: MapIcon, label: 'Map' },
    { id: 'bookings', icon: Clock, label: 'Orders' },
    { id: 'profile', icon: User, label: 'Profile' }
  ];

  const sellerTabs = [
    { id: 'home', icon: LayoutDashboard, label: 'Console' },
    { id: 'inventory', icon: Building, label: 'Listings' },
    { id: 'add-property', icon: PlusCircle, label: 'New Listing' },
    { id: 'profile', icon: User, label: 'Profile' }
  ];

  const adminTabs = [
    { id: 'admin', icon: ShieldCheck, label: 'Governance' },
    { id: 'inventory', icon: Building, label: 'Market' },
    { id: 'users', icon: Users, label: 'Users' },
    { id: 'profile', icon: User, label: 'Profile' }
  ];

  const getTabs = () => {
    switch(role) {
      case UserRole.BUYER: return buyerTabs;
      case UserRole.SELLER: return sellerTabs;
      case UserRole.ADMIN: return adminTabs;
      default: return [];
    }
  };

  const currentTabs = getTabs();
  const themeColor = role === UserRole.SELLER ? 'text-emerald-600' : role === UserRole.ADMIN ? 'text-slate-900' : 'text-indigo-600';
  const themeBg = role === UserRole.SELLER ? 'bg-emerald-50' : role === UserRole.ADMIN ? 'bg-slate-100' : 'bg-indigo-50';

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-gray-100 px-2 py-3 z-50 flex justify-around items-center shadow-[0_-5px_20px_rgba(0,0,0,0.05)]">
      {currentTabs.map((tab) => {
        const isActive = activeTab === tab.id;
        
        return (
          <motion.button
            key={tab.id}
            whileTap={{ scale: 0.9 }}
            onClick={() => onTabChange(tab.id)}
            className={`flex flex-col items-center justify-center w-16 relative ${isActive ? themeColor : 'text-gray-400'}`}
          >
            <div className={`p-1.5 rounded-xl mb-0.5 transition-colors ${isActive ? themeBg : ''}`}>
              <tab.icon size={22} strokeWidth={isActive ? 2.5 : 2} />
            </div>
            <span className="text-[10px] font-black uppercase tracking-tighter whitespace-nowrap">{tab.label}</span>
            {isActive && (
              <motion.div layoutId="navIndicator" className={`absolute -top-[12px] w-8 h-1 rounded-full shadow-lg ${role === UserRole.SELLER ? 'bg-emerald-600 shadow-emerald-200' : 'bg-indigo-600 shadow-indigo-200'}`} />
            )}
          </motion.button>
        );
      })}
    </div>
  );
};

export default MobileNavBar;
