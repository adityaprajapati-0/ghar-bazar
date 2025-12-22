
import React from 'react';
import { Building2, Facebook, Twitter, Instagram, Linkedin, Mail, Phone, MapPin } from 'lucide-react';
import { motion } from 'framer-motion';

const Footer: React.FC = () => {
  return (
    <footer className="w-full bg-white dark:bg-slate-950 border-t border-slate-100 dark:border-slate-900 pt-20 pb-10 px-4 md:px-10">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 mb-20">
          {/* Brand Section */}
          <div className="space-y-6">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
                <Building2 size={20} className="text-white" />
              </div>
              <div className="flex flex-col leading-none">
                <span className="font-black text-xl tracking-tighter dark:text-white uppercase">GHAR <span className="text-indigo-600">BAZAR</span></span>
                <span className="text-[8px] font-black uppercase tracking-[0.4em] text-slate-400">Premium Realty</span>
              </div>
            </div>
            <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed font-medium">
              India's most trusted marketplace for premium real estate. We combine AI-driven discovery with absolute transparency to redefine how you find your next home.
            </p>
            <div className="flex gap-4">
              {[Facebook, Twitter, Instagram, Linkedin].map((Icon, i) => (
                <button key={i} className="w-10 h-10 bg-slate-50 dark:bg-slate-900 rounded-xl flex items-center justify-center text-slate-400 hover:bg-indigo-600 hover:text-white transition-all shadow-sm">
                  <Icon size={18} />
                </button>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-900 dark:text-white mb-8">Navigation</h4>
            <ul className="space-y-4">
              {['Marketplace', 'Premium Map', 'Verification Flow', 'Agent Console', 'Investment Hub'].map(link => (
                <li key={link}>
                  <button className="text-sm text-slate-500 dark:text-slate-400 font-bold hover:text-indigo-600 transition-colors uppercase tracking-widest text-[11px]">
                    {link}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-900 dark:text-white mb-8">Governance</h4>
            <ul className="space-y-4">
              {['Security Policy', 'Legal Docs', 'Dispute Resolution', 'Trust Badge', 'Privacy Vault'].map(link => (
                <li key={link}>
                  <button className="text-sm text-slate-500 dark:text-slate-400 font-bold hover:text-indigo-600 transition-colors uppercase tracking-widest text-[11px]">
                    {link}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-900 dark:text-white mb-8">Headquarters</h4>
            <ul className="space-y-6">
              <li className="flex items-start gap-4">
                <MapPin size={18} className="text-indigo-600 shrink-0" />
                <span className="text-sm text-slate-500 dark:text-slate-400 font-medium">Level 12, World Trade Centre, Cuffe Parade, Mumbai 400005</span>
              </li>
              <li className="flex items-center gap-4">
                <Mail size={18} className="text-indigo-600 shrink-0" />
                <span className="text-sm text-slate-500 dark:text-slate-400 font-medium">concierge@gharbazar.in</span>
              </li>
              <li className="flex items-center gap-4">
                <Phone size={18} className="text-indigo-600 shrink-0" />
                <span className="text-sm text-slate-500 dark:text-slate-400 font-medium">+91 22 4000 9000</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-10 border-t border-slate-100 dark:border-slate-900 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
            © 2025 GHAR BAZAR Premium Estates. All Rights Reserved.
          </p>
          <div className="flex gap-8">
             <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">RERA Registered</span>
             <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">ISO 27001 Certified</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
