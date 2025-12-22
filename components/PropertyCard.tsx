
import React from 'react';
import { motion } from 'framer-motion';
import { Property, UserRole } from '../types';
import { Heart, MapPin, Bed, Bath, Square, ShieldCheck, Share2, Map, ExternalLink } from 'lucide-react';

interface Props {
  property: Property;
  role: UserRole;
  onAction: () => void;
  isLiked: boolean;
  isSaved: boolean;
  onToggleLike: () => void;
  onToggleSave: () => void;
  onViewMap: () => void;
  onReport?: (id: string) => void;
  onViewSellerProfile?: (sellerId: string) => void;
}

const PropertyCard: React.FC<Props> = ({ 
  property, role, onAction, isLiked, onToggleLike, onViewMap
}) => {
  const formatPrice = (num: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumSignificantDigits: 3,
    }).format(num);
  };

  const handleShare = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(window.location.href);
    alert('Link Copied to Clipboard');
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      className="group bg-white dark:bg-slate-950 rounded-[1.5rem] overflow-hidden border border-slate-200/60 dark:border-slate-800/60 transition-all duration-300 hover:shadow-2xl hover:shadow-indigo-500/5 flex flex-col md:flex-row h-full min-h-[220px]"
    >
      {/* Media Section: 40% width on Desktop */}
      <div className="relative h-56 md:h-auto md:w-[40%] overflow-hidden shrink-0 cursor-pointer" onClick={onAction}>
        <img 
          src={property.imageUrl} 
          className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" 
          alt={property.title}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-transparent opacity-60" />
        
        <div className="absolute top-3 left-3 flex gap-1.5 z-10">
          {property.verified && (
            <span className="bg-emerald-500/90 backdrop-blur-md text-white text-[7px] font-black px-2 py-1 rounded-lg uppercase tracking-widest flex items-center gap-1 shadow-lg border border-white/10">
              <ShieldCheck size={10} /> Verified
            </span>
          )}
        </div>

        <div className="absolute top-3 right-3 flex flex-col gap-1.5 opacity-0 group-hover:opacity-100 transition-all duration-300 z-10 translate-x-2 group-hover:translate-x-0">
          <button 
            onClick={(e) => { e.stopPropagation(); onToggleLike(); }} 
            className={`w-8 h-8 backdrop-blur-md rounded-lg flex items-center justify-center transition-all ${isLiked ? 'bg-rose-500 text-white' : 'bg-white/30 text-white hover:bg-white/50 border border-white/20'}`}
          >
            <Heart size={14} fill={isLiked ? "currentColor" : "none"} />
          </button>
          <button 
            onClick={handleShare} 
            className="w-8 h-8 backdrop-blur-md rounded-lg flex items-center justify-center bg-white/30 text-white hover:bg-indigo-600 border border-white/20 transition-all"
          >
            <Share2 size={14} />
          </button>
        </div>

        <div className="absolute bottom-3 left-3 text-white">
          <h4 className="text-lg font-black tracking-tighter drop-shadow-md">{formatPrice(property.price)}</h4>
        </div>
      </div>

      {/* Content Section: 60% width on Desktop */}
      <div className="p-4 md:p-5 flex flex-col flex-grow md:w-[60%]">
        <div className="flex justify-between items-start mb-1">
          <h3 className="font-black text-base dark:text-slate-100 line-clamp-1 tracking-tight group-hover:text-indigo-600 transition-colors uppercase">
            {property.title}
          </h3>
        </div>
        
        <div className="flex items-center text-slate-400 text-[9px] font-bold uppercase tracking-widest mb-4">
          <MapPin size={10} className="mr-1 text-indigo-500" /> {property.location}
        </div>

        <div className="grid grid-cols-3 gap-1 py-3 border-y border-slate-100 dark:border-slate-900 mb-4 bg-slate-50/50 dark:bg-slate-900/50 rounded-lg px-2">
          <div className="text-center">
            <p className="text-xs font-black dark:text-white leading-none mb-0.5">{property.beds || '0'}</p>
            <p className="text-[7px] text-slate-400 font-black uppercase tracking-widest">BHK</p>
          </div>
          <div className="text-center border-x border-slate-100 dark:border-slate-900">
            <p className="text-xs font-black dark:text-white leading-none mb-0.5">{property.baths || '0'}</p>
            <p className="text-[7px] text-slate-400 font-black uppercase tracking-widest">Bath</p>
          </div>
          <div className="text-center">
            <p className="text-xs font-black dark:text-white leading-none mb-0.5">{property.sqft}</p>
            <p className="text-[7px] text-slate-400 font-black uppercase tracking-widest">Sq.Ft</p>
          </div>
        </div>

        <div className="mt-auto flex gap-2">
          <button 
            onClick={onAction}
            className="flex-grow py-2.5 bg-slate-950 dark:bg-white text-white dark:text-slate-950 rounded-xl font-black text-[9px] uppercase tracking-[0.15em] hover:bg-indigo-600 dark:hover:bg-indigo-600 dark:hover:text-white transition-all flex items-center justify-center gap-1.5"
          >
            Inspect <ExternalLink size={10} />
          </button>
          <button 
            onClick={(e) => { e.stopPropagation(); onViewMap(); }}
            className="w-10 h-10 flex items-center justify-center border border-slate-200 dark:border-slate-800 rounded-xl text-slate-400 hover:text-indigo-600 hover:border-indigo-600 transition-all shrink-0"
          >
            <Map size={14} />
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default PropertyCard;
