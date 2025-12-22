
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Property, UserProfile, UserRole, Report } from '../types';
import { ShieldCheck, FileText, Check, X, ExternalLink, Clock, AlertTriangle, Users, LayoutDashboard, Trash2, Ban, UserCheck, Search, MapPin, MessageSquare, Reply, ThumbsUp, ThumbsDown } from 'lucide-react';

interface Props {
  properties: Property[];
  users: UserProfile[];
  reports: Report[];
  onVerify: (id: string, approved: boolean) => void;
  onOpenProperty: (p: Property) => void;
  onDeleteProperty: (id: string) => void;
  onBanUser: (userId: string) => void;
  onHandleReport: (reportId: string, status: 'resolved' | 'rejected', adminNote?: string) => void;
}

const AdminDashboard: React.FC<Props> = ({ properties, users, reports, onVerify, onOpenProperty, onDeleteProperty, onBanUser, onHandleReport }) => {
  const [activeTab, setActiveTab] = useState<'pending' | 'inventory' | 'users' | 'reports'>('pending');
  const [reportFilter, setReportFilter] = useState<'pending' | 'resolved' | 'rejected'>('pending');
  
  const pending = properties.filter(p => !p.verified);
  const live = properties.filter(p => p.verified);
  const filteredReports = reports.filter(r => r.status === reportFilter);

  return (
    <div className="min-h-screen bg-slate-50/50 dark:bg-slate-950/50 p-6 pt-24 pb-20">
      <div className="max-w-7xl mx-auto space-y-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-10">
          <div>
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] mb-4">
              <ShieldCheck size={14} /> System Governance
            </div>
            <h1 className="text-7xl font-black tracking-tighter dark:text-white leading-none">Admin Portal</h1>
            <p className="text-slate-500 font-bold uppercase text-xs tracking-widest mt-4">Security & Verification Gateway</p>
          </div>
          <div className="flex bg-white dark:bg-slate-900 p-2 rounded-[2rem] shadow-2xl border border-slate-100 dark:border-slate-800 overflow-x-auto no-scrollbar max-w-full">
            {[
              { id: 'pending', label: 'Approval Queue', icon: Clock },
              { id: 'inventory', label: 'Marketplace', icon: LayoutDashboard },
              { id: 'users', label: 'User Registry', icon: Users },
              { id: 'reports', label: 'Security Reports', icon: AlertTriangle }
            ].map(t => (
              <button 
                key={t.id} 
                onClick={() => setActiveTab(t.id as any)}
                className={`flex items-center gap-3 px-8 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${activeTab === t.id ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-100 dark:shadow-none' : 'text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'}`}
              >
                <t.icon size={18} /> {t.label}
              </button>
            ))}
          </div>
        </div>

        <AnimatePresence mode="wait">
          {activeTab === 'pending' && (
            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-8">
              <div className="flex items-center justify-between px-4">
                <h3 className="text-sm font-black uppercase text-slate-400 tracking-[0.3em]">Pending Verification ({pending.length})</h3>
              </div>
              
              {pending.length > 0 ? (
                pending.map(p => (
                  <motion.div layout key={p.id} className="bg-white dark:bg-slate-900 rounded-[3.5rem] border border-slate-100 dark:border-slate-800 overflow-hidden shadow-sm flex flex-col md:flex-row transition-all hover:shadow-2xl">
                    <div className="w-full md:w-80 h-60 md:h-auto overflow-hidden relative group cursor-pointer shrink-0" onClick={() => onOpenProperty(p)}>
                      <img src={p.imageUrl} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                      <div className="absolute inset-0 bg-slate-950/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all">
                        <span className="px-6 py-3 bg-white text-slate-950 rounded-2xl font-black text-[10px] uppercase tracking-widest flex items-center gap-2">Review Estate <ExternalLink size={14} /></span>
                      </div>
                    </div>
                    <div className="flex-grow p-10 flex flex-col md:flex-row justify-between gap-10">
                      <div className="space-y-4">
                        <h4 className="text-3xl font-black dark:text-white tracking-tight">{p.title}</h4>
                        <div className="flex items-center gap-2 text-slate-400 font-black text-[10px] uppercase tracking-widest">
                          <MapPin size={12} className="text-indigo-500"/> {p.location}
                        </div>
                        <div className="flex flex-wrap gap-3">
                          {p.legalDocs?.saleDeedUrl && <span className="px-4 py-2 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center gap-1.5 shadow-sm">Legal Deed <FileText size={14}/></span>}
                          {p.reported && <span className="px-4 py-2 bg-rose-50 dark:bg-rose-900/40 text-rose-600 dark:text-rose-400 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center gap-1.5 shadow-sm">Flagged <AlertTriangle size={14}/></span>}
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <button 
                          onClick={() => onVerify(p.id, true)} 
                          className="px-8 py-5 bg-emerald-500 text-white rounded-[1.5rem] font-black uppercase text-[10px] tracking-widest hover:bg-emerald-600 shadow-xl shadow-emerald-100 dark:shadow-none transition-all active:scale-95 flex items-center gap-3"
                        >
                          <ThumbsUp size={18}/> Approve Asset
                        </button>
                        <button 
                          onClick={() => { if(confirm('Are you sure you want to reject and remove this listing?')) onVerify(p.id, false); }} 
                          className="px-8 py-5 bg-rose-50 text-rose-500 rounded-[1.5rem] font-black uppercase text-[10px] tracking-widest hover:bg-rose-500 hover:text-white transition-all duration-300 flex items-center gap-3 shadow-xl shadow-rose-100 dark:shadow-none"
                        >
                          <ThumbsDown size={18}/> Reject Request
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))
              ) : (
                <div className="py-32 text-center bg-white dark:bg-slate-900 rounded-[3.5rem] border-2 border-dashed border-slate-100 dark:border-slate-800">
                  <Clock size={48} className="mx-auto text-slate-200 mb-6" />
                  <p className="text-xl font-black text-slate-800 dark:text-slate-200">Queue is Clear</p>
                  <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px] mt-2">No properties awaiting verification</p>
                </div>
              )}
            </motion.div>
          )}

          {activeTab === 'inventory' && (
            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-10">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-black uppercase text-slate-400 tracking-[0.3em]">Live Marketplace ({live.length})</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {live.map(p => (
                  <div key={p.id} className="bg-white dark:bg-slate-900 rounded-[2.5rem] p-6 border border-slate-100 dark:border-slate-800 flex items-center gap-6 group transition-all hover:shadow-2xl">
                    <img src={p.imageUrl} className="w-24 h-24 rounded-3xl object-cover shrink-0 shadow-lg" />
                    <div className="flex-grow min-w-0">
                      <h5 className="font-black text-lg dark:text-white truncate mb-1">{p.title}</h5>
                      <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mb-3">{p.location}</p>
                      <div className="flex gap-2">
                        <button onClick={() => onOpenProperty(p)} className="p-2.5 bg-slate-50 dark:bg-slate-800 text-slate-500 rounded-xl hover:text-indigo-600 transition-colors"><ExternalLink size={16} /></button>
                        <button onClick={() => onDeleteProperty(p.id)} className="p-2.5 bg-rose-50 text-rose-500 rounded-xl hover:bg-rose-500 hover:text-white transition-all"><Trash2 size={16} /></button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {activeTab === 'users' && (
            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-10">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-black uppercase text-slate-400 tracking-[0.3em]">Identity Registry ({users.length})</h3>
              </div>
              <div className="grid grid-cols-1 gap-6">
                {users.map(u => (
                  <div key={u.id} className="bg-white dark:bg-slate-900 rounded-[3rem] p-8 border border-slate-100 dark:border-slate-800 flex flex-col md:flex-row items-center justify-between gap-8 transition-all hover:shadow-2xl">
                    <div className="flex items-center gap-8">
                      <div className="relative">
                        <img src={u.avatar} className={`w-20 h-20 rounded-[2rem] border-4 shadow-xl object-cover ${u.isBanned ? 'border-rose-200 grayscale' : 'border-indigo-100 dark:border-slate-800'}`} />
                        {u.isVerified && <div className="absolute -top-2 -right-2 bg-indigo-600 text-white p-1.5 rounded-full shadow-lg"><ShieldCheck size={14} /></div>}
                      </div>
                      <div>
                        <h5 className="text-2xl font-black dark:text-white flex items-center gap-3">
                          {u.name} 
                          {u.isBanned && <span className="text-[10px] bg-rose-600 text-white px-3 py-1 rounded-lg uppercase tracking-widest">Suspended</span>}
                        </h5>
                        <p className="text-[11px] text-slate-400 font-black uppercase tracking-[0.2em] mt-1">{u.role} • {u.phone} • Member since 2024</p>
                      </div>
                    </div>
                    <div className="flex gap-4">
                      <button 
                        onClick={() => onBanUser(u.id)} 
                        className={`px-10 py-5 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all shadow-lg active:scale-95 flex items-center gap-3 ${u.isBanned ? 'bg-emerald-500 text-white shadow-emerald-100' : 'bg-rose-50 text-rose-600 hover:bg-rose-600 hover:text-white shadow-rose-100 dark:shadow-none'}`}
                      >
                        {u.isBanned ? <UserCheck size={18}/> : <Ban size={18}/>}
                        {u.isBanned ? 'Restore Account' : 'Suspend Access'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {activeTab === 'reports' && (
            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-10">
              <div className="flex items-center justify-between px-4">
                 <div className="flex gap-4">
                    {['pending', 'resolved', 'rejected'].map((s) => (
                      <button
                        key={s}
                        onClick={() => setReportFilter(s as any)}
                        className={`px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${reportFilter === s ? 'bg-rose-600 text-white shadow-lg' : 'bg-white dark:bg-slate-900 text-slate-400 border border-slate-100 dark:border-slate-800'}`}
                      >
                        {s}
                      </button>
                    ))}
                 </div>
                 <h3 className="text-sm font-black uppercase text-slate-400 tracking-[0.3em]">Security Incidents</h3>
              </div>

              {filteredReports.length > 0 ? (
                <div className="space-y-6">
                  {filteredReports.map(report => (
                    <div key={report.id} className="bg-white dark:bg-slate-900 p-10 rounded-[3rem] border border-slate-100 dark:border-slate-800 shadow-sm flex flex-col md:flex-row justify-between gap-10">
                       <div className="space-y-4 max-w-2xl">
                          <div className="flex items-center gap-3">
                             <span className="px-3 py-1 bg-rose-50 text-rose-600 rounded-lg text-[10px] font-black uppercase tracking-widest">{report.reason}</span>
                             <span className="text-slate-300">•</span>
                             <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Report ID: {report.id}</span>
                          </div>
                          <h4 className="text-2xl font-black dark:text-white tracking-tight">{report.propertyTitle}</h4>
                          <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed font-medium">"{report.details || 'No additional details provided.'}"</p>
                          <div className="flex items-center gap-6 mt-6">
                             <div className="flex items-center gap-2">
                                <Users size={14} className="text-indigo-600" />
                                <span className="text-[10px] font-black uppercase text-slate-400">By: {report.reporterName}</span>
                             </div>
                             <div className="flex items-center gap-2 text-indigo-600 cursor-pointer hover:underline" onClick={() => {
                               const p = properties.find(prop => prop.id === report.propertyId);
                               if (p) onOpenProperty(p);
                             }}>
                                <ExternalLink size={14} />
                                <span className="text-[10px] font-black uppercase">Inspect Estate</span>
                             </div>
                          </div>
                          {report.adminNote && (
                            <div className="mt-6 p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700">
                               <p className="text-[10px] font-black uppercase text-indigo-600 mb-1">Admin Response</p>
                               <p className="text-xs text-slate-600 dark:text-slate-300 font-medium italic">"{report.adminNote}"</p>
                            </div>
                          )}
                       </div>
                       
                       {report.status === 'pending' && (
                         <div className="flex items-center gap-4 shrink-0">
                            <button 
                              onClick={() => {
                                const note = prompt("Resolution Note (Optional):");
                                onHandleReport(report.id, 'resolved', note || undefined);
                              }}
                              className="px-8 py-4 bg-emerald-500 text-white rounded-2xl font-black uppercase text-[10px] tracking-widest hover:bg-emerald-600 transition-all flex items-center gap-2"
                            >
                               <Check size={16} /> Mark Resolved
                            </button>
                            <button 
                              onClick={() => {
                                const note = prompt("Reason for Rejection:");
                                onHandleReport(report.id, 'rejected', note || undefined);
                              }}
                              className="px-8 py-4 bg-rose-50 text-rose-500 rounded-2xl font-black uppercase text-[10px] tracking-widest hover:bg-rose-500 hover:text-white transition-all flex items-center gap-2"
                            >
                               <X size={16} /> Reject Report
                            </button>
                         </div>
                       )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-32 text-center bg-white dark:bg-slate-900 rounded-[3.5rem] border-2 border-dashed border-slate-100 dark:border-slate-800">
                   <ShieldCheck size={48} className="mx-auto text-slate-200 mb-6" />
                   <p className="text-xl font-black text-slate-800 dark:text-slate-200">No {reportFilter} reports</p>
                   <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px] mt-2">Marketplace security is currently stable.</p>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default AdminDashboard;
