
import React from 'react';
import { motion } from 'framer-motion';
import { Property, UserRole } from '../types';
import { Heart, MapPin, Bed, Bath, Square, ShieldCheck, Share2, Map, ExternalLink, AlertTriangle, Bookmark, User } from 'lucide-react';

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
  property, role, onAction, isLiked, isSaved, onToggleLike, onToggleSave, onViewMap, onReport, onViewSellerProfile
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

  const handleReportClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onReport) {
      onReport(property.id);
    }
  };

  const handleOwnerClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onViewSellerProfile) {
      onViewSellerProfile(property.ownerId);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -3 }}
      className="group bg-white dark:bg-slate-950 rounded-2xl overflow-hidden border border-slate-200/60 dark:border-slate-800/60 transition-all duration-300 hover:shadow-xl hover:shadow-indigo-500/5 flex flex-col md:flex-row h-full md:min-h-[180px]"
    >
      {/* Media Section: 40% width on Desktop */}
      <div className="relative h-48 md:h-auto md:w-2/5 overflow-hidden shrink-0 cursor-pointer" onClick={onAction}>
        <img 
          src={property.imageUrl} 
          className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" 
          alt={property.title}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent opacity-60" />
        
        <div className="absolute top-2 left-2 flex gap-1 z-10">
          {property.verified && (
            <span className="bg-emerald-500/90 backdrop-blur-md text-white text-[7px] font-black px-2 py-1 rounded-md uppercase tracking-widest flex items-center gap-1 shadow-lg border border-white/10">
              <ShieldCheck size={10} /> Verified
            </span>
          )}
        </div>

        <div className="absolute top-2 right-2 flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-all duration-300 z-10 translate-x-1 group-hover:translate-x-0">
          <button 
            onClick={(e) => { e.stopPropagation(); onToggleLike(); }} 
            className={`w-7 h-7 backdrop-blur-md rounded-lg flex items-center justify-center transition-all ${isLiked ? 'bg-rose-500 text-white shadow-lg' : 'bg-white/30 text-white hover:bg-white/50 border border-white/20'}`}
          >
            <Heart size={12} fill={isLiked ? "currentColor" : "none"} />
          </button>
          <button 
            onClick={(e) => { e.stopPropagation(); onToggleSave(); }} 
            className={`w-7 h-7 backdrop-blur-md rounded-lg flex items-center justify-center transition-all ${isSaved ? 'bg-indigo-600 text-white shadow-lg' : 'bg-white/30 text-white hover:bg-white/50 border border-white/20'}`}
          >
            <Bookmark size={12} fill={isSaved ? "currentColor" : "none"} />
          </button>
          <button 
            onClick={handleShare} 
            className="w-7 h-7 backdrop-blur-md rounded-lg flex items-center justify-center bg-white/30 text-white hover:bg-indigo-600 border border-white/20 transition-all"
          >
            <Share2 size={12} />
          </button>
          <button 
            onClick={handleReportClick} 
            className="w-7 h-7 backdrop-blur-md rounded-lg flex items-center justify-center bg-white/30 text-white hover:bg-rose-600 border border-white/20 transition-all"
            title="Report Listing"
          >
            <AlertTriangle size={12} />
          </button>
        </div>

        <div className="absolute bottom-2 left-2 text-white">
          <h4 className="text-base font-black tracking-tight drop-shadow-lg">{formatPrice(property.price)}</h4>
        </div>
      </div>

      {/* Content Section: 60% width on Desktop */}
      <div className="p-3 md:p-4 flex flex-col flex-grow md:w-3/5">
        <div className="flex justify-between items-start mb-0.5">
          <h3 className="font-black text-sm dark:text-slate-100 line-clamp-1 tracking-tight group-hover:text-indigo-600 transition-colors uppercase">
            {property.title}
          </h3>
        </div>
        
        <div className="flex items-center text-slate-400 text-[8px] font-bold uppercase tracking-widest mb-1 truncate">
          <MapPin size={9} className="mr-1 text-indigo-500 shrink-0" /> {property.location}
        </div>

        {/* Seller Info (Only for Buyers) */}
        {role === UserRole.BUYER && (
          <div 
            onClick={handleOwnerClick}
            className="flex items-center gap-1.5 mt-0.5 mb-3 cursor-pointer group/owner"
          >
            <div className="w-5 h-5 rounded-full bg-slate-50 dark:bg-slate-900 flex items-center justify-center text-slate-400 border border-slate-100 dark:border-slate-800 group-hover/owner:bg-indigo-600 group-hover/owner:text-white transition-colors">
              <User size={10} />
            </div>
            <span className="text-[7px] font-black uppercase tracking-widest text-slate-400 group-hover/owner:text-indigo-600 transition-colors">
              Owner: {property.ownerName || 'Verified Agent'}
            </span>
          </div>
        )}

        <div className="grid grid-cols-3 gap-0.5 py-2 border-y border-slate-100 dark:border-slate-900 mb-3 bg-slate-50/50 dark:bg-slate-900/50 rounded-lg">
          <div className="text-center">
            <p className="text-[10px] font-black dark:text-white leading-none mb-0.5">{property.beds || '0'}</p>
            <p className="text-[6px] text-slate-400 font-black uppercase tracking-widest">BHK</p>
          </div>
          <div className="text-center border-x border-slate-100 dark:border-slate-900">
            <p className="text-[10px] font-black dark:text-white leading-none mb-0.5">{property.baths || '0'}</p>
            <p className="text-[6px] text-slate-400 font-black uppercase tracking-widest">Bath</p>
          </div>
          <div className="text-center">
            <p className="text-[10px] font-black dark:text-white leading-none mb-0.5">{property.sqft}</p>
            <p className="text-[6px] text-slate-400 font-black uppercase tracking-widest">Sq.Ft</p>
          </div>
        </div>

        <div className="mt-auto flex gap-2">
          <button 
            onClick={onAction}
            className="flex-grow py-2 bg-slate-950 dark:bg-white text-white dark:text-slate-950 rounded-lg font-black text-[8px] uppercase tracking-[0.15em] hover:bg-indigo-600 dark:hover:bg-indigo-600 dark:hover:text-white transition-all flex items-center justify-center gap-1 shadow-sm"
          >
            Inspect <ExternalLink size={10} />
          </button>
          <button 
            onClick={(e) => { e.stopPropagation(); onViewMap(); }}
            className="w-8 h-8 flex items-center justify-center border border-slate-200 dark:border-slate-800 rounded-lg text-slate-400 hover:text-indigo-600 hover:border-indigo-600 transition-all shrink-0 bg-white dark:bg-slate-900"
          >
            <Map size={12} />
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default PropertyCard;
