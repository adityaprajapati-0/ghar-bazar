
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Camera, Check, MapPin, Building, ArrowRight, ArrowLeft, Loader2, FileText, Upload, ShieldAlert, Sparkles, Wand2, IndianRupee, Bed, Bath, Square, Phone, Type, X, Info, CheckCircle2 } from 'lucide-react';
import { Property } from '../types';
import { GoogleGenAI } from "@google/genai";

interface Props {
  onComplete: (property: Property) => void;
}

const ListingWizard: React.FC<Props> = ({ onComplete }) => {
  const [step, setStep] = useState(1);
  const [isUploading, setIsUploading] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [showReviewPopup, setShowReviewPopup] = useState(false);
  const [images, setImages] = useState<string[]>([]);
  
  // Property Basic State
  const [propertyType, setPropertyType] = useState<Property['type']>('Apartment');
  const [title, setTitle] = useState('');
  const [beds, setBeds] = useState('3');
  const [baths, setBaths] = useState('2');
  const [sqft, setSqft] = useState('1200');
  const [furnishing, setFurnishing] = useState<Property['furnishingStatus']>('Unfurnished');
  
  // Pricing & Contact State
  const [price, setPrice] = useState('');
  const [location, setLocation] = useState('Mumbai, India');
  const [sellerPhone, setSellerPhone] = useState('');
  
  const [legalDocs, setLegalDocs] = useState<{ saleDeed: boolean; noc: boolean }>({ saleDeed: false, noc: false });

  const handleNext = () => step < 6 && setStep(step + 1);
  const handlePrev = () => step > 1 && setStep(step - 1);

  const mockUpload = () => {
    setIsUploading(true);
    setTimeout(() => {
      setImages([...images, 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=400']);
      setIsUploading(false);
    }, 1000);
  };

  const generateAIPhotos = async () => {
    if (images.length >= 4) return;
    setIsGenerating(true);
    const numNeeded = 4 - images.length;
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const newAIImages: string[] = [];

    try {
      for (let i = 0; i < numNeeded; i++) {
        const subjects = [
          `the main living area of a luxury ${propertyType}`,
          `the modern kitchen of a premium ${propertyType}`,
          `a spacious master bedroom in a high-end ${propertyType}`
        ];
        const prompt = `Realistic high-end architectural photo of ${subjects[i % subjects.length]} in ${location}. Cinematic lighting, 8k, modern interior design.`;
        const response = await ai.models.generateContent({
          model: 'gemini-2.5-flash-image',
          contents: { parts: [{ text: prompt }] },
          config: { imageConfig: { aspectRatio: "4:3" } },
        });

        const imagePart = response.candidates?.[0]?.content?.parts.find(part => part.inlineData);
        if (imagePart?.inlineData) {
          newAIImages.push(`data:image/png;base64,${imagePart.inlineData.data}`);
        }
      }
      setImages(prev => [...prev, ...newAIImages]);
    } catch (error) {
      console.error(error);
      alert("AI Vision busy. Please upload photos.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSubmit = () => {
    setShowReviewPopup(true);
  };

  const finalizeListing = () => {
    const newProperty: Property = {
      id: Math.random().toString(36).substr(2, 9),
      title: title || 'Luxury ' + propertyType,
      price: parseInt(price) || 0,
      location: location,
      type: propertyType,
      beds: parseInt(beds),
      baths: parseInt(baths),
      sqft: parseInt(sqft),
      furnishingStatus: furnishing,
      imageUrl: images[0] || 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800',
      images: images,
      verified: false,
      featured: false,
      coordinates: { lat: 19.0760, lng: 72.8777 },
      ownerId: 'current_user',
      reviews: [],
    };
    onComplete(newProperty);
  };

  return (
    <div className="max-w-4xl mx-auto py-10 px-4">
      {/* Progress Stepper */}
      <div className="flex items-center justify-between mb-10 overflow-x-auto no-scrollbar pb-4 px-2">
        {[1, 2, 3, 4, 5, 6].map(s => (
          <div key={s} className="flex items-center gap-2 shrink-0 px-2">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-500 ${step >= s ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-400'}`}>
              {step > s ? <Check size={14} /> : s}
            </div>
            <span className={`text-[10px] font-black uppercase tracking-widest hidden sm:block ${step >= s ? 'text-indigo-600' : 'text-slate-300'}`}>
              {['Category', 'Basics', 'Pricing', 'Media', 'Legal', 'Confirm'][s-1]}
            </span>
          </div>
        ))}
      </div>

      <motion.div 
        key={step} 
        initial={{ opacity: 0, y: 20 }} 
        animate={{ opacity: 1, y: 0 }} 
        className="bg-white dark:bg-slate-900 rounded-[2.5rem] p-6 md:p-10 shadow-2xl border border-slate-100 dark:border-slate-800"
      >
        {step === 1 && (
          <div className="space-y-6">
            <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight uppercase">Property Category</h2>
            <div className="grid grid-cols-2 gap-4">
              {['Apartment', 'Villa', 'Plot', 'Land'].map(t => (
                <button 
                  key={t} 
                  onClick={() => setPropertyType(t as any)}
                  className={`p-8 border-2 rounded-[2rem] text-left transition-all font-bold group ${propertyType === t ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-900/20' : 'border-slate-50 dark:border-slate-800 bg-white dark:bg-slate-900'}`}
                >
                  <Building size={24} className={`mb-4 ${propertyType === t ? 'text-indigo-600' : 'text-slate-400'}`} />
                  <span className={`text-lg dark:text-white ${propertyType === t ? 'text-indigo-600' : ''}`}>{t}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-8">
            <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight uppercase">Core Specifications</h2>
            <div className="space-y-6">
              <div>
                <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest px-1 mb-2 block">Property Title</label>
                <div className="relative">
                  <Type className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Modern Seafacing Penthouse" className="w-full pl-14 pr-6 py-4 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl outline-none font-bold dark:text-white" />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest px-1 mb-2 block">Configuration (BHK)</label>
                  <div className="relative">
                    <Bed className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input type="number" value={beds} onChange={(e) => setBeds(e.target.value)} className="w-full pl-14 pr-6 py-4 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl outline-none font-bold dark:text-white" />
                  </div>
                </div>
                <div>
                  <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest px-1 mb-2 block">Bathrooms</label>
                  <div className="relative">
                    <Bath className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input type="number" value={baths} onChange={(e) => setBaths(e.target.value)} className="w-full pl-14 pr-6 py-4 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl outline-none font-bold dark:text-white" />
                  </div>
                </div>
                <div>
                  <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest px-1 mb-2 block">Carpet Area (Sq.Ft)</label>
                  <div className="relative">
                    <Square className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input type="number" value={sqft} onChange={(e) => setSqft(e.target.value)} className="w-full pl-14 pr-6 py-4 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl outline-none font-bold dark:text-white" />
                  </div>
                </div>
              </div>

              <div>
                <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest px-1 mb-2 block">Furnishing Status</label>
                <div className="flex gap-2">
                  {['Unfurnished', 'Semi-Furnished', 'Fully Furnished'].map(f => (
                    <button key={f} onClick={() => setFurnishing(f as any)} className={`flex-grow py-3 px-4 rounded-xl text-[10px] font-black uppercase tracking-widest border-2 transition-all ${furnishing === f ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-slate-50 dark:bg-slate-800 border-transparent text-slate-400'}`}>
                      {f}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-8">
            <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight uppercase">Pricing & Reach</h2>
            <div className="space-y-6">
              <div>
                <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest px-1 mb-2 block">Asking Price (₹)</label>
                <div className="relative">
                  <IndianRupee className="absolute left-5 top-1/2 -translate-y-1/2 text-indigo-600" size={24} />
                  <input type="number" value={price} onChange={(e) => setPrice(e.target.value)} placeholder="Enter amount in ₹" className="w-full pl-16 pr-6 py-6 bg-slate-50 dark:bg-slate-800 border-none rounded-[1.5rem] outline-none font-black text-3xl text-indigo-600 transition-all" />
                </div>
                <p className="mt-3 text-xs text-slate-400 font-bold uppercase tracking-widest">Estimated Value: ₹{(parseInt(price || '0') / 10000000).toFixed(2)} Cr</p>
              </div>

              <div>
                <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest px-1 mb-2 block">Property Location</label>
                <div className="relative">
                  <MapPin className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <input value={location} onChange={(e) => setLocation(e.target.value)} className="w-full pl-14 pr-6 py-4 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl outline-none font-bold dark:text-white" />
                </div>
              </div>

              <div>
                <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest px-1 mb-2 block">Seller Contact Number</label>
                <div className="relative">
                  <Phone className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <input type="tel" value={sellerPhone} onChange={(e) => setSellerPhone(e.target.value)} placeholder="Primary Mobile Number" className="w-full pl-14 pr-6 py-4 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl outline-none font-bold dark:text-white" />
                </div>
              </div>
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="space-y-8">
            <div className="flex items-end justify-between">
              <div>
                <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight uppercase">Media Gallery</h2>
                <p className="text-slate-400 text-xs font-bold mt-1 uppercase tracking-widest">Add at least 4 photos for higher trust scores.</p>
              </div>
              <button onClick={generateAIPhotos} disabled={isGenerating} className="px-6 py-3 bg-indigo-600 text-white rounded-xl font-black text-[10px] uppercase tracking-widest flex items-center gap-2 hover:bg-indigo-700 disabled:opacity-50">
                {isGenerating ? <Loader2 className="animate-spin" size={14} /> : <Sparkles size={14} />} AI Vision
              </button>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {images.map((img, i) => (
                <div key={i} className="aspect-square rounded-[1.5rem] overflow-hidden border-2 border-slate-100 dark:border-slate-800 relative group">
                  <img src={img} className="w-full h-full object-cover" />
                  <button onClick={() => setImages(images.filter((_, idx) => idx !== i))} className="absolute top-2 right-2 p-1.5 bg-rose-500 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity">
                    <X size={12} />
                  </button>
                </div>
              ))}
              {images.length < 4 && (
                <button onClick={mockUpload} className="aspect-square border-2 border-dashed border-slate-100 dark:border-slate-800 rounded-[1.5rem] flex flex-col items-center justify-center text-slate-300 hover:border-indigo-600 hover:bg-indigo-50 transition-all">
                  <Camera size={32} />
                  <span className="text-[10px] font-black uppercase mt-2">Add Photo</span>
                </button>
              )}
            </div>
          </div>
        )}

        {step === 5 && (
          <div className="space-y-8">
            <div className="p-6 bg-amber-50 dark:bg-amber-900/20 border border-amber-100 dark:border-amber-800 rounded-2xl flex items-center gap-4">
              <ShieldAlert className="text-amber-600 shrink-0" size={32} />
              <p className="text-xs font-bold text-amber-900 dark:text-amber-400 uppercase tracking-widest">Verification flow is mandatory for premium visibility.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div onClick={() => setLegalDocs(p => ({...p, saleDeed: !p.saleDeed}))} className={`p-8 border-2 rounded-[2rem] cursor-pointer transition-all ${legalDocs.saleDeed ? 'border-emerald-500 bg-emerald-50' : 'border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900'}`}>
                <FileText className={`mb-4 ${legalDocs.saleDeed ? 'text-emerald-500' : 'text-slate-400'}`} size={32} />
                <h4 className="font-black text-lg dark:text-white">Sale Deed</h4>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-2">{legalDocs.saleDeed ? 'READY' : 'UPLOAD PDF'}</p>
              </div>
              <div onClick={() => setLegalDocs(p => ({...p, noc: !p.noc}))} className={`p-8 border-2 rounded-[2rem] cursor-pointer transition-all ${legalDocs.noc ? 'border-emerald-500 bg-emerald-50' : 'border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900'}`}>
                <ShieldAlert className={`mb-4 ${legalDocs.noc ? 'text-emerald-500' : 'text-slate-400'}`} size={32} />
                <h4 className="font-black text-lg dark:text-white">Society NOC</h4>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-2">{legalDocs.noc ? 'READY' : 'UPLOAD PDF'}</p>
              </div>
            </div>
          </div>
        )}

        {step === 6 && (
          <div className="text-center space-y-8 py-10">
            <div className="w-24 h-24 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 rounded-full flex items-center justify-center mx-auto shadow-xl">
              <Info size={48} />
            </div>
            <div>
              <h2 className="text-4xl font-black text-slate-900 dark:text-white tracking-tighter uppercase">Review Portfolio</h2>
              <p className="text-slate-400 font-medium max-w-sm mx-auto mt-4">Review all specifications before launching to the marketplace.</p>
            </div>
            
            <div className="bg-slate-50 dark:bg-slate-800/50 p-8 rounded-[2rem] text-left border border-slate-100 dark:border-slate-700">
              <div className="space-y-3">
                <div className="flex justify-between border-b border-slate-100 dark:border-slate-700 pb-3">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Final Price</span>
                  <span className="font-black text-indigo-600">₹{parseInt(price || '0').toLocaleString()}</span>
                </div>
                <div className="flex justify-between border-b border-slate-100 dark:border-slate-700 pb-3">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Configuration</span>
                  <span className="font-black dark:text-white">{beds} BHK • {sqft} Sq.Ft</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Contact Info</span>
                  <span className="font-black dark:text-white">+91 {sellerPhone}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Navigation Actions */}
        <div className="mt-12 flex justify-between">
          <button onClick={handlePrev} className={`px-8 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all ${step === 1 ? 'opacity-0 pointer-events-none' : 'text-slate-400 hover:bg-slate-100'}`}>
            <ArrowLeft size={18} className="mr-2" /> Back
          </button>
          <button 
            onClick={step === 6 ? handleSubmit : handleNext} 
            className="px-10 py-4 bg-indigo-600 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl shadow-indigo-100 dark:shadow-none flex items-center gap-3 hover:bg-indigo-700 active:scale-95 transition-all"
          >
            {step === 6 ? 'Launch to Marketplace' : 'Proceed'} <ArrowRight size={18} />
          </button>
        </div>
      </motion.div>

      {/* Review Process Success Popup */}
      <AnimatePresence>
        {showReviewPopup && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white dark:bg-slate-900 rounded-[3rem] p-10 max-w-md w-full text-center shadow-2xl"
            >
              <div className="w-24 h-24 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-8">
                <CheckCircle2 size={48} />
              </div>
              <h3 className="text-3xl font-black text-slate-900 dark:text-white tracking-tighter uppercase mb-4">Submission Confirmed</h3>
              <div className="space-y-4 text-slate-500 dark:text-slate-400">
                <p className="font-bold text-sm leading-relaxed">
                  Your request is currently in the <span className="text-indigo-600 underline">review process</span>. 
                </p>
                <div className="p-6 bg-slate-50 dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 flex items-start gap-4 text-left">
                  <Info className="text-indigo-600 shrink-0 mt-1" size={20} />
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Estimated Timeline</p>
                    <p className="text-xs font-bold leading-relaxed dark:text-white">
                      Our moderation team will validate your documents and media. This may take <span className="text-emerald-600 font-black">3-4 hours</span> to validate.
                    </p>
                  </div>
                </div>
                <p className="text-[9px] font-black uppercase tracking-widest opacity-50">You will be notified once the asset is live.</p>
              </div>
              <button 
                onClick={finalizeListing} 
                className="w-full mt-10 py-5 bg-indigo-600 text-white rounded-2xl font-black uppercase text-[11px] tracking-widest shadow-xl shadow-indigo-100 dark:shadow-none hover:bg-indigo-700 transition-all active:scale-95"
              >
                Return to Dashboard
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ListingWizard;
