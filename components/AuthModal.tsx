
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Phone, Loader2, CheckCircle2, Mail, Chrome } from 'lucide-react';
import { UserRole, UserProfile } from '../types';

interface Props {
  onCancel: () => void;
  onSuccess: (user: UserProfile) => void;
  role: UserRole;
}

const AuthModal: React.FC<Props> = ({ onCancel, onSuccess, role }) => {
  const [step, setStep] = useState(1);
  const [isSigningIn, setIsSigningIn] = useState(false);
  const [phone, setPhone] = useState('');
  const [mockGoogleProfile, setMockGoogleProfile] = useState<{ name: string; avatar: string } | null>(null);

  const handleGoogleMock = () => {
    setIsSigningIn(true);
    // Simulate Google OAuth Popup & Authentication
    setTimeout(() => {
      setMockGoogleProfile({
        name: 'Aditya Sharma',
        avatar: 'https://i.pravatar.cc/150?u=aditya'
      });
      setIsSigningIn(false);
      setStep(2); // Proceed to mandatory phone step
    }, 1500);
  };

  const handleFinish = () => {
    if (phone.length < 10) return alert('Enter a valid 10-digit mobile number');
    
    onSuccess({
      id: 'usr_' + Math.random().toString(36).substr(2, 9),
      name: mockGoogleProfile?.name || 'New User',
      avatar: mockGoogleProfile?.avatar || `https://i.pravatar.cc/150?u=${phone}`,
      phone: phone,
      isVerified: true,
      role: role,
      savedProperties: [],
      likedProperties: []
    });
  };

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9, y: 20 }} 
        animate={{ opacity: 1, scale: 1, y: 0 }} 
        className="bg-white rounded-[2.5rem] w-full max-w-md overflow-hidden relative shadow-2xl"
      >
        <button 
          onClick={onCancel} 
          className="absolute top-6 right-6 p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-all"
        >
          <X size={20} />
        </button>
        
        <div className="p-10">
          <AnimatePresence mode="wait">
            {step === 1 ? (
              <motion.div 
                key="step1"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="text-center"
              >
                <div className="w-16 h-16 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600 mx-auto mb-6">
                  <Mail size={32} />
                </div>
                <h2 className="text-3xl font-black mb-2 tracking-tight">Welcome to GHAR BAZAR</h2>
                <p className="text-gray-500 mb-10 font-medium">Connect with verified owners and buyers instantly.</p>
                
                <button 
                  onClick={handleGoogleMock} 
                  disabled={isSigningIn}
                  className="w-full flex items-center justify-center gap-3 border-2 border-gray-100 py-4 rounded-2xl font-bold hover:bg-gray-50 hover:border-gray-200 transition-all mb-4 group relative overflow-hidden"
                >
                  {isSigningIn ? (
                    <Loader2 className="animate-spin text-indigo-600" size={20} />
                  ) : (
                    <>
                      <img src="https://www.gstatic.com/images/branding/product/1x/gsa_512dp.png" className="w-5 h-5" alt="Google" />
                      <span className="text-gray-700">Continue with Google</span>
                    </>
                  )}
                </button>
                
                <div className="flex items-center gap-4 my-8">
                  <div className="h-px bg-gray-100 flex-grow"></div>
                  <span className="text-[10px] font-black text-gray-300 uppercase tracking-[0.2em]">Secure Gateway</span>
                  <div className="h-px bg-gray-100 flex-grow"></div>
                </div>

                <div className="space-y-4">
                  <div className="text-left">
                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 px-1 mb-2 block">Email Address</label>
                    <input 
                      type="email" 
                      placeholder="e.g. aditya@example.com" 
                      className="w-full px-5 py-4 bg-gray-50 border border-transparent rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all" 
                    />
                  </div>
                  <button className="w-full bg-gray-900 text-white py-4 rounded-2xl font-bold shadow-xl shadow-gray-200 hover:bg-gray-800 transition-all">
                    Continue
                  </button>
                </div>

                <p className="mt-8 text-[10px] text-gray-400 font-medium leading-relaxed">
                  By continuing, you agree to our <span className="underline cursor-pointer">Terms of Service</span> and <span className="underline cursor-pointer">Privacy Policy</span>.
                </p>
              </motion.div>
            ) : (
              <motion.div 
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <div className="flex items-center gap-4 mb-8 p-4 bg-emerald-50 rounded-2xl border border-emerald-100">
                  <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-emerald-600 shadow-sm shrink-0">
                    <CheckCircle2 size={24} />
                  </div>
                  <div>
                    <h4 className="font-bold text-emerald-900 text-sm">Authenticated</h4>
                    <p className="text-xs text-emerald-700">Signed in as {mockGoogleProfile?.name}</p>
                  </div>
                </div>

                <h2 className="text-2xl font-black mb-2 tracking-tight">Mobile Verification</h2>
                <p className="text-gray-500 mb-8 font-medium">Verify your number to enable direct calls and secure chats with property owners.</p>
                
                <div className="space-y-6">
                  <div className="relative">
                    <div className="absolute left-5 top-1/2 -translate-y-1/2 flex items-center gap-2 border-r border-gray-200 pr-3">
                      <img src="https://flagcdn.com/w20/in.png" className="w-4 h-3 rounded-sm" alt="India" />
                      <span className="font-bold text-gray-400">+91</span>
                    </div>
                    <input 
                      type="tel" 
                      value={phone}
                      onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                      placeholder="Mobile Number" 
                      className="w-full pl-24 pr-5 py-4 bg-gray-50 rounded-2xl outline-none focus:ring-2 focus:ring-emerald-500 text-lg font-bold tracking-[0.1em] focus:bg-white transition-all" 
                    />
                  </div>
                  
                  <div className="flex items-start gap-3 p-4 bg-indigo-50/50 rounded-2xl border border-indigo-50">
                    <Phone className="text-indigo-400 shrink-0" size={16} />
                    <p className="text-[10px] text-indigo-600 font-bold uppercase tracking-widest leading-relaxed">
                      Compulsory for secure transactions & spam prevention
                    </p>
                  </div>

                  <button 
                    onClick={handleFinish} 
                    className="w-full bg-indigo-600 text-white py-4 rounded-2xl font-bold shadow-xl shadow-indigo-100 hover:bg-indigo-700 transition-all active:scale-[0.98]"
                  >
                    Complete Profile
                  </button>

                  <button 
                    onClick={() => setStep(1)}
                    className="w-full py-2 text-xs font-bold text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    Use a different account
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
};

export default AuthModal;
