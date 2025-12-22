
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Property } from '../types';
import { 
  X, Save, Trash2, Sparkles, Camera, IndianRupee, 
  Tag, Info, Plus, Loader2, ArrowLeft, Type, 
  Square, Bed, Bath, Layout, Wand2 
} from 'lucide-react';
import { GoogleGenAI } from "@google/genai";

interface Props {
  property: Property;
  onClose: () => void;
  onUpdate: (updatedProperty: Property) => void;
}

const PropertyManagementConsole: React.FC<Props> = ({ property, onClose, onUpdate }) => {
  const [editedProperty, setEditedProperty] = useState<Property>({ ...property });
  const [isSaving, setIsSaving] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [activeTab, setActiveTab] = useState<'pricing' | 'content' | 'media'>('pricing');

  const discountAmount = editedProperty.originalPrice 
    ? editedProperty.originalPrice - editedProperty.price 
    : 0;
  const discountPercent = editedProperty.originalPrice 
    ? Math.round((discountAmount / editedProperty.originalPrice) * 100) 
    : 0;

  const handlePriceUpdate = (newPrice: number) => {
    setEditedProperty(prev => ({
      ...prev,
      originalPrice: prev.originalPrice || prev.price,
      price: newPrice
    }));
  };

  const handleApplyDiscount = (percent: number) => {
    const base = editedProperty.originalPrice || editedProperty.price;
    const discounted = Math.round(base * (1 - percent / 100));
    setEditedProperty(prev => ({
      ...prev,
      originalPrice: base,
      price: discounted
    }));
  };

  const generateAIVision = async () => {
    setIsGenerating(true);
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    try {
      const prompt = `Highly detailed professional architectural photograph of a luxury ${editedProperty.type} in ${editedProperty.location}. 
        Cinematic lighting, 8k resolution, elegant interior design. Highlight the ${editedProperty.title} features.`;
      
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: { parts: [{ text: prompt }] },
        config: { imageConfig: { aspectRatio: "4:3" } },
      });

      const imagePart = response.candidates?.[0]?.content?.parts.find(part => part.inlineData);
      if (imagePart?.inlineData) {
        const newData = `data:image/png;base64,${imagePart.inlineData.data}`;
        setEditedProperty(prev => ({
          ...prev,
          images: [...prev.images, newData].slice(-10) // Limit to 10
        }));
      }
    } catch (e) {
      console.error(e);
      alert("AI Service busy. Try again shortly.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => {
      onUpdate(editedProperty);
      setIsSaving(false);
      onClose();
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-[100] bg-slate-950/90 backdrop-blur-xl flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="bg-white dark:bg-slate-900 w-full max-w-5xl h-[90vh] rounded-[3.5rem] overflow-hidden flex flex-col shadow-2xl border border-slate-200/50 dark:border-slate-800"
      >
        {/* Header */}
        <div className="p-8 md:p-10 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-6">
            <button onClick={onClose} className="p-3 bg-slate-50 dark:bg-slate-800 rounded-2xl text-slate-400 hover:text-slate-900 dark:hover:text-white transition-all">
              <ArrowLeft size={24} />
            </button>
            <div>
              <h2 className="text-3xl font-black dark:text-white tracking-tighter uppercase leading-none">{editedProperty.title}</h2>
              <p className="text-[10px] font-black uppercase tracking-[0.4em] text-indigo-600 mt-2">Inventory Management Console</p>
            </div>
          </div>
          <div className="flex gap-4">
            <button 
              onClick={handleSave}
              disabled={isSaving}
              className="px-8 py-4 bg-indigo-600 text-white rounded-2xl font-black uppercase text-[11px] tracking-widest flex items-center gap-3 shadow-xl shadow-indigo-600/20 hover:scale-105 active:scale-95 transition-all disabled:opacity-50"
            >
              {isSaving ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />} Save Changes
            </button>
          </div>
        </div>

        <div className="flex-grow flex flex-col md:flex-row overflow-hidden">
          {/* Sidebar Nav */}
          <div className="w-full md:w-64 bg-slate-50 dark:bg-slate-800/50 p-6 border-r border-slate-100 dark:border-slate-800 flex md:flex-col gap-2 overflow-x-auto no-scrollbar shrink-0">
            {[
              { id: 'pricing', label: 'Pricing & Discount', icon: IndianRupee },
              { id: 'content', label: 'Details & Specs', icon: Info },
              { id: 'media', label: 'Media Library', icon: Camera },
            ].map(t => (
              <button
                key={t.id}
                onClick={() => setActiveTab(t.id as any)}
                className={`flex items-center gap-4 px-6 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${activeTab === t.id ? 'bg-white dark:bg-slate-900 text-indigo-600 shadow-md' : 'text-slate-400 hover:text-slate-600'}`}
              >
                <t.icon size={18} /> {t.label}
              </button>
            ))}
          </div>

          {/* Editor Area */}
          <div className="flex-grow overflow-y-auto p-10 no-scrollbar">
            <AnimatePresence mode="wait">
              {activeTab === 'pricing' && (
                <motion.div key="pricing" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-10">
                  <div>
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-4 block">Market Pricing Strategy</label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="p-8 bg-white dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-700 rounded-[2.5rem] shadow-sm">
                        <p className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-4">Original Listing Price</p>
                        <div className="relative">
                          <IndianRupee className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={20} />
                          <input 
                            type="number"
                            value={editedProperty.originalPrice || editedProperty.price}
                            onChange={(e) => setEditedProperty(prev => ({ ...prev, originalPrice: parseInt(e.target.value) }))}
                            className="w-full bg-slate-50 dark:bg-slate-900 pl-12 pr-6 py-4 rounded-2xl outline-none font-black text-xl dark:text-white"
                          />
                        </div>
                      </div>
                      <div className="p-8 bg-indigo-50 dark:bg-indigo-900/10 border-2 border-indigo-100 dark:border-indigo-900/30 rounded-[2.5rem] shadow-sm">
                        <p className="text-[9px] font-black uppercase tracking-widest text-indigo-400 mb-4">Current Active Price</p>
                        <div className="relative">
                          <IndianRupee className="absolute left-4 top-1/2 -translate-y-1/2 text-indigo-600" size={24} />
                          <input 
                            type="number"
                            value={editedProperty.price}
                            onChange={(e) => handlePriceUpdate(parseInt(e.target.value))}
                            className="w-full bg-white dark:bg-slate-950 pl-14 pr-6 py-5 rounded-2xl outline-none font-black text-3xl text-indigo-600"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-4 block">Instant Discount Triggers</label>
                    <div className="flex flex-wrap gap-4">
                      {[5, 10, 15, 20].map(p => (
                        <button 
                          key={p} 
                          onClick={() => handleApplyDiscount(p)}
                          className="px-8 py-4 bg-white dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-700 rounded-2xl font-black text-xs uppercase tracking-widest hover:border-indigo-600 hover:text-indigo-600 transition-all"
                        >
                          Apply {p}% Off
                        </button>
                      ))}
                      <button 
                        onClick={() => setEditedProperty(p => ({ ...p, price: p.originalPrice || p.price }))}
                        className="px-8 py-4 bg-slate-100 dark:bg-slate-800 text-slate-400 rounded-2xl font-black text-xs uppercase tracking-widest"
                      >
                        Reset to Original
                      </button>
                    </div>
                    {discountAmount > 0 && (
                      <div className="mt-8 p-6 bg-emerald-50 dark:bg-emerald-900/10 border border-emerald-100 dark:border-emerald-900/30 rounded-2xl flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <Tag className="text-emerald-600" size={24} />
                          <div>
                            <p className="text-sm font-black text-emerald-900 dark:text-emerald-400 uppercase tracking-tighter">Discount Active</p>
                            <p className="text-xs text-emerald-600 font-bold">You are offering ₹{discountAmount.toLocaleString()} ({discountPercent}%) below market price.</p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}

              {activeTab === 'content' && (
                <motion.div key="content" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-10">
                   <div>
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-4 block">Property Narrative</label>
                    <textarea 
                      value={editedProperty.description || ''}
                      onChange={(e) => setEditedProperty(prev => ({ ...prev, description: e.target.value }))}
                      placeholder="Describe the unique value proposition of this estate..."
                      className="w-full h-48 bg-slate-50 dark:bg-slate-800 border-none rounded-[2rem] p-8 text-sm font-medium leading-relaxed dark:text-white outline-none focus:ring-4 focus:ring-indigo-500/10 transition-all resize-none"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <div>
                      <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-4 block">Dimensions</label>
                      <div className="relative">
                        <Square className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                        <input value={editedProperty.dimensions || ''} onChange={(e) => setEditedProperty(prev => ({ ...prev, dimensions: e.target.value }))} className="w-full bg-slate-50 dark:bg-slate-800 pl-12 pr-6 py-4 rounded-xl font-bold dark:text-white" />
                      </div>
                    </div>
                    <div>
                      <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-4 block">Built-up Area (SqFt)</label>
                      <div className="relative">
                        <Layout className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                        <input type="number" value={editedProperty.builtUpArea || ''} onChange={(e) => setEditedProperty(prev => ({ ...prev, builtUpArea: parseInt(e.target.value) }))} className="w-full bg-slate-50 dark:bg-slate-800 pl-12 pr-6 py-4 rounded-xl font-bold dark:text-white" />
                      </div>
                    </div>
                    <div>
                      <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-4 block">Configuration</label>
                      <div className="flex gap-2">
                        <div className="relative flex-grow">
                          <Bed className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={16} />
                          <input type="number" value={editedProperty.beds || 0} onChange={(e) => setEditedProperty(prev => ({ ...prev, beds: parseInt(e.target.value) }))} className="w-full bg-slate-50 dark:bg-slate-800 pl-10 pr-4 py-4 rounded-xl font-bold dark:text-white" />
                        </div>
                        <div className="relative flex-grow">
                          <Bath className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={16} />
                          <input type="number" value={editedProperty.baths || 0} onChange={(e) => setEditedProperty(prev => ({ ...prev, baths: parseInt(e.target.value) }))} className="w-full bg-slate-50 dark:bg-slate-800 pl-10 pr-4 py-4 rounded-xl font-bold dark:text-white" />
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {activeTab === 'media' && (
                <motion.div key="media" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-10">
                  <div className="flex items-center justify-between">
                    <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400">Manage Visual Assets</h4>
                    <button 
                      onClick={generateAIVision} 
                      disabled={isGenerating}
                      className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-violet-600 text-white rounded-xl font-black text-[10px] uppercase tracking-widest flex items-center gap-2 hover:scale-105 transition-all disabled:opacity-50"
                    >
                      {isGenerating ? <Loader2 className="animate-spin" size={14} /> : <Wand2 size={14} />} AI Virtual Staging
                    </button>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
                    {editedProperty.images.map((img, i) => (
                      <div key={i} className="aspect-square rounded-3xl overflow-hidden border-2 border-slate-100 dark:border-slate-800 relative group">
                        <img src={img} className="w-full h-full object-cover" />
                        <button 
                          onClick={() => setEditedProperty(p => ({ ...p, images: p.images.filter((_, idx) => idx !== i) }))}
                          className="absolute top-2 right-2 p-2 bg-rose-500 text-white rounded-xl opacity-0 group-hover:opacity-100 transition-all"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    ))}
                    <button className="aspect-square border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-3xl flex flex-col items-center justify-center text-slate-300 hover:border-indigo-600 hover:bg-indigo-50 transition-all group">
                      <Plus size={32} className="group-hover:scale-110 transition-transform" />
                      <span className="text-[9px] font-black uppercase tracking-widest mt-2">Add Photo</span>
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default PropertyManagementConsole;
