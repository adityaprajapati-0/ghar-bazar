
import React from 'react';
import { Property, UserRole } from '../types';
import { Building, Plus, TrendingUp, Users, Eye, ArrowUpRight, BarChart3, ShieldCheck, ChevronUp, Settings2 } from 'lucide-react';
import { motion } from 'framer-motion';

interface Props {
  user: any;
  properties: Property[];
  onAddProperty: () => void;
  onPropertyClick: (p: Property) => void;
  translations: any;
}

const DashboardSeller: React.FC<Props> = ({ user, properties, onAddProperty, onPropertyClick, translations }) => {
  const stats = [
    { label: 'Portfolio Assets', value: properties.length, icon: Building, color: 'text-indigo-600', bg: 'bg-indigo-50 dark:bg-indigo-900/20' },
    { label: 'Market Reach', value: '4.2k', icon: Eye, color: 'text-emerald-600', bg: 'bg-emerald-50 dark:bg-emerald-900/20' },
    { label: 'Lead Velocity', value: '28', icon: Users, color: 'text-amber-600', bg: 'bg-amber-50 dark:bg-amber-900/20' },
    { label: 'Compliance', value: '98%', icon: ShieldCheck, color: 'text-indigo-600', bg: 'bg-indigo-50 dark:bg-indigo-900/20' },
  ];

  return (
    <div className="py-6 space-y-12 w-full max-w-full">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 px-2">
        <div>
          <h2 className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tighter dark:text-white leading-[0.85] mb-6">
            {translations.sellerDash}.
          </h2>
          <p className="text-slate-400 font-bold uppercase text-[9px] tracking-[0.5em] ml-1">Asset Management & Portfolio Analysis</p>
        </div>
        <button onClick={onAddProperty} className="px-10 py-4 bg-indigo-600 text-white rounded-2xl font-black uppercase text-[10px] tracking-widest flex items-center gap-3 shadow-xl shadow-indigo-600/20 hover:bg-indigo-700 active:scale-95 transition-all">
          <Plus size={18} /> {translations.listNew}
        </button>
      </div>

      {/* Modern Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s, i) => (
          <div key={i} className="bg-white dark:bg-slate-900 p-8 rounded-[2rem] border border-slate-100 dark:border-slate-800 shadow-sm hover:border-indigo-300 dark:hover:border-indigo-900 transition-all group">
            <div className={`w-12 h-12 ${s.bg} ${s.color} rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
              <s.icon size={24} />
            </div>
            <p className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-1">{s.label}</p>
            <h4 className="text-3xl md:text-4xl font-black dark:text-white tracking-tighter">{s.value}</h4>
          </div>
        ))}
      </div>

      <div className="space-y-12 w-full">
        {/* Active Inventory Grid */}
        <div className="space-y-8">
           <div className="flex items-center gap-4 px-2">
              <div className="w-10 h-10 bg-slate-100 dark:bg-slate-800 rounded-xl flex items-center justify-center">
                 <Building size={20} className="text-slate-400" />
              </div>
              <div>
                 <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 mb-0.5">{translations.inventory}</h3>
                 <p className="text-base font-bold dark:text-white tracking-tight">Direct Asset Console</p>
              </div>
           </div>
           
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 w-full">
             {properties.length > 0 ? properties.map(p => (
               <div key={p.id} onClick={() => onPropertyClick(p)} className="bg-white dark:bg-slate-950 p-6 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 flex flex-col cursor-pointer group hover:border-indigo-500/50 transition-all shadow-sm w-full">
                  <div className="relative w-full h-56 mb-6 overflow-hidden rounded-[1.5rem] shadow-md">
                    <img src={p.imageUrl} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                    <div className="absolute top-3 left-3 flex flex-col gap-2">
                      <span className={`text-[8px] font-black uppercase tracking-widest px-3 py-1.5 rounded-lg shadow-lg ${p.verified ? 'bg-emerald-500 text-white' : 'bg-amber-500 text-white'}`}>
                        {p.verified ? 'Marketplace Ready' : 'Pending Review'}
                      </span>
                      {p.originalPrice && p.originalPrice > p.price && (
                        <span className="bg-amber-500 text-white text-[8px] font-black uppercase tracking-widest px-3 py-1.5 rounded-lg shadow-lg">
                          Discount Active
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex-grow">
                    <h5 className="font-black text-2xl dark:text-white group-hover:text-indigo-600 transition-colors tracking-tighter truncate">{p.title}</h5>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">{p.location}</p>
                  </div>
                  <div className="mt-8 flex justify-between items-center pt-6 border-t border-slate-100 dark:border-slate-900">
                     <div>
                       <p className="text-[8px] font-black uppercase tracking-widest text-slate-400 mb-0.5">Asset Valuation</p>
                       <p className="text-xl font-black text-indigo-600 tracking-tighter">₹{p.price.toLocaleString()}</p>
                     </div>
                     <div className="w-12 h-12 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-300 group-hover:bg-indigo-600 group-hover:text-white transition-all">
                        {p.verified ? <Settings2 size={24} /> : <ArrowUpRight size={24} />}
                     </div>
                  </div>
               </div>
             )) : (
               <div className="col-span-full py-24 text-center border-2 border-dashed border-slate-100 dark:border-slate-800 rounded-[3rem] bg-slate-50 dark:bg-slate-900/50">
                  <Building size={40} className="mx-auto text-slate-200 mb-6" />
                  <p className="text-slate-400 font-black uppercase tracking-widest text-[9px]">Portfolio Under Construction</p>
               </div>
             )}
           </div>
        </div>
        {/* ... action banner ... */}
        <div className="w-full">
           <div className="bg-indigo-600 rounded-[3rem] p-12 md:p-16 text-white shadow-2xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-white/5 rounded-full -mr-20 -mt-20 blur-3xl group-hover:scale-125 transition-transform duration-1000" />
              <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-10">
                <div className="max-w-2xl text-center lg:text-left">
                  <TrendingUp size={48} className="mb-6 opacity-30" />
                  <h4 className="text-4xl md:text-5xl font-black mb-4 leading-none tracking-tighter">Optimize Your Liquidity</h4>
                  <p className="text-indigo-100 text-base font-medium opacity-80">
                    High-end listings in your region are currently fetching 12% premium. Use the Manage Console to apply strategic discounts and refresh your media.
                  </p>
                </div>
                <button className="flex items-center gap-3 text-[11px] font-black uppercase tracking-widest px-10 py-5 bg-white text-indigo-600 rounded-2xl hover:scale-105 active:scale-95 transition-all shadow-xl">
                  Run Portfolio Health <BarChart3 size={18} />
                </button>
              </div>
           </div>
        </div>
      </div>
      <button 
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        className="fixed bottom-24 right-6 z-[60] w-12 h-12 bg-indigo-600 text-white rounded-2xl flex items-center justify-center shadow-xl shadow-indigo-600/30 hover:scale-110 active:scale-95 transition-all md:bottom-8"
      >
        <ChevronUp size={24} strokeWidth={3} />
      </button>
    </div>
  );
};

export default DashboardSeller;
