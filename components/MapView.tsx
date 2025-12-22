
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Navigation, Info, List, Crosshair, ZoomIn, ZoomOut, Search } from 'lucide-react';
import { Property } from '../types';

interface Props {
  onPropertyClick: (p: Property) => void;
  properties: Property[];
  // Added placeholder prop to fix Type Error in App.tsx
  placeholder?: string;
}

const MapView: React.FC<Props> = ({ onPropertyClick, properties, placeholder }) => {
  const [activePin, setActivePin] = useState<string | null>(null);
  const [zoom, setZoom] = useState(1);

  const formatPrice = (num: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumSignificantDigits: 3,
    }).format(num);
  };

  // Mock mapping properties to random coordinates for visuals
  const pins = properties.map((p, i) => ({
    id: p.id,
    x: `${25 + (i * 15) % 60}%`,
    y: `${30 + (i * 12) % 50}%`,
    price: formatPrice(p.price),
    property: p
  }));

  return (
    <div className="h-[calc(100vh-80px)] w-full bg-[#e3e7f0] dark:bg-gray-950 relative overflow-hidden">
      {/* Dynamic Grid Layer */}
      <div 
        className="absolute inset-0 opacity-40 transition-opacity duration-1000"
        style={{
          backgroundImage: `
            radial-gradient(circle at 1px 1px, #4f46e5 1.5px, transparent 0),
            linear-gradient(to right, #cbd5e1 1px, transparent 1px),
            linear-gradient(to bottom, #cbd5e1 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px, 160px 160px, 160px 160px',
          transform: `scale(${1 + (zoom - 1) * 0.1})`,
          transition: 'transform 0.5s cubic-bezier(0.23, 1, 0.32, 1)'
        }}
      ></div>

      {/* Floating Header Controls */}
      <div className="absolute top-6 left-6 right-6 z-10 flex justify-between items-start pointer-events-none">
        <div className="flex gap-4 pointer-events-auto">
          <div className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl p-2 rounded-2xl shadow-2xl border border-white/50 dark:border-gray-800 flex flex-col gap-2">
            <button onClick={() => setZoom(z => Math.min(2, z + 0.2))} className="p-3 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 text-gray-500 hover:text-indigo-600 rounded-xl transition-all">
              <ZoomIn size={20} />
            </button>
            <button onClick={() => setZoom(z => Math.max(0.5, z - 0.2))} className="p-3 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 text-gray-500 hover:text-indigo-600 rounded-xl transition-all">
              <ZoomOut size={20} />
            </button>
            <div className="h-px bg-gray-100 dark:bg-gray-800 mx-2"></div>
            <button className="p-3 bg-indigo-600 text-white rounded-xl shadow-lg shadow-indigo-200">
              <Crosshair size={20} />
            </button>
          </div>
        </div>

        <div className="pointer-events-auto max-w-sm w-full hidden md:block">
          <div className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl rounded-[2rem] p-4 shadow-2xl border border-white/50 dark:border-gray-800">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input 
                type="text" 
                placeholder={placeholder || "Search this area..."} 
                className="w-full bg-gray-50 dark:bg-gray-800 border-none rounded-2xl pl-12 pr-4 py-3 text-sm focus:ring-2 focus:ring-indigo-600 transition-all dark:text-white"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Pins */}
      {pins.map((pin) => (
        <motion.div
          key={pin.id}
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          style={{ left: pin.x, top: pin.y }}
          className="absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer z-20"
          onClick={() => setActivePin(pin.id)}
        >
          <motion.div
            whileHover={{ scale: 1.15, y: -8 }}
            className={`px-4 py-2 rounded-full font-black text-xs shadow-[0_12px_24px_-4px_rgba(0,0,0,0.2)] transition-all flex items-center gap-2 border-2 ${
              activePin === pin.id 
              ? 'bg-indigo-600 text-white border-indigo-400 scale-110 z-30' 
              : 'bg-white text-gray-900 border-white dark:bg-gray-800 dark:text-white dark:border-gray-700'
            }`}
          >
            <MapPin size={14} className={activePin === pin.id ? 'text-white animate-bounce' : 'text-indigo-600'} />
            {pin.price}
          </motion.div>
          
          <AnimatePresence>
            {activePin === pin.id && (
              <motion.div 
                initial={{ opacity: 0, y: 10, scale: 0.8 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.8 }}
                className="absolute top-full left-1/2 -translate-x-1/2 mt-4 w-64 bg-white dark:bg-gray-900 rounded-3xl shadow-2xl overflow-hidden z-40 border border-gray-100 dark:border-gray-800"
              >
                <img src={pin.property.imageUrl} className="w-full h-32 object-cover" />
                <div className="p-4">
                  <h4 className="font-black text-sm text-gray-900 dark:text-white mb-1 truncate">{pin.property.title}</h4>
                  <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-4">{pin.property.location}</p>
                  <button 
                    onClick={(e) => { e.stopPropagation(); onPropertyClick(pin.property); }}
                    className="w-full py-2 bg-indigo-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-indigo-700 transition-colors"
                  >
                    View Details
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      ))}

      {/* Footer Info */}
      <div className="absolute bottom-10 left-6 right-6 z-10 flex flex-col items-center gap-4 pointer-events-none">
        <div className="bg-gray-900/90 dark:bg-indigo-600/90 backdrop-blur-md text-white px-8 py-4 rounded-[2rem] flex items-center gap-4 shadow-2xl border border-white/10 pointer-events-auto cursor-pointer hover:scale-105 transition-all">
          <List size={20} />
          <span className="text-sm font-black uppercase tracking-[0.2em]">Switch to List View</span>
        </div>
        <p className="text-[10px] text-gray-400 font-black uppercase tracking-[0.3em] backdrop-blur-sm px-4 py-1 rounded-full">
          Showing {properties.length} Premium Listings in Mumbai
        </p>
      </div>
    </div>
  );
};

export default MapView;
