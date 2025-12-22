
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { X, CreditCard, Smartphone, CheckCircle, Lock } from 'lucide-react';

interface Props {
  onClose: () => void;
  // Added onComplete prop to match usage in App.tsx and fix type error
  onComplete?: () => void;
}

const PaymentModal: React.FC<Props> = ({ onClose, onComplete }) => {
  const [status, setStatus] = useState<'idle' | 'processing' | 'success'>('idle');

  const handlePay = () => {
    setStatus('processing');
    setTimeout(() => setStatus('success'), 2000);
  };

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center p-4 bg-black/70 backdrop-blur-md">
      <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-white dark:bg-gray-900 rounded-[3rem] w-full max-w-md overflow-hidden p-10 relative">
        <button onClick={onClose} className="absolute top-8 right-8 text-gray-400 hover:text-gray-600"><X size={24} /></button>

        {status === 'success' ? (
          <div className="text-center py-10">
            <div className="w-24 h-24 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600 mx-auto mb-8">
              <CheckCircle size={48} />
            </div>
            <h2 className="text-3xl font-black mb-4">Payment Success</h2>
            <p className="text-gray-500 mb-8">Brokerage fee of 0.5% processed successfully. Booking confirmed.</p>
            {/* Use onComplete if provided, otherwise fallback to onClose to finish the flow */}
            <button onClick={onComplete || onClose} className="w-full bg-emerald-600 text-white py-4 rounded-2xl font-bold shadow-xl shadow-emerald-100">Done</button>
          </div>
        ) : (
          <div>
            <h2 className="text-3xl font-black mb-2 tracking-tighter">Secure Checkout</h2>
            <p className="text-gray-400 text-xs font-bold uppercase tracking-widest mb-8">Convenience Fee: 0.5%</p>
            
            <div className="space-y-4 mb-10">
              <button onClick={handlePay} disabled={status === 'processing'} className="w-full flex items-center gap-4 p-5 border-2 border-indigo-50 rounded-2xl hover:bg-indigo-50 transition-all text-left group">
                <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center text-indigo-600"><Smartphone size={24} /></div>
                <div>
                  <p className="font-bold">UPI / GPay / PhonePe</p>
                  <p className="text-xs text-gray-400">Fast and secure mobile payment</p>
                </div>
              </button>
              <button onClick={handlePay} disabled={status === 'processing'} className="w-full flex items-center gap-4 p-5 border-2 border-gray-50 rounded-2xl hover:bg-gray-50 transition-all text-left">
                <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center text-gray-400"><CreditCard size={24} /></div>
                <div>
                  <p className="font-bold">Credit / Debit Card</p>
                  <p className="text-xs text-gray-400">All major cards supported</p>
                </div>
              </button>
            </div>

            <div className="flex items-center justify-center gap-2 text-gray-400 text-[10px] font-bold uppercase tracking-[0.2em]">
              <Lock size={12} /> SSL Secured Payment Gateway
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default PaymentModal;
