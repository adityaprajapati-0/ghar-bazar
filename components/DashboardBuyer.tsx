
import React, { useState } from 'react';
import { Property, UserRole } from '../types';
import PropertyCard from './PropertyCard';
import { Filter, Map, Sparkles, TrendingUp, Search, ChevronDown, ChevronUp } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Props {
  user: any;
  properties: Property[];
  onPropertyClick: (p: Property) => void;
  likedProperties: string[];
  onToggleLike: (id: string) => void;
  savedProperties: string[];
  onToggleSave: (id: string) => void;
  onViewMap: () => void;
  onViewSeller: (sid: string) => void;
  onReport: (id: string) => void;
  filters: any;
  setFilters: (f: any) => void;
  translations: any;
  searchQuery: string;
  onSearchChange: (val: string) => void;
}

const DashboardBuyer: React.FC<Props> = ({ 
  // Fixed: Destructured onViewSeller from props to resolve reference errors
  user, properties, onPropertyClick, likedProperties, onToggleLike, savedProperties, onToggleSave, onViewMap, onViewSeller, onReport, filters, setFilters, translations, searchQuery, onSearchChange 
}) => {
  const [showAdvanced, setShowAdvanced] = useState(false);

  const featured = properties.filter(p => p.featured);
  const others = properties.filter(p => !p.featured);

  const types = ['All', 'Apartment', 'Villa', 'Plot', 'Land', 'Warehouse'];

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  return (
    <div className="py-6 space-y-12 w-full max-w-full">
      {/* Hero / Search Section */}
      <div className="w-full space-y-8">
        <div>
          <motion.h2 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tighter dark:text-white leading-[0.85]"
          >
            {translations.welcome},<br /> <span className="text-indigo-600">{user?.name?.split(' ')[0] || 'Guest'}</span>.
          </motion.h2>
          <p className="text-slate-400 font-bold uppercase text-[9px] tracking-[0.4em] mt-6 ml-1">Elite Indian Realty Discovery Engine</p>
        </div>

        {/* Search Bar */}
        <div className="flex flex-col md:flex-row gap-3 w-full">
          <div className="relative flex-grow">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder={translations.search}
              className="w-full pl-14 pr-6 py-4 bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl border border-slate-200/50 dark:border-slate-800/50 rounded-2xl shadow-sm text-base font-bold focus:ring-2 focus:ring-indigo-500/10 transition-all dark:text-white outline-none"
            />
          </div>
          <div className="flex gap-2">
            <button className="flex-grow md:flex-none px-8 py-3 bg-indigo-600 text-white rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-lg shadow-indigo-600/20 hover:bg-indigo-700 active:scale-95 transition-all">
              {translations.search_btn}
            </button>
            <button 
              onClick={() => setShowAdvanced(!showAdvanced)}
              className={`px-6 py-3 rounded-2xl font-black uppercase text-[10px] tracking-widest flex items-center gap-2 transition-all border ${showAdvanced ? 'bg-slate-900 border-slate-900 text-white dark:bg-white dark:text-slate-900' : 'bg-white text-slate-900 border-slate-200 dark:bg-slate-900 dark:border-slate-800 dark:text-white shadow-sm'}`}
            >
              <Filter size={16} />
              {showAdvanced ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
            </button>
          </div>
        </div>

        <AnimatePresence>
          {showAdvanced && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="w-full"
            >
              <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-2xl p-8 rounded-[2rem] shadow-2xl border border-slate-200/40 dark:border-slate-800/40 grid grid-cols-1 md:grid-cols-3 gap-8">
                <div>
                  <p className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-3">Property Category</p>
                  <div className="flex flex-wrap gap-2">
                    {types.map(t => (
                      <button 
                        key={t}
                        onClick={() => setFilters({...filters, type: t})}
                        className={`px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all ${filters.type === t ? 'bg-indigo-600 text-white shadow-md' : 'bg-slate-100 dark:bg-slate-800 text-slate-500 hover:bg-slate-200'}`}
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-3">Investment Cap (₹)</p>
                  <input 
                    type="range" 
                    min="0" 
                    max="500000000" 
                    step="5000000"
                    value={filters.maxPrice}
                    onChange={(e) => setFilters({...filters, maxPrice: parseInt(e.target.value)})}
                    className="w-full h-1.5 bg-indigo-100 dark:bg-slate-800 rounded-full appearance-none cursor-pointer accent-indigo-600 mb-3"
                  />
                  <p className="text-lg font-black text-indigo-600">Up to ₹{(filters.maxPrice / 10000000).toFixed(1)} Cr</p>
                </div>
                <div>
                  <p className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-3">Configuration</p>
                  <div className="flex gap-2">
                    {['Any', '1', '2', '3', '4+'].map(b => (
                      <button 
                        key={b}
                        onClick={() => setFilters({...filters, beds: b})}
                        className={`w-11 h-11 rounded-xl text-[10px] font-black uppercase transition-all flex items-center justify-center border ${filters.beds === b ? 'bg-indigo-600 border-indigo-600 text-white' : 'bg-slate-100 dark:bg-slate-800 border-transparent text-slate-500'}`}
                      >
                        {b}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Featured Section */}
      {featured.length > 0 && (
        <section className="space-y-8 w-full">
          <div className="flex items-center justify-between px-2">
            <div className="flex items-center gap-4">
               <div className="w-12 h-12 bg-amber-50 dark:bg-amber-900/20 text-amber-600 rounded-2xl flex items-center justify-center border border-amber-100 dark:border-amber-800 shadow-sm">
                  <Sparkles size={24} />
               </div>
               <div>
                 <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 mb-0.5">Premier Estates</h3>
                 <p className="text-base font-bold text-slate-900 dark:text-white tracking-tight">Verified Premium Inventory</p>
               </div>
            </div>
            <button onClick={onViewMap} className="p-3 bg-indigo-50 text-indigo-600 rounded-xl hover:bg-indigo-600 hover:text-white transition-all shadow-md">
              <Map size={20} />
            </button>
          </div>
          
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full"
          >
            {featured.map(p => (
              <PropertyCard 
                key={p.id}
                property={p} 
                role={UserRole.BUYER} 
                onAction={() => onPropertyClick(p)} 
                isLiked={likedProperties.includes(p.id)} 
                isSaved={savedProperties.includes(p.id)} 
                onToggleLike={() => onToggleLike(p.id)} 
                onToggleSave={() => onToggleSave(p.id)} 
                onViewMap={onViewMap} 
                onReport={onReport}
                onViewSellerProfile={onViewSeller}
              />
            ))}
          </motion.div>
        </section>
      )}

      {/* Market Feed Section */}
      <section className="space-y-8 w-full">
        <div className="px-2">
          <div className="flex items-center gap-4">
             <div className="w-12 h-12 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 rounded-2xl flex items-center justify-center border border-indigo-100 dark:border-indigo-800 shadow-sm">
                <TrendingUp size={24} />
             </div>
             <div>
               <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 mb-0.5">Live Marketplace</h3>
               <p className="text-base font-bold text-slate-900 dark:text-white tracking-tight">Active Opportunity Tracker</p>
             </div>
          </div>
        </div>

        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full"
        >
          {others.length > 0 ? others.map(p => (
            <PropertyCard 
              key={p.id}
              property={p} 
              role={UserRole.BUYER} 
              onAction={() => onPropertyClick(p)} 
              isLiked={likedProperties.includes(p.id)} 
              isSaved={savedProperties.includes(p.id)} 
              onToggleLike={() => onToggleLike(p.id)} 
              onToggleSave={() => onToggleSave(p.id)} 
              onViewMap={onViewMap} 
              onReport={onReport}
              onViewSellerProfile={onViewSeller}
            />
          )) : (
            <div className="col-span-full py-20 text-center bg-white dark:bg-slate-900/50 rounded-[2rem] border-2 border-dashed border-slate-100 dark:border-slate-800">
              <p className="text-slate-400 font-black uppercase tracking-widest text-[9px]">Awaiting new listings in this criteria</p>
            </div>
          )}
        </motion.div>
      </section>

      <button 
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        className="fixed bottom-24 right-6 z-[60] w-12 h-12 bg-slate-950 dark:bg-white text-white dark:text-slate-950 rounded-2xl flex items-center justify-center shadow-2xl hover:scale-110 active:scale-90 transition-all md:bottom-10"
      >
        <ChevronUp size={24} />
      </button>
    </div>
  );
};

export default DashboardBuyer;
