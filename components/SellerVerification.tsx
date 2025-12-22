
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, Upload, Loader2, CheckCircle2 } from 'lucide-react';

interface Props {
  onVerify: () => void;
}

const SellerVerification: React.FC<Props> = ({ onVerify }) => {
  const [step, setStep] = useState(1);
  const [aadhar, setAadhar] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);

  const handleVerifyAadhar = async () => {
    if (aadhar.length !== 12) return alert('Enter a valid 12-digit Aadhar number');
    
    setIsVerifying(true);
    // Mock API Call for Aadhar Verification
    await new Promise(r => setTimeout(r, 2000));
    setIsVerifying(false);
    setStep(2);
  };

  const handleFinalSubmit = () => {
    onVerify();
  };

  return (
    <div className="max-w-2xl mx-auto py-12">
      <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100">
        <div className="p-8 bg-emerald-600 text-white">
          <div className="flex items-center gap-3 mb-4">
            <ShieldCheck size={32} />
            <h2 className="text-2xl font-bold">Seller Verification</h2>
          </div>
          <p className="opacity-90">GHAR BAZAR requires all sellers to be verified to maintain the highest trust standards in the marketplace.</p>
        </div>

        <div className="p-8">
          {step === 1 ? (
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
              <h3 className="text-lg font-bold mb-6">Step 1: Identity Verification</h3>
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2 uppercase tracking-wide">Aadhar Number (12 Digits)</label>
                  <input 
                    type="text" 
                    maxLength={12}
                    value={aadhar}
                    onChange={(e) => setAadhar(e.target.value.replace(/\D/g, ''))}
                    placeholder="0000 0000 0000"
                    className="w-full px-4 py-4 bg-gray-50 border border-gray-200 rounded-xl text-xl tracking-[0.2em] font-mono focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all"
                  />
                </div>
                
                <button 
                  onClick={handleVerifyAadhar}
                  disabled={isVerifying || aadhar.length !== 12}
                  className="w-full bg-emerald-600 text-white py-4 rounded-xl font-bold hover:bg-emerald-700 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {isVerifying ? <Loader2 className="animate-spin" /> : 'Verify Identity'}
                </button>
              </div>
            </motion.div>
          ) : (
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
              <div className="flex items-center gap-2 text-emerald-600 mb-6 font-bold">
                <CheckCircle2 size={20} /> Identity Verified
              </div>
              <h3 className="text-lg font-bold mb-6">Step 2: Property Ownership Proof</h3>
              <p className="text-gray-500 mb-8">Please upload a scan of your property tax receipt or registry documents.</p>
              
              <div className="border-2 border-dashed border-gray-200 rounded-3xl p-12 text-center hover:border-emerald-300 hover:bg-emerald-50 transition-all cursor-pointer">
                <Upload className="mx-auto text-gray-400 mb-4" size={48} />
                <p className="font-bold text-gray-700">Drop files here or click to upload</p>
                <p className="text-xs text-gray-400 mt-2 uppercase">PDF, JPG, PNG (Max 5MB)</p>
              </div>

              <div className="mt-12 flex gap-4">
                <button 
                  onClick={() => setStep(1)}
                  className="px-8 py-4 bg-gray-100 text-gray-600 rounded-xl font-bold hover:bg-gray-200 transition-all"
                >
                  Back
                </button>
                <button 
                  onClick={handleFinalSubmit}
                  className="flex-grow bg-emerald-600 text-white py-4 rounded-xl font-bold hover:bg-emerald-700 transition-all"
                >
                  Complete Verification
                </button>
              </div>
            </motion.div>
          )}
        </div>
      </div>
      
      <div className="mt-8 flex items-start gap-4 p-6 bg-amber-50 rounded-2xl border border-amber-100">
        <div className="p-2 bg-amber-100 rounded-lg text-amber-600">
          <ShieldCheck size={20} />
        </div>
        <div>
          <h4 className="font-bold text-amber-900 text-sm">Security Policy</h4>
          <p className="text-xs text-amber-700 mt-1">Your Aadhar details are encrypted and never stored on our servers. Verification is processed through a secure NPCI-integrated gateway.</p>
        </div>
      </div>
    </div>
  );
};

export default SellerVerification;
