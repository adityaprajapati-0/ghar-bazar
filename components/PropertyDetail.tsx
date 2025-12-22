
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Property, UserProfile, UserRole } from '../types';
import { 
  X, MapPin, Bed, Bath, Square, Heart, Phone, MessageCircle, 
  ShieldCheck, CheckCircle2, Star, Send, ArrowLeft, Ruler, 
  Layout, Sofa, ShieldAlert, Navigation, Info, Compass, 
  IndianRupee, Home, Map as MapIcon, Share2, Printer, 
  FileText, ArrowRight, Wallet, TrendingUp, ChevronLeft, Tag
} from 'lucide-react';
import Footer from './Footer';

interface Props {
  property: Property;
  onClose: () => void;
  onPaymentRequired?: () => void;
  onChatRequired?: () => void;
  onAddReview?: (rating: number, comment: string) => void;
  user: UserProfile | null;
}

const PropertyDetail: React.FC<Props> = ({ property, onClose, onPaymentRequired, onChatRequired, onAddReview, user }) => {
  const [activeTab, setActiveTab] = useState<'details' | 'neighborhood' | 'reviews'>('details');
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

  const specifications = [
    { label: 'Built Up Area', value: `${property.builtUpArea || property.sqft} sq.ft`, icon: Ruler },
    { label: 'Facing', value: 'East Facing', icon: Compass },
    { label: 'Floor', value: '12th of 24', icon: Home },
    { label: 'Furnishing', value: property.furnishingStatus || 'Unfurnished', icon: Sofa },
    { label: 'Ownership', value: 'Freehold', icon: ShieldCheck },
    { label: 'Age', value: '3 Years', icon: TrendingUp },
  ];

  const neighborhood = [
    { place: 'International Airport', distance: '12.4 km', time: '25 min' },
    { place: 'HDFC Bank & ATM', distance: '0.4 km', time: '5 min' },
    { place: 'Apollo Hospital', distance: '1.2 km', time: '10 min' },
    { place: 'PVR Cinema Hub', distance: '2.5 km', time: '12 min' },
  ];

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

  const hasDiscount = property.originalPrice && property.originalPrice > property.price;

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="w-full bg-slate-50 dark:bg-slate-950 min-h-screen"
    >
      {/* Dynamic Header with Back Button */}
      <div className="sticky top-0 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-b border-slate-100 dark:border-slate-800 py-3 md:py-4 px-4 md:px-10 z-[60]">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button 
              onClick={onClose}
              className="flex items-center gap-2 px-3 py-2 md:px-5 md:py-2.5 bg-slate-950 dark:bg-white text-white dark:text-slate-950 rounded-xl md:rounded-2xl text-[10px] md:text-[11px] font-black uppercase tracking-widest hover:bg-indigo-600 dark:hover:bg-indigo-600 dark:hover:text-white transition-all shadow-lg active:scale-95 group"
            >
              <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
              <span className="hidden sm:inline">Back to Hub</span>
              <span className="sm:hidden">Back</span>
            </button>
            <div className="h-6 w-px bg-slate-200 dark:bg-slate-800 hidden md:block mx-2"></div>
            <div className="hidden lg:block text-[10px] font-black uppercase text-slate-400 tracking-widest truncate max-w-[200px]">
              {property.title}
            </div>
          </div>
          
          <div className="flex gap-2">
            <button className="p-2.5 bg-white dark:bg-slate-800 rounded-xl text-slate-400 hover:text-indigo-600 transition-all border border-slate-100 dark:border-slate-700 shadow-sm">
              <Share2 size={16} />
            </button>
            <button className="p-2.5 bg-white dark:bg-slate-800 rounded-xl text-slate-400 hover:text-indigo-600 transition-all border border-slate-100 dark:border-slate-700 shadow-sm">
              <Heart size={16} />
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto py-6 md:py-10 px-4 md:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-10">
          
          {/* Main Content Column */}
          <div className="lg:col-span-8 space-y-8 md:space-y-12">
            {/* Hero Image Gallery */}
            <div className="space-y-4">
              <div className="aspect-[16/9] w-full rounded-[2rem] md:rounded-[3rem] overflow-hidden shadow-2xl relative group bg-slate-200 dark:bg-slate-800">
                <img src={property.imageUrl} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000" alt={property.title} />
                <div className="absolute top-4 left-4 md:top-6 md:left-6 flex gap-2">
                   {property.verified && (
                     <span className="bg-emerald-500/90 backdrop-blur-md text-white text-[8px] md:text-[9px] font-black px-3 py-1.5 md:px-4 md:py-2 rounded-xl shadow-xl flex items-center gap-2 uppercase tracking-widest border border-white/10">
                       <ShieldCheck size={14} /> Verified
                     </span>
                   )}
                   {hasDiscount && (
                     <span className="bg-amber-500/90 backdrop-blur-md text-white text-[8px] md:text-[9px] font-black px-3 py-1.5 md:px-4 md:py-2 rounded-xl shadow-xl flex items-center gap-2 uppercase tracking-widest border border-white/10">
                       <Tag size={14} /> Flash Discount
                     </span>
                   )}
                </div>
              </div>
              <div className="grid grid-cols-4 gap-2 md:gap-4">
                {property.images.slice(0, 4).map((img, i) => (
                  <div key={i} className="aspect-square rounded-2xl md:rounded-3xl overflow-hidden shadow-md border-2 border-white dark:border-slate-800 cursor-pointer hover:border-indigo-500 transition-all bg-slate-200 dark:bg-slate-800">
                    <img src={img} className="w-full h-full object-cover" />
                  </div>
                ))}
                {property.images.length === 0 && Array.from({length: 4}).map((_, i) => (
                  <div key={i} className="aspect-square rounded-2xl md:rounded-3xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 flex items-center justify-center text-slate-300">
                    <ImageIcon size={24} />
                  </div>
                ))}
              </div>
            </div>

            {/* Core Info Bar */}
            <div className="bg-white dark:bg-slate-900 p-6 md:p-8 rounded-[2rem] md:rounded-[3rem] shadow-xl border border-slate-100 dark:border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 md:gap-8">
               <div className="space-y-1 max-w-full">
                 <h1 className="text-3xl md:text-4xl lg:text-5xl font-black dark:text-white tracking-tighter uppercase leading-none break-words">
                   {property.title}
                 </h1>
                 <div className="flex items-center text-slate-400 font-bold uppercase text-[9px] md:text-[10px] tracking-[0.2em] md:tracking-[0.3em]">
                   <MapPin size={14} className="mr-2 text-indigo-600 shrink-0" /> 
                   <span className="truncate">{property.location}</span>
                 </div>
               </div>
               <div className="flex items-center gap-6 md:gap-10 w-full md:w-auto border-t md:border-t-0 border-slate-50 dark:border-slate-800 pt-6 md:pt-0">
                  <div className="text-left md:text-center">
                    <p className="text-2xl md:text-3xl lg:text-4xl font-black text-indigo-600 tracking-tighter leading-none">
                      {formatPrice(property.price)}
                    </p>
                    {hasDiscount && (
                      <p className="text-[9px] text-rose-500 font-black line-through opacity-60">
                        {formatPrice(property.originalPrice!)}
                      </p>
                    )}
                    <p className="text-[8px] md:text-[9px] font-black uppercase text-slate-400 tracking-widest mt-1.5 md:mt-2">Price Value</p>
                  </div>
                  <div className="h-10 md:h-12 w-px bg-slate-100 dark:bg-slate-800"></div>
                  <div className="text-left md:text-center">
                    <p className="text-xl md:text-2xl font-black dark:text-white tracking-tighter leading-none">
                      ₹{Math.round(property.price / property.sqft).toLocaleString()}
                    </p>
                    <p className="text-[8px] md:text-[9px] font-black uppercase text-slate-400 tracking-widest mt-1.5 md:mt-2">Per Sq.ft</p>
                  </div>
               </div>
            </div>

            {/* Detailed Tabs Section */}
            <div className="bg-white dark:bg-slate-900 rounded-[2rem] md:rounded-[3rem] shadow-xl border border-slate-100 dark:border-slate-800 overflow-hidden">
               <div className="flex bg-slate-50 dark:bg-slate-800/50 p-1 md:p-2 overflow-x-auto no-scrollbar">
                 {[
                   { id: 'details', label: 'Specs', icon: FileText },
                   { id: 'neighborhood', label: 'Neighborhood', icon: MapIcon },
                   { id: 'reviews', label: 'Reviews', icon: Star },
                 ].map(tab => (
                   <button 
                     key={tab.id}
                     onClick={() => setActiveTab(tab.id as any)}
                     className={`flex-grow flex items-center justify-center gap-2 py-3 md:py-4 px-4 rounded-xl md:rounded-2xl text-[9px] md:text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${activeTab === tab.id ? 'bg-white dark:bg-slate-900 text-indigo-600 shadow-md' : 'text-slate-400 hover:text-slate-600'}`}
                   >
                     <tab.icon size={14} className="shrink-0" /> {tab.label}
                   </button>
                 ))}
               </div>

               <div className="p-6 md:p-10">
                 <AnimatePresence mode="wait">
                    {activeTab === 'details' && (
                      <motion.div key="details" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-8 md:space-y-12">
                         <div className="grid grid-cols-2 md:grid-cols-3 gap-6 md:gap-8">
                            {specifications.map((spec, i) => (
                              <div key={i} className="flex items-center gap-3 md:gap-4">
                                <div className="w-10 h-10 md:w-12 md:h-12 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 rounded-xl md:rounded-2xl flex items-center justify-center shrink-0">
                                  <spec.icon size={18} />
                                </div>
                                <div className="min-w-0">
                                   <p className="text-[8px] md:text-[9px] font-black uppercase tracking-widest text-slate-400 truncate">{spec.label}</p>
                                   <p className="text-sm md:text-base font-black dark:text-white truncate">{spec.value}</p>
                                </div>
                              </div>
                            ))}
                         </div>

                         <div className="space-y-4">
                            <h4 className="text-[10px] md:text-xs font-black uppercase tracking-widest text-slate-900 dark:text-white">Professional Overview</h4>
                            <p className="text-xs md:text-sm text-slate-500 dark:text-slate-400 leading-relaxed font-medium">
                              {property.description || `This premium ${property.type} at ${property.location} represents a pinnacle of luxury living. Designed with high-performance architectural standards, the space offers expansive cross-ventilation, premium Italian marble flooring, and state-of-the-art climate control. Ideal for HNIs and luxury investors seeking a high-yield asset in a prime corridor.`}
                            </p>
                         </div>

                         <div className="space-y-4">
                            <h4 className="text-[10px] md:text-xs font-black uppercase tracking-widest text-slate-900 dark:text-white">Floor Plan Concept</h4>
                            <div className="aspect-[21/9] w-full bg-slate-50 dark:bg-slate-800/50 rounded-2xl md:rounded-[2rem] border-2 border-dashed border-slate-200 dark:border-slate-700 flex items-center justify-center group cursor-zoom-in">
                               <div className="text-center">
                                  <Layout className="mx-auto mb-4 text-slate-300 group-hover:text-indigo-600 transition-colors" size={32} />
                                  <p className="text-[8px] md:text-[10px] font-black uppercase tracking-widest text-slate-400 px-4">Interactive 3D Layout Preview {property.dimensions ? `(${property.dimensions})` : ''}</p>
                               </div>
                            </div>
                         </div>
                      </motion.div>
                    )}
                    {/* ... other tabs remain the same ... */}
                    {activeTab === 'neighborhood' && (
                      <motion.div key="neighborhood" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-8 md:space-y-10">
                         <div className="aspect-video w-full bg-[#e3e7f0] dark:bg-slate-950 rounded-2xl md:rounded-[2.5rem] relative overflow-hidden border border-slate-100 dark:border-slate-800">
                            <div className="absolute inset-0 opacity-40" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, #4f46e5 1.5px, transparent 0)', backgroundSize: '40px 40px' }} />
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                               <motion.div animate={{ y: [0, -10, 0] }} transition={{ repeat: Infinity, duration: 2 }} className="w-10 h-10 md:w-12 md:h-12 bg-indigo-600 rounded-full flex items-center justify-center shadow-2xl border-4 border-white">
                                  <MapPin size={20} className="text-white" />
                               </motion.div>
                               <div className="mt-4 px-3 py-1.5 md:px-4 md:py-2 bg-white rounded-xl shadow-xl border border-slate-100 text-[8px] md:text-[10px] font-black uppercase tracking-widest whitespace-nowrap">
                                  {property.title}
                               </div>
                            </div>
                         </div>
                         <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                            <div className="space-y-4">
                               <h4 className="text-[10px] md:text-xs font-black uppercase tracking-widest text-slate-900 dark:text-white flex items-center gap-2">
                                  <Info size={16} className="text-indigo-600" /> Locality Score: 9.4
                               </h4>
                               <div className="space-y-3">
                                  {neighborhood.map((item, i) => (
                                    <div key={i} className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl md:rounded-2xl border border-slate-100 dark:border-slate-700">
                                       <span className="text-[9px] font-black uppercase tracking-widest text-slate-600 dark:text-slate-400 truncate pr-2">{item.place}</span>
                                       <div className="text-right shrink-0">
                                          <p className="text-xs font-black dark:text-white">{item.distance}</p>
                                          <p className="text-[8px] text-slate-400 font-bold uppercase">{item.time}</p>
                                       </div>
                                    </div>
                                  ))}
                               </div>
                            </div>
                            <div className="bg-indigo-600 rounded-2xl md:rounded-[2rem] p-6 md:p-8 text-white relative overflow-hidden group">
                               <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 blur-2xl group-hover:scale-150 transition-transform duration-1000" />
                               <div className="relative z-10">
                                  <h4 className="text-xl md:text-2xl font-black mb-3 tracking-tighter">Market Pulse</h4>
                                  <p className="text-indigo-100 text-xs md:text-sm font-medium mb-6 opacity-80 leading-relaxed">Property values in {property.location} have appreciated by 14.2% in the last 18 months.</p>
                                  <button className="flex items-center gap-2 text-[9px] md:text-[10px] font-black uppercase tracking-widest bg-white text-indigo-600 px-5 py-3 md:px-6 md:py-3.5 rounded-xl shadow-xl hover:scale-105 active:scale-95 transition-all">
                                     Market Trends <ArrowRight size={14} />
                                  </button>
                               </div>
                            </div>
                         </div>
                      </motion.div>
                    )}
                    {activeTab === 'reviews' && (
                      <motion.div key="reviews" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-8 md:space-y-10">
                         {user && (
                           <div className="p-6 md:p-8 bg-indigo-50 dark:bg-indigo-950/20 rounded-2xl md:rounded-[2.5rem] border border-indigo-100 dark:border-indigo-900/30">
                              <h4 className="text-[10px] md:text-xs font-black uppercase tracking-widest text-indigo-600 mb-6">Write a Review</h4>
                              <textarea 
                                value={newComment}
                                onChange={(e) => setNewComment(e.target.value)}
                                placeholder="Share your experience about the site visit..."
                                className="w-full h-24 md:h-32 p-4 md:p-6 bg-white dark:bg-slate-900 rounded-2xl text-xs md:text-sm border-none shadow-sm focus:ring-4 focus:ring-indigo-500/10 outline-none mb-6 resize-none"
                              />
                              <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                                 <div className="flex gap-2">
                                    {[1,2,3,4,5].map(n => (
                                      <button key={n} onClick={() => setNewRating(n)} className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${newRating >= n ? 'bg-amber-100 text-amber-600 shadow-sm' : 'bg-white dark:bg-slate-800 text-slate-300'}`}>
                                        <Star size={18} fill={newRating >= n ? "currentColor" : "none"} />
                                      </button>
                                    ))}
                                 </div>
                                 <button 
                                  onClick={handleReviewSubmit} 
                                  className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-3.5 md:py-4 bg-indigo-600 text-white rounded-xl md:rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-xl shadow-indigo-100 hover:bg-indigo-700 transition-all active:scale-95"
                                 >
                                    Post Feedback <Send size={14} />
                                 </button>
                              </div>
                           </div>
                         )}
                         <div className="space-y-4 md:space-y-6">
                           {property.reviews.length > 0 ? property.reviews.map(rev => (
                             <div key={rev.id} className="p-6 md:p-8 bg-white dark:bg-slate-900 rounded-2xl md:rounded-[2rem] border border-slate-100 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row gap-4 md:gap-6">
                                <div className="w-10 h-10 md:w-12 md:h-12 bg-slate-100 dark:bg-slate-800 rounded-xl md:rounded-2xl flex items-center justify-center shrink-0">
                                   <UserCircleIcon size={24} className="text-slate-400" />
                                </div>
                                <div className="flex-grow min-w-0">
                                   <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-2 gap-2">
                                     <h5 className="font-black text-[11px] md:text-xs dark:text-white uppercase tracking-widest truncate max-w-full">{rev.authorName}</h5>
                                     <div className="flex items-center gap-0.5 text-amber-500 shrink-0">
                                        {Array.from({length: 5}).map((_, i) => <Star key={i} size={10} fill={i < rev.rating ? "currentColor" : "none"} className={i < rev.rating ? '' : 'text-slate-200'} />)}
                                     </div>
                                   </div>
                                   <p className="text-[11px] md:text-xs text-slate-500 dark:text-slate-400 font-medium leading-relaxed italic mb-4">"{rev.comment}"</p>
                                   <span className="text-[8px] md:text-[9px] text-slate-400 font-black uppercase tracking-widest">Site Verified • {rev.date}</span>
                                </div>
                             </div>
                           )) : (
                             <div className="py-16 md:py-20 text-center text-slate-400 text-[9px] md:text-[10px] font-black uppercase tracking-widest bg-slate-50 dark:bg-slate-900/50 rounded-2xl md:rounded-[2.5rem] border-2 border-dashed border-slate-100 dark:border-slate-800">
                               No Testimonials yet
                             </div>
                           )}
                         </div>
                      </motion.div>
                    )}
                 </AnimatePresence>
               </div>
            </div>
          </div>
          {/* ... sidebar ... */}
          <div className="lg:col-span-4 space-y-6 md:space-y-8">
            <div className="lg:sticky lg:top-24 space-y-6 md:space-y-8">
               <div className="bg-white dark:bg-slate-900 p-6 md:p-8 rounded-[2rem] md:rounded-[3rem] shadow-2xl border border-slate-100 dark:border-slate-800">
                  <h4 className="text-base md:text-lg font-black dark:text-white uppercase tracking-tighter mb-6 md:mb-8">Acquisition Desk</h4>
                  <div className="space-y-4 md:space-y-6 mb-8 md:mb-10">
                    <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl md:rounded-2xl border border-slate-100 dark:border-slate-700">
                       <div className="flex items-center gap-3">
                          <Wallet className="text-indigo-600 shrink-0" size={16} />
                          <span className="text-[9px] md:text-[10px] font-black uppercase tracking-widest text-slate-500">EMI Estimate</span>
                       </div>
                       <span className="text-xs font-black dark:text-white shrink-0">₹{Math.round(property.price / 120).toLocaleString()}/mo</span>
                    </div>
                    <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl md:rounded-2xl border border-slate-100 dark:border-slate-700">
                       <div className="flex items-center gap-3">
                          <IndianRupee className="text-indigo-600 shrink-0" size={16} />
                          <span className="text-[9px] md:text-[10px] font-black uppercase tracking-widest text-slate-500">Registration</span>
                       </div>
                       <span className="text-xs font-black dark:text-white shrink-0">~ 5% Plus Fees</span>
                    </div>
                  </div>
                  <div className="space-y-3 md:space-y-4">
                    <button onClick={onPaymentRequired} className="w-full py-4 md:py-5 bg-indigo-600 text-white rounded-xl md:rounded-2xl font-black uppercase text-[10px] md:text-[11px] tracking-widest flex items-center justify-center gap-3 shadow-xl shadow-indigo-600/20 hover:scale-[1.02] active:scale-95 transition-all">
                      <Phone size={18} /> Schedule Visit
                    </button>
                    <button onClick={onChatRequired} className="w-full py-4 md:py-5 bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 rounded-xl md:rounded-2xl font-black uppercase text-[10px] md:text-[11px] tracking-widest flex items-center justify-center gap-3 border-2 border-indigo-100 dark:border-slate-700 hover:bg-indigo-50 dark:hover:bg-slate-700 transition-all active:scale-95">
                      <MessageCircle size={18} /> Message Agent
                    </button>
                  </div>
                  <div className="mt-8 pt-6 md:pt-8 border-t border-slate-100 dark:border-slate-800 flex items-center gap-4">
                     <div className="w-10 h-10 md:w-12 md:h-12 bg-slate-100 dark:bg-slate-800 rounded-xl overflow-hidden shadow-inner shrink-0">
                        <img src="https://i.pravatar.cc/150?u=agent" className="w-full h-full object-cover" />
                     </div>
                     <div className="min-w-0">
                        <p className="text-[8px] md:text-[9px] font-black uppercase text-slate-400 tracking-widest">Consultant</p>
                        <p className="text-xs font-black dark:text-white flex items-center gap-1.5 truncate">Ghar Bazar Premium <ShieldCheck size={14} className="text-indigo-600 shrink-0" /></p>
                     </div>
                  </div>
               </div>
               <div className="bg-amber-50 dark:bg-amber-900/20 p-6 md:p-8 rounded-2xl md:rounded-[2.5rem] border border-amber-100 dark:border-amber-900/30">
                  <div className="flex items-center gap-3 mb-4">
                     <ShieldAlert size={20} className="text-amber-600 shrink-0" />
                     <h4 className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.2em] text-amber-900 dark:text-amber-500">Security Note</h4>
                  </div>
                  <ul className="space-y-3">
                     <li className="text-[9px] md:text-[10px] text-amber-800 dark:text-amber-400 font-bold leading-relaxed flex items-start gap-2">
                        <div className="w-1 h-1 rounded-full bg-amber-400 mt-1.5 shrink-0"></div>
                        Always verify RERA registration before any financial commitment.
                     </li>
                     <li className="text-[9px] md:text-[10px] text-amber-800 dark:text-amber-400 font-bold leading-relaxed flex items-start gap-2">
                        <div className="w-1 h-1 rounded-full bg-amber-400 mt-1.5 shrink-0"></div>
                        Demand physical copies of original Title Deeds via Vault.
                     </li>
                  </ul>
               </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
      <div className="lg:hidden fixed bottom-0 left-0 right-0 p-3 md:p-4 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-t border-slate-100 dark:border-slate-800 z-[70] flex gap-3 shadow-[0_-10px_30px_rgba(0,0,0,0.05)]">
        <button onClick={onPaymentRequired} className="flex-grow py-3.5 md:py-4 bg-indigo-600 text-white rounded-xl md:rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-lg shadow-indigo-100 flex items-center justify-center gap-2 active:scale-95 transition-all">
          <Phone size={16} /> Call Agent
        </button>
        <button onClick={onChatRequired} className="w-12 h-12 md:w-14 md:h-14 bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 rounded-xl md:rounded-2xl flex items-center justify-center border border-emerald-100 dark:border-emerald-800 shadow-sm active:scale-95 transition-all">
          <MessageCircle size={22} />
        </button>
      </div>
    </motion.div>
  );
};

const ImageIcon = ({ size }: { size: number }) => <Layout size={size} />;
const UserCircleIcon = ({ size, className }: { size: number, className?: string }) => <Layout size={size} className={className} />;

export default PropertyDetail;
