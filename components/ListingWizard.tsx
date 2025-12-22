
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Camera, Check, MapPin, Building, ArrowRight, ArrowLeft, Loader2, FileText, Upload, ShieldAlert, Sparkles, Wand2, Image as ImageIcon } from 'lucide-react';
import { Property } from '../types';
import { GoogleGenAI } from "@google/genai";

interface Props {
  onComplete: (property: Property) => void;
}

const ListingWizard: React.FC<Props> = ({ onComplete }) => {
  const [step, setStep] = useState(1);
  const [isUploading, setIsUploading] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [images, setImages] = useState<string[]>([]);
  const [propertyType, setPropertyType] = useState<Property['type']>('Apartment');
  const [location, setLocation] = useState('Mumbai, India');
  const [legalDocs, setLegalDocs] = useState<{ saleDeed: boolean; noc: boolean }>({ saleDeed: false, noc: false });

  const handleNext = () => step < 5 && setStep(step + 1);
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
        // Vary the prompt slightly for each image to get different angles/rooms
        const subjects = [
          `the main living area of a luxury ${propertyType}`,
          ` the modern kitchen of a premium ${propertyType}`,
          `a spacious master bedroom in a high-end ${propertyType}`,
          `the exterior and entrance of a prestigious ${propertyType}`
        ];
        
        const prompt = `A professional, realistic architectural photograph showing ${subjects[i % subjects.length]} in ${location}. 
          High-end interior design, cinematic lighting, 8k resolution, photorealistic, elegant atmosphere. No people.`;

        const response = await ai.models.generateContent({
          model: 'gemini-2.5-flash-image',
          contents: {
            parts: [{ text: prompt }],
          },
          config: {
            imageConfig: {
              aspectRatio: "4:3",
            },
          },
        });

        const imagePart = response.candidates?.[0]?.content?.parts.find(part => part.inlineData);
        if (imagePart?.inlineData) {
          newAIImages.push(`data:image/png;base64,${imagePart.inlineData.data}`);
        }
      }
      setImages(prev => [...prev, ...newAIImages]);
    } catch (error) {
      console.error("AI Image Generation failed:", error);
      alert("AI Generation is temporarily busy. Please try again or upload manually.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleComplete = () => {
    const newProperty: Property = {
      id: Math.random().toString(36).substr(2, 9),
      title: 'New Listing - ' + propertyType,
      price: 0,
      location: location,
      type: propertyType,
      sqft: 1200,
      imageUrl: images[0] || 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800',
      images: images,
      verified: false,
      featured: false,
      coordinates: { lat: 19.0760, lng: 72.8777 },
      ownerId: 'current_user',
      reviews: [],
      legalDocs: {
        saleDeedUrl: legalDocs.saleDeed ? 'https://example.com/deed.pdf' : undefined,
        nocUrl: legalDocs.noc ? 'https://example.com/noc.pdf' : undefined
      }
    };
    onComplete(newProperty);
  };

  return (
    <div className="max-w-4xl mx-auto py-10 px-4">
      <div className="flex items-center justify-between mb-10">
        {[1, 2, 3, 4, 5].map(s => (
          <div key={s} className="flex items-center gap-2">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-500 ${step >= s ? 'bg-indigo-600 text-white scale-110' : 'bg-gray-100 text-gray-400'}`}>
              {step > s ? <Check size={14} /> : s}
            </div>
            <span className={`text-[10px] font-black uppercase tracking-widest hidden sm:block ${step >= s ? 'text-indigo-600' : 'text-gray-300'}`}>
              {['Basics', 'Location', 'Media', 'Legal', 'Review'][s-1]}
            </span>
          </div>
        ))}
      </div>

      <motion.div 
        key={step} 
        initial={{ opacity: 0, y: 20 }} 
        animate={{ opacity: 1, y: 0 }} 
        className="bg-white rounded-[2.5rem] p-6 md:p-10 shadow-2xl shadow-indigo-100/50 border border-gray-100"
      >
        {step === 1 && (
          <div className="space-y-6">
            <h2 className="text-3xl font-black text-gray-900 tracking-tight">Tell us about your property</h2>
            <p className="text-gray-500">Choose the category that best describes your estate.</p>
            <div className="grid grid-cols-2 gap-4">
              {['Apartment', 'Villa', 'Plot', 'Land'].map(t => (
                <button 
                  key={t} 
                  onClick={() => setPropertyType(t as any)}
                  className={`p-6 border-2 rounded-[2rem] text-left transition-all font-bold group ${propertyType === t ? 'border-indigo-600 bg-indigo-50 shadow-lg shadow-indigo-100' : 'border-gray-100 hover:border-indigo-200 bg-white'}`}
                >
                  <div className={`w-12 h-12 rounded-2xl mb-4 flex items-center justify-center transition-all ${propertyType === t ? 'bg-indigo-600 text-white' : 'bg-gray-50 text-gray-400'}`}>
                    <Building size={24} />
                  </div>
                  <span className="text-lg">{t}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6">
            <h2 className="text-3xl font-black text-gray-900 tracking-tight">Where is it located?</h2>
            <div className="space-y-4">
              <div className="relative">
                <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-indigo-500" size={20} />
                <input 
                  type="text" 
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="e.g. Bandra West, Mumbai"
                  className="w-full pl-12 pr-4 py-5 bg-gray-50 border-2 border-transparent rounded-[1.5rem] focus:bg-white focus:border-indigo-100 outline-none font-bold text-gray-800 transition-all"
                />
              </div>
              <div className="h-48 bg-gray-100 rounded-[2rem] flex items-center justify-center border-2 border-dashed border-gray-200 text-gray-400 font-bold uppercase text-xs tracking-widest">
                Interactive Map Loading...
              </div>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-8">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
              <div>
                <h2 className="text-3xl font-black text-gray-900 tracking-tight">Show off your space</h2>
                <p className="text-gray-500 mt-1">Minimum 4 photos required for verification.</p>
              </div>
              {images.length < 4 && (
                <button 
                  onClick={generateAIPhotos}
                  disabled={isGenerating}
                  className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-600 to-violet-600 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-lg shadow-indigo-200 hover:scale-105 active:scale-95 transition-all disabled:opacity-50"
                >
                  {isGenerating ? (
                    <Loader2 className="animate-spin" size={14} />
                  ) : (
                    <Sparkles size={14} />
                  )}
                  Magic AI Auto-Fill
                </button>
              )}
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <AnimatePresence>
                {images.map((img, i) => (
                  <motion.div 
                    key={i} 
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="aspect-square rounded-[1.5rem] overflow-hidden border-2 border-indigo-100 relative group"
                  >
                    <img src={img} className="w-full h-full object-cover" />
                    <button 
                      onClick={() => setImages(images.filter((_, idx) => idx !== i))}
                      className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <ArrowLeft size={12} className="rotate-45" />
                    </button>
                    {img.startsWith('data:image') && (
                      <div className="absolute bottom-2 left-2 px-2 py-0.5 bg-indigo-600/80 backdrop-blur-md text-white text-[8px] font-bold rounded uppercase tracking-tighter">
                        AI Generated
                      </div>
                    )}
                  </motion.div>
                ))}
              </AnimatePresence>

              {images.length < 4 && !isGenerating && (
                <button 
                  onClick={mockUpload}
                  disabled={isUploading}
                  className="aspect-square border-2 border-dashed border-gray-200 rounded-[1.5rem] flex flex-col items-center justify-center text-gray-400 hover:border-indigo-400 hover:bg-indigo-50 transition-all group"
                >
                  {isUploading ? <Loader2 className="animate-spin" /> : <Camera size={32} className="group-hover:scale-110 transition-transform" />}
                  <span className="text-[10px] font-black uppercase mt-2">Add Photo</span>
                </button>
              )}

              {isGenerating && (
                Array.from({ length: 4 - images.length }).map((_, i) => (
                  <div key={`loader-${i}`} className="aspect-square bg-gray-50 rounded-[1.5rem] border-2 border-gray-100 flex flex-col items-center justify-center overflow-hidden">
                    <div className="w-full h-full relative">
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent -translate-x-full animate-[shimmer_1.5s_infinite]"></div>
                      <div className="flex flex-col items-center justify-center h-full text-indigo-300">
                        <Wand2 size={24} className="animate-pulse mb-2" />
                        <span className="text-[8px] font-black uppercase tracking-widest text-indigo-400">Dreaming...</span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className="p-4 bg-indigo-50 rounded-2xl border border-indigo-100 flex items-start gap-3">
              <ImageIcon className="text-indigo-600 shrink-0" size={18} />
              <p className="text-[10px] text-indigo-800 font-bold uppercase tracking-widest leading-relaxed">
                Tip: AI placeholders help potential buyers visualize the potential of your property while your original photos are being verified.
              </p>
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="space-y-8">
            <div className="flex items-center gap-4 p-6 bg-amber-50 rounded-3xl border border-amber-100">
              <ShieldAlert className="text-amber-600 shrink-0" size={32} />
              <div>
                <h4 className="font-black text-amber-900 uppercase text-xs tracking-widest">Mandatory Verification</h4>
                <p className="text-sm text-amber-700 mt-1">Properties with legal documents get 5x more leads and the "Verified" badge.</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className={`p-8 border-2 rounded-[2.5rem] transition-all cursor-pointer ${legalDocs.saleDeed ? 'border-emerald-500 bg-emerald-50' : 'border-gray-100 bg-white hover:border-indigo-200'}`} onClick={() => setLegalDocs(prev => ({ ...prev, saleDeed: !prev.saleDeed }))}>
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-6 ${legalDocs.saleDeed ? 'bg-emerald-500 text-white' : 'bg-indigo-50 text-indigo-600'}`}>
                  <FileText size={24} />
                </div>
                <h4 className="font-black text-xl mb-2">Sale Deed</h4>
                <p className="text-sm text-gray-500 mb-6">Original sale deed or registered agreement for sale.</p>
                <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-indigo-600">
                  <Upload size={14} /> {legalDocs.saleDeed ? 'Uploaded' : 'Click to Upload'}
                </div>
              </div>

              <div className={`p-8 border-2 rounded-[2.5rem] transition-all cursor-pointer ${legalDocs.noc ? 'border-emerald-500 bg-emerald-50' : 'border-gray-100 bg-white hover:border-indigo-200'}`} onClick={() => setLegalDocs(prev => ({ ...prev, noc: !prev.noc }))}>
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-6 ${legalDocs.noc ? 'bg-emerald-500 text-white' : 'bg-indigo-50 text-indigo-600'}`}>
                  <ShieldAlert size={24} />
                </div>
                <h4 className="font-black text-xl mb-2">Society NOC</h4>
                <p className="text-sm text-gray-500 mb-6">No Objection Certificate from housing society or municipal body.</p>
                <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-indigo-600">
                  <Upload size={14} /> {legalDocs.noc ? 'Uploaded' : 'Click to Upload'}
                </div>
              </div>
            </div>
          </div>
        )}

        {step === 5 && (
          <div className="text-center space-y-6 py-10">
            <div className="w-24 h-24 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl shadow-indigo-100">
              <Check size={48} />
            </div>
            <h2 className="text-4xl font-black text-gray-900 tracking-tighter">Ready to go live?</h2>
            <p className="text-gray-500 max-w-sm mx-auto font-medium">Your listing will be reviewed by our legal team. It will appear as 'Unverified' until approval.</p>
          </div>
        )}

        <div className="mt-12 flex justify-between">
          <button onClick={handlePrev} className={`flex items-center gap-2 px-8 py-4 rounded-2xl font-bold transition-all ${step === 1 ? 'opacity-0 pointer-events-none' : 'text-gray-400 hover:bg-gray-100'}`}>
            <ArrowLeft size={20} /> Back
          </button>
          <button 
            onClick={step === 5 ? handleComplete : handleNext} 
            className="flex items-center gap-2 px-10 py-4 bg-indigo-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-indigo-100 hover:bg-indigo-700 active:scale-95 transition-all"
          >
            {step === 5 ? 'Launch Listing' : 'Continue'} <ArrowRight size={20} />
          </button>
        </div>
      </motion.div>

      <style>{`
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
      `}</style>
    </div>
  );
};

export default ListingWizard;
