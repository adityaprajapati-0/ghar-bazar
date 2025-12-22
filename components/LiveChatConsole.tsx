
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Mic, MicOff, Video, VideoOff, MessageSquare, Loader2, Sparkles, Volume2, Globe } from 'lucide-react';
import { GoogleGenAI, LiveServerMessage, Modality, Blob } from '@google/genai';

interface Props {
  onClose: () => void;
  isDarkMode: boolean;
}

const LiveChatConsole: React.FC<Props> = ({ onClose, isDarkMode }) => {
  const [connected, setConnected] = useState(false);
  const [isMicOn, setIsMicOn] = useState(true);
  const [isVideoOn, setIsVideoOn] = useState(false);
  const [transcriptions, setTranscriptions] = useState<{role: 'user' | 'model', text: string}[]>([]);
  const [currentInput, setCurrentInput] = useState('');
  const [currentOutput, setCurrentOutput] = useState('');

  const sessionRef = useRef<any>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const outAudioContextRef = useRef<AudioContext | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const sourcesRef = useRef<Set<AudioBufferSourceNode>>(new Set());
  const nextStartTimeRef = useRef<number>(0);
  const frameIntervalRef = useRef<number | null>(null);

  // Audio Processing Helpers
  function decode(base64: string) {
    const binaryString = atob(base64);
    const bytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes;
  }

  function encode(bytes: Uint8Array) {
    let binary = '';
    for (let i = 0; i < bytes.byteLength; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return btoa(binary);
  }

  async function decodeAudioData(data: Uint8Array, ctx: AudioContext, sampleRate: number, numChannels: number): Promise<AudioBuffer> {
    const dataInt16 = new Int16Array(data.buffer);
    const frameCount = dataInt16.length / numChannels;
    const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);
    for (let channel = 0; channel < numChannels; channel++) {
      const channelData = buffer.getChannelData(channel);
      for (let i = 0; i < frameCount; i++) {
        channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
      }
    }
    return buffer;
  }

  function createBlob(data: Float32Array): Blob {
    const int16 = new Int16Array(data.length);
    for (let i = 0; i < data.length; i++) {
      int16[i] = data[i] * 32768;
    }
    return {
      data: encode(new Uint8Array(int16.buffer)),
      mimeType: 'audio/pcm;rate=16000',
    };
  }

  const connectToLive = async () => {
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });
      
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
      outAudioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
      
      streamRef.current = await navigator.mediaDevices.getUserMedia({ 
        audio: true, 
        video: isVideoOn ? { width: 640, height: 480 } : false 
      });

      const sessionPromise = ai.live.connect({
        model: 'gemini-2.5-flash-native-audio-preview-09-2025',
        callbacks: {
          onopen: () => {
            setConnected(true);
            const source = audioContextRef.current!.createMediaStreamSource(streamRef.current!);
            const scriptProcessor = audioContextRef.current!.createScriptProcessor(4096, 1, 1);
            
            scriptProcessor.onaudioprocess = (e) => {
              if (!isMicOn) return;
              const inputData = e.inputBuffer.getChannelData(0);
              const pcmBlob = createBlob(inputData);
              sessionPromise.then(session => session.sendRealtimeInput({ media: pcmBlob }));
            };

            source.connect(scriptProcessor);
            scriptProcessor.connect(audioContextRef.current!.destination);

            // Video frames loop
            if (isVideoOn && videoRef.current) {
              frameIntervalRef.current = window.setInterval(() => {
                if (!canvasRef.current || !videoRef.current) return;
                const ctx = canvasRef.current.getContext('2d');
                if (!ctx) return;
                ctx.drawImage(videoRef.current, 0, 0, 640, 480);
                canvasRef.current.toBlob(async (blob) => {
                  if (blob) {
                    const reader = new FileReader();
                    reader.onloadend = () => {
                      const base64 = (reader.result as string).split(',')[1];
                      sessionPromise.then(s => s.sendRealtimeInput({ media: { data: base64, mimeType: 'image/jpeg' } }));
                    };
                    reader.readAsDataURL(blob);
                  }
                }, 'image/jpeg', 0.6);
              }, 1000);
            }
          },
          onmessage: async (message: LiveServerMessage) => {
            // Handle Audio
            const audioData = message.serverContent?.modelTurn?.parts[0]?.inlineData?.data;
            if (audioData && outAudioContextRef.current) {
              const ctx = outAudioContextRef.current;
              nextStartTimeRef.current = Math.max(nextStartTimeRef.current, ctx.currentTime);
              const buffer = await decodeAudioData(decode(audioData), ctx, 24000, 1);
              const source = ctx.createBufferSource();
              source.buffer = buffer;
              source.connect(ctx.destination);
              source.start(nextStartTimeRef.current);
              nextStartTimeRef.current += buffer.duration;
              sourcesRef.current.add(source);
              source.onended = () => sourcesRef.current.delete(source);
            }

            // Handle Interrupt
            if (message.serverContent?.interrupted) {
              sourcesRef.current.forEach(s => s.stop());
              sourcesRef.current.clear();
              nextStartTimeRef.current = 0;
            }

            // Handle Transcriptions
            // FIX: Use inputTranscription and outputTranscription instead of inputAudioTranscription and outputAudioTranscription on message.serverContent
            if (message.serverContent?.inputTranscription) {
              setCurrentInput(prev => prev + message.serverContent!.inputTranscription!.text);
            }
            if (message.serverContent?.outputTranscription) {
              setCurrentOutput(prev => prev + message.serverContent!.outputTranscription!.text);
            }
            if (message.serverContent?.turnComplete) {
              // FIX: Ensure role is explicitly typed as 'user' | 'model' to satisfy state interface and prevent type widening
              setTranscriptions(prev => {
                const next: { role: 'user' | 'model', text: string }[] = [...prev];
                if (currentInput.trim()) next.push({ role: 'user', text: currentInput });
                if (currentOutput.trim()) next.push({ role: 'model', text: currentOutput });
                return next;
              });
              setCurrentInput('');
              setCurrentOutput('');
            }
          },
          onclose: () => setConnected(false),
          onerror: (e) => console.error('Live API Error:', e)
        },
        config: {
          responseModalities: [Modality.AUDIO],
          speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Puck' } } },
          inputAudioTranscription: {},
          outputAudioTranscription: {},
          systemInstruction: "You are the GHAR BAZAR Virtual Assistant. You help users navigate real estate listings, explain property details, and provide market insights about the Indian housing market. Be professional, high-energy, and helpful."
        }
      });

      sessionRef.current = await sessionPromise;
    } catch (err) {
      console.error('Failed to connect to Live API:', err);
    }
  };

  useEffect(() => {
    connectToLive();
    return () => {
      sessionRef.current?.close();
      if (frameIntervalRef.current) clearInterval(frameIntervalRef.current);
      if (streamRef.current) streamRef.current.getTracks().forEach(t => t.stop());
    };
  }, []);

  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 md:p-10 bg-black/60 backdrop-blur-md">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9, y: 30 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className={`w-full max-w-4xl h-[85vh] rounded-[3rem] overflow-hidden flex flex-col shadow-2xl border ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-100'}`}
      >
        {/* Header */}
        <div className="p-8 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-4">
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${connected ? 'bg-emerald-500 text-white animate-pulse' : 'bg-slate-100 text-slate-400'}`}>
              <Sparkles size={24} />
            </div>
            <div>
              <h3 className="text-2xl font-black dark:text-white tracking-tight">GHAR BAZAR LIVE</h3>
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                {connected ? 'Real-time AI Sync Active' : 'Connecting to Neural Engine...'}
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-3 text-slate-400 hover:text-rose-500 transition-colors">
            <X size={28} />
          </button>
        </div>

        {/* Content Area */}
        <div className="flex-grow flex flex-col md:flex-row overflow-hidden">
          {/* Main Visual/Transcripts */}
          <div className="flex-grow overflow-y-auto p-8 no-scrollbar space-y-6 flex flex-col justify-end">
            <div className="space-y-4">
              {transcriptions.map((t, i) => (
                <div key={i} className={`flex ${t.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[80%] p-4 rounded-2xl text-sm font-medium ${t.role === 'user' ? 'bg-indigo-600 text-white' : 'bg-slate-100 dark:bg-slate-800 dark:text-white'}`}>
                    {t.text}
                  </div>
                </div>
              ))}
              {(currentInput || currentOutput) && (
                <div className={`flex ${currentInput ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[80%] p-4 rounded-2xl text-sm font-medium opacity-50 ${currentInput ? 'bg-indigo-600 text-white' : 'bg-slate-100 dark:bg-slate-800 dark:text-white'}`}>
                    {currentInput || currentOutput}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Side Panel: Video & Controls */}
          <div className="w-full md:w-80 bg-slate-50 dark:bg-slate-800/50 p-6 border-l border-slate-100 dark:border-slate-800 flex flex-col gap-6">
            <div className="aspect-video w-full bg-black rounded-3xl overflow-hidden shadow-inner relative">
              {isVideoOn ? (
                <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center text-slate-600">
                  <VideoOff size={40} className="mb-2 opacity-20" />
                  <span className="text-[10px] font-black uppercase tracking-widest">Camera Offline</span>
                </div>
              )}
              <canvas ref={canvasRef} width={640} height={480} className="hidden" />
              <div className="absolute bottom-2 right-2 px-2 py-1 bg-black/50 backdrop-blur-md rounded-lg flex items-center gap-1.5">
                <div className={`w-1.5 h-1.5 rounded-full ${connected ? 'bg-emerald-500 animate-pulse' : 'bg-slate-400'}`} />
                <span className="text-[8px] font-black text-white uppercase tracking-widest">LIVE</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <button 
                onClick={() => setIsMicOn(!isMicOn)}
                className={`p-5 rounded-2xl flex flex-col items-center justify-center gap-2 transition-all ${isMicOn ? 'bg-indigo-600 text-white shadow-lg' : 'bg-slate-200 dark:bg-slate-700 text-slate-500'}`}
              >
                {isMicOn ? <Mic size={24} /> : <MicOff size={24} />}
                <span className="text-[8px] font-black uppercase tracking-widest">{isMicOn ? 'Mute' : 'Unmute'}</span>
              </button>
              <button 
                onClick={() => {
                  setIsVideoOn(!isVideoOn);
                  // Refresh connection to toggle camera stream
                  setTimeout(() => connectToLive(), 100);
                }}
                className={`p-5 rounded-2xl flex flex-col items-center justify-center gap-2 transition-all ${isVideoOn ? 'bg-indigo-600 text-white shadow-lg' : 'bg-slate-200 dark:bg-slate-700 text-slate-500'}`}
              >
                {isVideoOn ? <Video size={24} /> : <VideoOff size={24} />}
                <span className="text-[8px] font-black uppercase tracking-widest">{isVideoOn ? 'Video Off' : 'Video On'}</span>
              </button>
            </div>

            <div className="mt-auto space-y-4">
              <div className="p-4 bg-indigo-50 dark:bg-indigo-900/20 rounded-2xl border border-indigo-100 dark:border-indigo-800">
                <div className="flex items-center gap-2 mb-2 text-indigo-600">
                  <Volume2 size={16} />
                  <span className="text-[10px] font-black uppercase tracking-widest">Voice Engine</span>
                </div>
                <p className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">Using Zephyr Neural Voice for natural conversation.</p>
              </div>
              <button className="w-full py-4 bg-slate-900 text-white rounded-2xl font-black uppercase text-[10px] tracking-widest flex items-center justify-center gap-2">
                <Globe size={14} /> Knowledge Graph Enabled
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default LiveChatConsole;
