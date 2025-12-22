
import React, { useState } from 'react';
import { UserRole, Property } from '../types';
import PropertyCard from './PropertyCard';
import { SlidersHorizontal, Search as SearchIcon, X, IndianRupee, Tag, Compass, Filter, ChevronDown, ChevronUp } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Props {
  role: UserRole;
  properties: Property[];
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  onAuthRequired: () => void;
  onPropertyClick: (p: Property) => void;
  likedProperties: string[];
  savedProperties: string[];
  onToggleLike: (id: string) => void;
  onToggleSave: (id: string) => void;
  onViewMap: () => void;
  onReport: (id: string) => void;
  filters: any;
  setFilters: (f: any) => void;
  onViewSellerProfile?: (sellerId: string) => void;
  // Added translations prop to fix Type Error in App.tsx
  translations: any;
}

const PropertyFeed: React.FC<Props> = ({ 
  role, properties, searchQuery, setSearchQuery, onAuthRequired, onPropertyClick, 
  likedProperties, savedProperties, onToggleLike, onToggleSave, onViewMap, onReport,
  filters, setFilters, onViewSellerProfile, translations
}) => {
  const [showAdvanced, setShowAdvanced] = useState(false);
  const types = ['All', 'Apartment', 'Villa', 'Plot', 'Land', 'Warehouse'];

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>, key: string) => {
    setFilters({ ...filters, [key]: parseInt(e.target.value) || 0 });
  };

  return (
    <div className="py-12">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-10">
        <div className="max-w-xl">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-full text-[10px] font-black uppercase tracking-[0.2em] mb-4">
            <Compass size={14} /> {translations.marketplace}
          </div>
          <h2 className="text-6xl font-black tracking-tighter dark:text-white leading-[0.9]">{translations.explore}.</h2>
          <p className="text-slate-500 dark:text-slate-400 font-bold uppercase text-[10px] tracking-[0.4em] mt-4">Verified Listings • 0.5% Commission • Direct Owner</p>
        </div>
        
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowAdvanced(!showAdvanced)}
            className={`flex items-center gap-3 px-8 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all border-2 ${
              showAdvanced ? 'bg-slate-900 border-slate-900 text-white dark:bg-white dark:text-slate-900' : 'bg-white text-slate-900 border-slate-100 dark:bg-slate-900 dark:border-slate-800 dark:text-white'
            }`}
          >
            <Filter size={16} /> 
            {showAdvanced ? 'Hide Filters' : 'Advanced Filters'}
            {showAdvanced ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {showAdvanced && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden mb-12"
          >
            <div className="p-8 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-[2.5rem] shadow-xl">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
                {/* Property Type */}
                <div>
                  <label className="block text-[10px] font-black uppercase text-slate-400 tracking-widest mb-4">Property Category</label>
                  <div className="flex flex-wrap gap-2">
                    {types.map(t => (
                      <button
                        key={t}
                        onClick={() => setFilters({ ...filters, type: t })}
                        className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                          filters.type === t ? 'bg-indigo-600 text-white' : 'bg-slate-50 text-slate-500 dark:bg-slate-800'
                        }`}
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Price Range */}
                <div className="md:col-span-2">
                  <label className="block text-[10px] font-black uppercase text-slate-400 tracking-widest mb-4">Price Range (₹)</label>
                  <div className="flex items-center gap-4">
                    <input 
                      type="number" 
                      placeholder="Min" 
                      value={filters.minPrice}
                      onChange={(e) => handlePriceChange(e, 'minPrice')}
                      className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border-none rounded-xl text-sm font-bold dark:text-white"
                    />
                    <span className="text-slate-300">to</span>
                    <input 
                      type="number" 
                      placeholder="Max" 
                      value={filters.maxPrice}
                      onChange={(e) => handlePriceChange(e, 'maxPrice')}
                      className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border-none rounded-xl text-sm font-bold dark:text-white"
                    />
                  </div>
                </div>

                {/* BHK Config */}
                <div>
                  <label className="block text-[10px] font-black uppercase text-slate-400 tracking-widest mb-4">Configuration</label>
                  <select 
                    value={filters.beds}
                    onChange={(e) => setFilters({...filters, beds: e.target.value})}
                    className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border-none rounded-xl text-sm font-bold dark:text-white appearance-none cursor-pointer"
                  >
                    <option value="Any">Any BHK</option>
                    <option value="1">1 BHK</option>
                    <option value="2">2 BHK</option>
                    <option value="3">3 BHK</option>
                    <option value="4">4 BHK</option>
                    <option value="5">5+ BHK</option>
                  </select>
                </div>
              </div>

              <div className="mt-8 pt-8 border-t border-slate-50 dark:border-slate-800 flex justify-end gap-4">
                <button 
                  onClick={() => setFilters({ type: 'All', minPrice: 0, maxPrice: 200000000, beds: 'Any', furnishing: 'Any' })}
                  className="text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-rose-500 transition-colors"
                >
                  Reset All
                </button>
                <button 
                  onClick={() => setShowAdvanced(false)}
                  className="bg-indigo-600 text-white px-8 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-indigo-100 dark:shadow-none hover:scale-105 transition-all"
                >
                  Apply Filters
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
        {properties.length > 0 ? (
          properties.map(property => (
            <PropertyCard 
              key={property.id} 
              property={property} 
              role={role}
              onAction={() => onPropertyClick(property)}
              isLiked={likedProperties.includes(property.id)}
              isSaved={savedProperties.includes(property.id)}
              onToggleLike={() => onToggleLike(property.id)}
              onToggleSave={() => onToggleSave(property.id)}
              onViewMap={onViewMap}
              onReport={onReport}
              onViewSellerProfile={onViewSellerProfile}
            />
          ))
        ) : (
          <div className="col-span-full py-40 text-center">
            <h3 className="text-3xl font-black text-slate-900 dark:text-slate-100">Market Silence.</h3>
            <p className="text-slate-400 mt-2 font-bold uppercase tracking-widest text-[10px]">No listings currently match your criteria</p>
            <button 
              onClick={() => setFilters({ type: 'All', minPrice: 0, maxPrice: 200000000, beds: 'Any', furnishing: 'Any' })}
              className="mt-8 px-8 py-4 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-2xl font-black text-[10px] uppercase tracking-widest"
            >
              Clear All Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default PropertyFeed;
