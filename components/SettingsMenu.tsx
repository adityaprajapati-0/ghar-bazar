
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Moon, Shield, Lock, Accessibility, Sun, ChevronRight, Languages, BellRing, Package, EyeOff, ArrowLeft, Key, Smartphone, Fingerprint, RefreshCcw, Check, UserCircle, Plus, Trash2, Settings, Landmark, UserPlus, Briefcase } from 'lucide-react';
import { UserRole } from '../types';

interface Props {
  role: UserRole;
  onClose: () => void;
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
  highContrast: boolean;
  onToggleContrast: () => void;
  allowNotifications: boolean;
  onToggleNotifications: () => void;
  privacyMode: boolean;
  onTogglePrivacy: () => void;
  twoFactor: boolean;
  onToggleTwoFactor: () => void;
  onOpenOrders: () => void;
  language: string;
  onSetLanguage: (lang: string) => void;
}

type SubmenuView = 'main' | 'vault' | '2fa' | 'language';

const SettingsMenu: React.FC<Props> = ({ 
  role, onClose, isDarkMode, onToggleDarkMode, highContrast, onToggleContrast,
  allowNotifications, onToggleNotifications, privacyMode, onTogglePrivacy,
  twoFactor, onToggleTwoFactor, onOpenOrders, language, onSetLanguage
}) => {
  const [activeView, setActiveView] = useState<SubmenuView>('main');
  const [vaultCode, setVaultCode] = useState('');
  const [storedPin, setStoredPin] = useState(() => localStorage.getItem('vaultPin') || '1234');
  const [isVaultUnlocked, setIsVaultUnlocked] = useState(false);
  const [isSettingPin, setIsSettingPin] = useState(false);
  const [newPin, setNewPin] = useState('');
  const [vaultDocs, setVaultDocs] = useState(['SaleDeed_Final_v2.pdf', 'Society_NOC_Worli.pdf']);

  const languages = [
    'English (India)', 'हिन्दी (Hindi)', 'मराठी (Marathi)', 'ગુજરાती (Gujarati)', 
    'தமிழ் (Tamil)', 'తెలుగు (Telugu)', 'Español', 'Français'
  ];

  const handleVaultAccess = () => {
    if (vaultCode === storedPin) setIsVaultUnlocked(true);
    else alert('Access Denied: Incorrect Security Pin.');
  };

  const handleSavePin = () => {
    if (newPin.length === 4) {
      setStoredPin(newPin);
      localStorage.setItem('vaultPin', newPin);
      setIsSettingPin(false);
      setNewPin('');
      alert('Security PIN updated.');
    }
  };

  const renderBackBtn = () => (
    <button onClick={() => { setActiveView('main'); setIsVaultUnlocked(false); setIsSettingPin(false); }} className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-indigo-600 mb-8 hover:translate-x-[-4px] transition-transform">
      <ArrowLeft size={16} /> Return to Settings
    </button>
  );

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-5xl mx-auto py-12 px-4 pb-32">
      <div className="flex items-center justify-between mb-16">
        <div>
          <h2 className="text-6xl font-black tracking-tighter mb-3 dark:text-white">
            {activeView === 'main' ? 'Settings' : activeView.toUpperCase()}
          </h2>
          <p className="text-slate-500 font-bold uppercase text-[10px] tracking-[0.4em]">
            {role} • Marketplace Preferences
          </p>
        </div>
        <button onClick={onClose} className="p-5 bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-xl border border-slate-100 dark:border-slate-800 hover:scale-110 active:scale-90">
          <X size={28} className="text-slate-400" />
        </button>
      </div>

      <AnimatePresence mode="wait">
        {activeView === 'main' && (
          <motion.div key="main" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-16">
            {/* Display Section */}
            <div>
              <div className="flex items-center gap-6 mb-10"><h3 className="text-[10px] font-black uppercase text-indigo-600 dark:text-indigo-400 tracking-[0.4em] whitespace-nowrap">Display & Experience</h3><div className="h-[2px] bg-slate-100 dark:bg-slate-800 flex-grow rounded-full"></div></div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <SettingItem icon={isDarkMode ? Sun : Moon} label="Appearance" desc={isDarkMode ? 'Dark theme active' : 'Light theme active'} toggle value={isDarkMode} action={onToggleDarkMode} />
                <SettingItem icon={Languages} label="Language" desc={language} action={() => setActiveView('language')} />
              </div>
            </div>

            {/* Role-Specific Section */}
            <div>
              <div className="flex items-center gap-6 mb-10"><h3 className="text-[10px] font-black uppercase text-indigo-600 dark:text-indigo-400 tracking-[0.4em] whitespace-nowrap">{role === UserRole.SELLER ? 'Business & Identity' : 'Discovery & Alerts'}</h3><div className="h-[2px] bg-slate-100 dark:bg-slate-800 flex-grow rounded-full"></div></div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {role === UserRole.SELLER ? (
                  <>
                    <SettingItem icon={Briefcase} label="Agency Profile" desc="Manage business credentials" action={() => alert('Profile updated')} />
                    <SettingItem icon={Landmark} label="Banking Details" desc="Payouts for brokerage & sales" action={() => alert('KYC required')} />
                  </>
                ) : (
                  <>
                    <SettingItem icon={Package} label="My Bookings" desc="Property visit schedule" action={onOpenOrders} />
                    <SettingItem icon={UserPlus} label="Invite Friends" desc="Earn rewards on referrals" action={() => {}} />
                  </>
                )}
              </div>
            </div>

            {/* Safety Section */}
            <div>
              <div className="flex items-center gap-6 mb-10"><h3 className="text-[10px] font-black uppercase text-indigo-600 dark:text-indigo-400 tracking-[0.4em] whitespace-nowrap">Privacy & Safety</h3><div className="h-[2px] bg-slate-100 dark:bg-slate-800 flex-grow rounded-full"></div></div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <SettingItem icon={Shield} label="Privacy Vault" desc="Secure property documents" action={() => setActiveView('vault')} />
                <SettingItem icon={Lock} label="Two-Factor Auth" desc={twoFactor ? 'Active' : 'Enable OTP Layer'} toggle value={twoFactor} action={onToggleTwoFactor} />
              </div>
            </div>
          </motion.div>
        )}

        {/* Vault Submenu */}
        {activeView === 'vault' && (
          <motion.div key="vault" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}>
            {renderBackBtn()}
            <div className="bg-white dark:bg-slate-900 rounded-[3rem] p-12 border border-slate-100 dark:border-slate-800 shadow-xl max-w-2xl mx-auto">
              {!isVaultUnlocked ? (
                <div className="text-center">
                  <div className="w-24 h-24 bg-slate-50 dark:bg-slate-800 rounded-full flex items-center justify-center text-slate-400 mx-auto mb-8"><Key size={40} /></div>
                  <h3 className="text-3xl font-black mb-4 dark:text-white">Unlock Vault</h3>
                  <p className="text-slate-500 font-medium mb-10">Enter PIN to access documents.</p>
                  <input type="password" maxLength={4} value={vaultCode} onChange={(e) => setVaultCode(e.target.value)} placeholder="••••" className="w-48 text-center text-4xl font-black bg-slate-50 dark:bg-slate-800 border-none rounded-2xl p-4 dark:text-white mb-8" />
                  <button onClick={handleVaultAccess} className="w-full bg-indigo-600 text-white py-5 rounded-2xl font-black uppercase tracking-widest hover:scale-105 transition-all shadow-xl">Decrypt Files</button>
                </div>
              ) : (
                <div>
                   <div className="flex justify-between items-center mb-10">
                      <h4 className="text-2xl font-black dark:text-white">Secure Files</h4>
                      <button onClick={() => setIsSettingPin(true)} className="p-3 bg-indigo-50 text-indigo-600 rounded-xl hover:bg-indigo-600 hover:text-white transition-all"><Settings size={20} /></button>
                   </div>
                   {isSettingPin ? (
                     <div className="space-y-6">
                        <input type="password" maxLength={4} value={newPin} onChange={(e) => setNewPin(e.target.value)} placeholder="Enter New 4-Digit PIN" className="w-full bg-slate-50 dark:bg-slate-800 p-5 rounded-2xl text-center text-2xl font-black" />
                        <div className="flex gap-4">
                          <button onClick={() => setIsSettingPin(false)} className="flex-grow py-4 bg-slate-100 rounded-2xl font-bold">Cancel</button>
                          <button onClick={handleSavePin} className="flex-grow py-4 bg-indigo-600 text-white rounded-2xl font-bold">Save PIN</button>
                        </div>
                     </div>
                   ) : (
                     <div className="space-y-4">
                        {vaultDocs.map((doc, idx) => (
                          <div key={idx} className="flex items-center justify-between p-6 bg-slate-50 dark:bg-slate-800 rounded-2xl group">
                            <div className="flex items-center gap-4"><Shield size={20} className="text-indigo-600" /><span className="font-bold text-slate-700 dark:text-slate-300">{doc}</span></div>
                            <button onClick={() => setVaultDocs(vaultDocs.filter((_, i) => i !== idx))} className="text-slate-300 hover:text-rose-500 transition-colors"><Trash2 size={18} /></button>
                          </div>
                        ))}
                        <button onClick={() => { const name = prompt('File Name:'); if(name) setVaultDocs([...vaultDocs, name + '.pdf']) }} className="w-full mt-4 py-4 border-2 border-dashed border-slate-100 dark:border-slate-800 text-slate-400 font-bold uppercase text-[10px] tracking-widest rounded-2xl hover:bg-slate-50 transition-colors">Add Document</button>
                     </div>
                   )}
                </div>
              )}
            </div>
          </motion.div>
        )}

        {/* Language Submenu */}
        {activeView === 'language' && (
          <motion.div key="language" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}>
            {renderBackBtn()}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {languages.map(lang => (
                <div key={lang} onClick={() => onSetLanguage(lang)} className={`p-10 rounded-[2.5rem] border transition-all cursor-pointer flex items-center justify-between group ${language === lang ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-950/20' : 'border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-indigo-300'}`}>
                   <div className="flex items-center gap-6">
                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-colors ${language === lang ? 'bg-indigo-600 text-white' : 'bg-slate-50 dark:bg-slate-800 text-slate-400'}`}><UserCircle size={24} /></div>
                    <span className={`text-xl font-black ${language === lang ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-600 dark:text-slate-300'}`}>{lang}</span>
                  </div>
                  {language === lang && <div className="w-10 h-10 bg-indigo-600 text-white rounded-full flex items-center justify-center shadow-lg"><Check size={20} /></div>}
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

const SettingItem: React.FC<any> = ({ icon: Icon, label, desc, toggle, value, action }) => (
  <motion.div onClick={action} className="p-10 bg-white dark:bg-slate-900 rounded-[3.5rem] border border-slate-100 dark:border-slate-800 flex items-center gap-10 cursor-pointer shadow-sm hover:shadow-2xl transition-all duration-500 group">
    <div className="w-20 h-20 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-3xl flex items-center justify-center shrink-0 group-hover:scale-110 transition-all shadow-inner"><Icon size={36} /></div>
    <div className="flex-grow"><h4 className="font-black text-2xl mb-1.5 dark:text-white group-hover:text-indigo-600 transition-colors">{label}</h4><p className="text-slate-400 font-bold uppercase tracking-widest text-[9px] leading-relaxed">{desc}</p></div>
    {toggle ? (
      <div className={`w-16 h-10 rounded-full p-1.5 transition-all duration-500 ${value ? 'bg-indigo-600' : 'bg-slate-100 dark:bg-slate-800'}`}>
        <motion.div animate={{ x: value ? 24 : 0 }} className="w-7 h-7 bg-white rounded-full shadow-md" />
      </div>
    ) : <div className="w-12 h-12 rounded-2xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-slate-300"><ChevronRight size={20} /></div>}
  </motion.div>
);

export default SettingsMenu;
