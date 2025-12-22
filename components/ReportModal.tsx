
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { X, AlertCircle, ShieldAlert, Flag, Send, ChevronRight } from 'lucide-react';

interface Props {
  propertyId: string;
  onCancel: () => void;
  onSubmit: (reason: string, details: string) => void;
}

const REPORT_REASONS = [
  { id: 'fake', label: 'Fake Listing', icon: AlertCircle, desc: 'Property does not exist or photos are misleading.' },
  { id: 'price', label: 'Inaccurate Price', icon: Flag, desc: 'Asking price is significantly different from listed.' },
  { id: 'owner', label: 'Owner Unreachable', icon: ShieldAlert, desc: 'Multiple attempts to contact have failed.' },
  { id: 'fraud', label: 'Potential Fraud', icon: ShieldAlert, desc: 'Requesting advance payments or suspicious behavior.' },
  { id: 'other', label: 'Other Issue', icon: Send, desc: 'Reporting something else about this listing.' }
];

const ReportModal: React.FC<Props> = ({ propertyId, onCancel, onSubmit }) => {
  const [selectedReason, setSelectedReason] = useState<string | null>(null);
  const [details, setDetails] = useState('');

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9, y: 30 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="bg-white dark:bg-slate-950 w-full max-w-xl rounded-[3rem] overflow-hidden shadow-2xl border border-slate-100 dark:border-slate-800"
      >
        <div className="p-10 border-b border-slate-50 dark:border-slate-900 flex items-center justify-between">
          <div className="flex items-center gap-4">
             <div className="w-12 h-12 bg-rose-50 dark:bg-rose-900/30 text-rose-600 rounded-2xl flex items-center justify-center">
                <ShieldAlert size={24} />
             </div>
             <div>
               <h3 className="text-2xl font-black dark:text-white tracking-tight">Report Listing</h3>
               <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Security & Accuracy Desk</p>
             </div>
          </div>
          <button onClick={onCancel} className="p-3 text-slate-400 hover:text-rose-500 transition-colors">
            <X size={24} />
          </button>
        </div>

        <div className="p-10 space-y-6 max-h-[60vh] overflow-y-auto no-scrollbar">
          {!selectedReason ? (
            <div className="space-y-3">
              <p className="text-sm text-slate-500 dark:text-slate-400 font-medium mb-6">Please select the reason for reporting this property. Your report helps keep the marketplace safe.</p>
              {REPORT_REASONS.map((reason) => (
                <button
                  key={reason.id}
                  onClick={() => setSelectedReason(reason.label)}
                  className="w-full flex items-center gap-5 p-5 bg-slate-50 dark:bg-slate-900 border border-transparent rounded-[1.5rem] hover:border-rose-200 dark:hover:border-rose-900/50 hover:bg-white dark:hover:bg-slate-800 transition-all group"
                >
                  <div className="w-12 h-12 bg-white dark:bg-slate-800 rounded-xl flex items-center justify-center text-slate-400 group-hover:text-rose-500 transition-colors shadow-sm">
                    <reason.icon size={20} />
                  </div>
                  <div className="text-left flex-grow">
                    <h4 className="font-black text-slate-800 dark:text-white text-sm">{reason.label}</h4>
                    <p className="text-xs text-slate-400 font-medium">{reason.desc}</p>
                  </div>
                  <ChevronRight size={20} className="text-slate-300 group-hover:text-rose-500 transition-colors" />
                </button>
              ))}
            </div>
          ) : (
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
              <div className="flex items-center gap-2 text-rose-600 mb-6">
                <button onClick={() => setSelectedReason(null)} className="text-[10px] font-black uppercase tracking-widest hover:underline">Change Reason</button>
                <span className="text-slate-300">/</span>
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">{selectedReason}</span>
              </div>
              
              <div className="space-y-4">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 px-1">Additional Details (Optional)</label>
                <textarea
                  value={details}
                  onChange={(e) => setDetails(e.target.value)}
                  placeholder="Tell us more about what's wrong with this listing..."
                  className="w-full min-h-[160px] p-6 bg-slate-50 dark:bg-slate-900 border-none rounded-[1.5rem] text-sm font-bold dark:text-white outline-none focus:ring-4 focus:ring-rose-50 dark:focus:ring-rose-950/20 transition-all"
                />
              </div>

              <div className="p-5 bg-rose-50 dark:bg-rose-900/20 border border-rose-100 dark:border-rose-900/50 rounded-[1.5rem] flex items-start gap-3">
                 <AlertCircle size={18} className="text-rose-600 shrink-0" />
                 <p className="text-[10px] text-rose-800 dark:text-rose-400 font-black uppercase tracking-widest leading-relaxed">
                   Abuse of the reporting system may lead to account suspension. Ensure your report is accurate.
                 </p>
              </div>

              <button
                onClick={() => onSubmit(selectedReason, details)}
                className="w-full py-5 bg-rose-600 text-white rounded-[1.5rem] font-black uppercase text-[11px] tracking-widest shadow-2xl shadow-rose-100 dark:shadow-none hover:scale-105 active:scale-95 transition-all"
              >
                Submit Investigation Request
              </button>
            </motion.div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default ReportModal;
