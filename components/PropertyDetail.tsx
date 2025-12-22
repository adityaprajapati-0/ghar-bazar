
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Property, UserProfile, UserRole } from '../types';
import { X, MapPin, Bed, Bath, Square, Heart, Phone, MessageCircle, ShieldCheck, CheckCircle2, Star, Send, ArrowLeft, Ruler, Layout, Sofa, ShieldAlert } from 'lucide-react';

interface Props {
  property: Property;
  onClose: () => void;
  onPaymentRequired?: () => void;
  onChatRequired?: () => void;
  onAddReview?: (rating: number, comment: string) => void;
  user: UserProfile | null;
}

const PropertyDetail: React.FC<Props> = ({ property, onClose, onPaymentRequired, onChatRequired, onAddReview, user }) => {
  const [activeTab, setActiveTab] = useState<'details' | 'reviews'>('details');
  const [newRating, setNewRating] = useState(0);
  const [newComment, setNewComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const formatPrice = (num: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumSignificantDigits: 3,
    }).format(num);
  };

  const amenities = ['High Speed Wi-Fi', '24/7 Security', 'Swimming Pool', 'Gymnasium', 'Modular Kitchen', 'Power Backup'];

  const handleReviewSubmit = () => {
    if (newRating === 0 || !newComment.trim()) return;
    setIsSubmitting(true);
    setTimeout(() => {
      onAddReview?.(newRating, newComment);
      setNewRating(0);
      setNewComment('');
      setIsSubmitting(false);
    }, 800);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="w-full max-w-7xl mx-auto pb-32"
    >
      {/* Navigation & Breadcrumb */}
      <div className="flex items-center justify-between mb-8 px-2">
        <button 
          onClick={onClose}
          className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-indigo-600 hover:translate-x-[-4px] transition-transform"
        >
          <ArrowLeft size={16} /> Back to Hub
        </button>
        <div className="flex gap-4">
          {!property.verified && (
            <div className="px-4 py-2 bg-amber-50 dark:bg-amber-900/20 text-amber-600 rounded-xl flex items-center gap-2 border border-amber-100 dark:border-amber-800">
               <ShieldAlert size={14} />
               <span className="text-[9px] font-black uppercase tracking-widest">Pending Verification</span>
            </div>
          )}
          {property.verified && (
            <div className="px-4 py-2 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 rounded-xl flex items-center gap-2 border border-emerald-100 dark:border-emerald-800">
               <ShieldCheck size={14} />
               <span className="text-[9px] font-black uppercase tracking-widest">Marketplace Verified</span>
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Left: Imagery Column (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          <div className="aspect-[16/10] w-full rounded-[3rem] overflow-hidden shadow-2xl border-8 border-white dark:border-slate-900">
            <img src={property.imageUrl} className="w-full h-full object-cover" alt={property.title} />
          </div>
          <div className="grid grid-cols-3 gap-6">
            {property.images.slice(0, 3).map((img, i) => (
              <div key={i} className="aspect-square rounded-[2rem] overflow-hidden shadow-lg border-4 border-white dark:border-slate-900">
                <img src={img} className="w-full h-full object-cover" />
              </div>
            ))}
            {property.images.length === 0 && Array.from({length: 3}).map((_, i) => (
              <div key={i} className="aspect-square rounded-[2rem] bg-slate-100 dark:bg-slate-900 flex items-center justify-center text-slate-300">
                <Ruler size={32} />
              </div>
            ))}
          </div>
        </div>

        {/* Right: Content Column (5 cols) */}
        <div className="lg:col-span-5 space-y-10">
          <div>
            <h1 className="text-4xl md:text-5xl font-black tracking-tighter dark:text-white leading-[0.9] mb-4 uppercase">
              {property.title}
            </h1>
            <div className="flex items-center text-slate-400 font-bold uppercase text-[10px] tracking-[0.3em]">
              <MapPin size={14} className="mr-2 text-indigo-600" /> {property.location}
            </div>
          </div>

          <div className="p-8 bg-white dark:bg-slate-900 rounded-[3rem] shadow-xl border border-slate-100 dark:border-slate-800">
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Asset Valuation</p>
            <h3 className="text-4xl font-black text-indigo-600 tracking-tighter">{formatPrice(property.price)}</h3>
            
            <div className="grid grid-cols-3 gap-4 mt-8 pt-8 border-t border-slate-50 dark:border-slate-800">
               <div className="text-center">
                 <Bed className="mx-auto mb-2 text-indigo-500" size={24} />
                 <p className="text-xl font-black dark:text-white leading-none">{property.beds || 'N/A'}</p>
                 <p className="text-[8px] font-black uppercase text-slate-400 tracking-widest mt-1">BHK</p>
               </div>
               <div className="text-center border-x border-slate-100 dark:border-slate-800">
                 <Bath className="mx-auto mb-2 text-indigo-500" size={24} />
                 <p className="text-xl font-black dark:text-white leading-none">{property.baths || 'N/A'}</p>
                 <p className="text-[8px] font-black uppercase text-slate-400 tracking-widest mt-1">Bath</p>
               </div>
               <div className="text-center">
                 <Square className="mx-auto mb-2 text-indigo-500" size={24} />
                 <p className="text-xl font-black dark:text-white leading-none">{property.sqft}</p>
                 <p className="text-[8px] font-black uppercase text-slate-400 tracking-widest mt-1">SqFt</p>
               </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="flex border-b border-slate-100 dark:border-slate-800">
              <button 
                onClick={() => setActiveTab('details')}
                className={`pb-4 px-2 text-[10px] font-black uppercase tracking-widest border-b-2 transition-all ${activeTab === 'details' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-slate-400'}`}
              >
                Specifications
              </button>
              <button 
                onClick={() => setActiveTab('reviews')}
                className={`pb-4 px-8 text-[10px] font-black uppercase tracking-widest border-b-2 transition-all flex items-center gap-2 ${activeTab === 'reviews' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-slate-400'}`}
              >
                Reviews ({property.reviews.length})
              </button>
            </div>

            <AnimatePresence mode="wait">
              {activeTab === 'details' ? (
                <motion.div key="details" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
                  <div className="grid grid-cols-2 gap-4">
                    {amenities.map(item => (
                      <div key={item} className="flex items-center gap-3 p-4 bg-slate-50 dark:bg-slate-900/50 rounded-2xl border border-slate-100/50 dark:border-slate-800/50">
                        <CheckCircle2 size={16} className="text-emerald-500" />
                        <span className="text-[10px] font-bold uppercase text-slate-600 dark:text-slate-400">{item}</span>
                      </div>
                    ))}
                  </div>
                  <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed font-medium px-2">
                    This premium {property.type} offers unparalleled luxury in the heart of {property.location}. 
                    Architecturally significant and expertly finished, the asset represents a prime opportunity for both lifestyle and investment.
                  </p>
                </motion.div>
              ) : (
                <motion.div key="reviews" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                  {user && (
                    <div className="p-6 bg-indigo-50 dark:bg-indigo-950/20 rounded-3xl border border-indigo-100 dark:border-indigo-900/30">
                       <h4 className="text-[10px] font-black uppercase tracking-widest text-indigo-600 mb-4">Submit Feedback</h4>
                       <textarea 
                         value={newComment}
                         onChange={(e) => setNewComment(e.target.value)}
                         placeholder="Describe your site visit experience..."
                         className="w-full h-24 p-4 bg-white dark:bg-slate-900 rounded-xl text-sm border-none focus:ring-2 focus:ring-indigo-500/20 outline-none mb-4"
                       />
                       <div className="flex justify-between items-center">
                          <div className="flex gap-1">
                             {[1,2,3,4,5].map(n => (
                               <button key={n} onClick={() => setNewRating(n)} className={newRating >= n ? 'text-amber-500' : 'text-slate-300'}>
                                 <Star size={18} fill={newRating >= n ? "currentColor" : "none"} />
                               </button>
                             ))}
                          </div>
                          <button onClick={handleReviewSubmit} className="p-3 bg-indigo-600 text-white rounded-xl shadow-lg">
                             <Send size={16} />
                          </button>
                       </div>
                    </div>
                  )}
                  {property.reviews.length > 0 ? property.reviews.map(rev => (
                    <div key={rev.id} className="p-6 bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm">
                       <div className="flex justify-between items-center mb-2">
                         <h5 className="font-black text-sm dark:text-white uppercase tracking-tight">{rev.authorName}</h5>
                         <span className="text-[9px] text-slate-400 font-bold">{rev.date}</span>
                       </div>
                       <p className="text-xs text-slate-500 dark:text-slate-400 italic">"{rev.comment}"</p>
                    </div>
                  )) : (
                    <div className="py-12 text-center text-slate-400 text-[10px] font-black uppercase tracking-widest">
                      No public testimonials for this asset
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="flex gap-4 pt-6">
            <button 
              onClick={onPaymentRequired}
              className="flex-grow py-5 bg-indigo-600 text-white rounded-2xl font-black uppercase text-[11px] tracking-widest flex items-center justify-center gap-3 shadow-xl shadow-indigo-600/20 hover:scale-105 active:scale-95 transition-all"
            >
              <Phone size={18} /> Call Listing Agent
            </button>
            <button 
              onClick={onChatRequired}
              className="w-16 h-16 bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 rounded-2xl flex items-center justify-center border border-emerald-100 dark:border-emerald-800 hover:bg-emerald-600 hover:text-white transition-all shadow-sm"
            >
              <MessageCircle size={24} />
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default PropertyDetail;
