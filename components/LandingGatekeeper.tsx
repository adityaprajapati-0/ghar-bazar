
import React from 'react';
import { motion } from 'framer-motion';
import { UserRole } from '../types';
import { Building2, Search, ArrowRight, ShieldCheck, Lock } from 'lucide-react';

interface Props {
  onSelectRole: (role: UserRole) => void;
  translations: any;
}

const LandingGatekeeper: React.FC<Props> = ({ onSelectRole, translations }) => {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex items-center justify-center bg-white/20 backdrop-blur-3xl p-4"
    >
      <motion.div 
        initial={{ opacity: 0, scale: 0.9, y: 30 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 10 }}
        className="bg-white rounded-[2.5rem] shadow-[0_32px_64px_-12px_rgba(0,0,0,0.15)] max-w-lg w-full overflow-hidden border border-white/50"
      >
        <div className="p-10 text-center bg-indigo-600 text-white relative overflow-hidden">
          {/* Decorative Animated Shapes */}
          <motion.div 
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            className="absolute top-0 right-0 w-48 h-48 bg-white/10 rounded-[3rem] -mr-20 -mt-20 blur-2xl"
          ></motion.div>
          <motion.div 
            animate={{ rotate: -360 }}
            transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
            className="absolute bottom-0 left-0 w-32 h-32 bg-indigo-400/20 rounded-full -ml-12 -mb-12 blur-xl"
          ></motion.div>
          
          <div className="relative z-10">
            <h1 className="text-4xl font-black mb-3 tracking-tighter">GHAR BAZAR</h1>
            <p className="text-indigo-100 font-medium">Elevating real estate transactions with trust.</p>
          </div>
        </div>

        <div className="p-10 bg-white">
          <p className="text-gray-400 text-center mb-10 font-bold uppercase tracking-widest text-xs">Choose Your Experience</p>
          
          <div className="space-y-4">
            <motion.button
              whileHover={{ scale: 1.02, y: -4 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onSelectRole(UserRole.BUYER)}
              className="w-full flex items-center p-6 bg-gray-50 hover:bg-white hover:shadow-xl hover:shadow-indigo-100/50 border border-gray-100 hover:border-indigo-200 rounded-3xl transition-all group"
            >
              <div className="w-14 h-14 bg-indigo-100 rounded-2xl flex items-center justify-center text-indigo-600 mr-5 group-hover:bg-indigo-600 group-hover:text-white transition-all duration-300">
                <Search size={28} />
              </div>
              <div className="text-left flex-grow">
                <h3 className="font-black text-xl text-gray-800">Buyer / Tenant</h3>
                <p className="text-sm text-gray-400 font-medium mt-0.5">Find your dream space today.</p>
              </div>
              <div className="w-10 h-10 rounded-full bg-indigo-50 flex items-center justify-center group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                <ArrowRight size={20} />
              </div>
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.02, y: -4 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onSelectRole(UserRole.SELLER)}
              className="w-full flex items-center p-6 bg-gray-50 hover:bg-white hover:shadow-xl hover:shadow-emerald-100/50 border border-gray-100 hover:border-emerald-200 rounded-3xl transition-all group"
            >
              <div className="w-14 h-14 bg-emerald-100 rounded-2xl flex items-center justify-center text-emerald-600 mr-5 group-hover:bg-emerald-600 group-hover:text-white transition-all duration-300">
                <Building2 size={28} />
              </div>
              <div className="text-left flex-grow">
                <h3 className="font-black text-xl text-gray-800 flex items-center gap-2">
                  Seller / Owner <ShieldCheck size={18} className="text-emerald-500" />
                </h3>
                <p className="text-sm text-gray-400 font-medium mt-0.5">List, verify, and sell with ease.</p>
              </div>
              <div className="w-10 h-10 rounded-full bg-emerald-50 flex items-center justify-center group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                <ArrowRight size={20} />
              </div>
            </motion.button>

            <button 
              onClick={() => onSelectRole(UserRole.ADMIN)}
              className="w-full py-4 text-gray-400 text-[10px] font-black uppercase tracking-[0.2em] flex items-center justify-center gap-2 hover:text-indigo-600 transition-colors"
            >
              <Lock size={12} /> Admin Portal
            </button>
          </div>
          
          <div className="mt-8 flex flex-col items-center gap-4">
            <div className="flex gap-4 opacity-30 grayscale hover:grayscale-0 transition-all cursor-default text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">
              <span>Trusted By Top Banks</span>
              <span className="w-1 h-1 rounded-full bg-gray-300"></span>
              <span>100% Secured</span>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default LandingGatekeeper;
