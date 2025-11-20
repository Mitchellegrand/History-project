import React, { useState, useEffect, useRef } from 'react';
import { HistoryEvent } from '../types';
import { X, Bot, BookOpen, ExternalLink, Volume2, Play, Square, Image as ImageIcon, Wand2, Loader2 } from 'lucide-react';
import { generateExplanation, generateEventAudio, generateEventImage, editEventImage } from '../services/geminiService';
import { motion } from 'framer-motion';

interface DetailPanelProps {
  event: HistoryEvent | null;
  onClose: () => void;
}

export const DetailPanel: React.FC<DetailPanelProps> = ({ event, onClose }) => {
  const [aiExplanation, setAiExplanation] = useState<string | null>(null);
  const [loadingAi, setLoadingAi] = useState(false);
  
  // Audio State
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [loadingAudio, setLoadingAudio] = useState(false);
  const audioContextRef = useRef<AudioContext | null>(null);
  const audioSourceRef = useRef<AudioBufferSourceNode | null>(null);

  // Image State
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [loadingImage, setLoadingImage] = useState(false);
  const [editPrompt, setEditPrompt] = useState('');
  const [showEditInput, setShowEditInput] = useState(false);

  // Reset state when event changes
  useEffect(() => {
    setAiExplanation(null);
    setGeneratedImage(null);
    stopAudio(); 
    setShowEditInput(false);
    setEditPrompt('');
    
    // Auto-generate image on open
    if (event) {
        handleGenerateImage(event);
    }
  }, [event]);

  useEffect(() => {
    return () => {
        stopAudio();
    }
  }, []);

  const stopAudio = () => {
    if (audioSourceRef.current) {
        try {
            audioSourceRef.current.stop();
        } catch (e) {
            // ignore
        }
        audioSourceRef.current = null;
    }
    setIsPlayingAudio(false);
  };

  const handlePlayAudio = async () => {
    if (isPlayingAudio) {
        stopAudio();
        return;
    }

    if (!event) return;
    setLoadingAudio(true);

    try {
        const audioBuffer = await generateEventAudio(`${event.title}. ${event.description}`);
        if (audioBuffer) {
            if (!audioContextRef.current) {
                audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
            }
            
            // Create source
            const source = audioContextRef.current.createBufferSource();
            source.buffer = audioBuffer;
            source.connect(audioContextRef.current.destination);
            source.onended = () => setIsPlayingAudio(false);
            
            audioSourceRef.current = source;
            source.start();
            setIsPlayingAudio(true);
        }
    } catch (e) {
        console.error("Audio play failed", e);
    } finally {
        setLoadingAudio(false);
    }
  };

  const handleGenerateImage = async (targetEvent: HistoryEvent) => {
      setLoadingImage(true);
      const image = await generateEventImage(`${targetEvent.title}, ${targetEvent.year}. ${targetEvent.description}`);
      if (image) setGeneratedImage(image);
      setLoadingImage(false);
  };

  const handleEditImage = async () => {
      if (!generatedImage || !editPrompt.trim()) return;
      setLoadingImage(true);
      const newImage = await editEventImage(generatedImage, editPrompt);
      if (newImage) {
          setGeneratedImage(newImage);
          setEditPrompt('');
          setShowEditInput(false);
      }
      setLoadingImage(false);
  };

  const handleAskAI = async () => {
    if (!event) return;
    setLoadingAi(true);
    const explanation = await generateExplanation(event.title, event.description + " " + event.details.join(" "));
    setAiExplanation(explanation);
    setLoadingAi(false);
  };

  if (!event) return null;

  return (
    <motion.div 
        initial={{ x: '100%' }}
        animate={{ x: 0 }}
        exit={{ x: '100%' }}
        className="absolute right-0 top-0 h-full w-full md:w-[600px] bg-slate-900/95 backdrop-blur-xl border-l border-slate-700 text-slate-100 shadow-2xl z-50 flex flex-col"
    >
      <div className="p-6 border-b border-slate-700 flex justify-between items-start bg-gradient-to-r from-slate-900 to-slate-800">
        <div className="flex-1 pr-4">
            <div className="flex items-center justify-between mb-2">
                <span className="inline-block px-2 py-1 rounded-full bg-slate-800 text-xs font-mono text-slate-400 border border-slate-700">
                    {event.category}
                </span>
                
                <button 
                    onClick={handlePlayAudio}
                    disabled={loadingAudio}
                    className={`flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold transition-all ${isPlayingAudio ? 'bg-red-500/20 text-red-400 border border-red-500/50 animate-pulse' : 'bg-amber-500/20 text-amber-400 border border-amber-500/50 hover:bg-amber-500/30'}`}
                >
                    {loadingAudio ? (
                        <Loader2 size={12} className="animate-spin" />
                    ) : isPlayingAudio ? (
                        <><Square size={12} fill="currentColor" /> Stop</>
                    ) : (
                        <><Volume2 size={14} /> Listen</>
                    )}
                </button>
            </div>
            <h2 className="text-3xl font-bold serif-font text-amber-400 leading-tight">{event.title}</h2>
            <p className="text-xl text-slate-400 mt-1 font-light">{event.dateDisplay || event.year}</p>
        </div>
        <button onClick={onClose} className="p-2 hover:bg-slate-800 rounded-full transition-colors text-slate-400 hover:text-white">
          <X size={24} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar p-6 space-y-6">
        
        {/* Image Generation Section */}
        <div className="aspect-video w-full rounded-xl overflow-hidden relative group bg-black border border-slate-700 shadow-lg">
             {loadingImage ? (
                 <div className="w-full h-full flex flex-col items-center justify-center text-amber-500 gap-3">
                     <Wand2 size={32} className="animate-spin" />
                     <span className="text-sm font-mono">Generating historical visualization...</span>
                 </div>
             ) : generatedImage ? (
                 <>
                    <img 
                        src={generatedImage} 
                        alt="AI Generated Historical Scene" 
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button 
                            onClick={() => setShowEditInput(!showEditInput)}
                            className="bg-black/70 backdrop-blur text-white px-3 py-1 rounded-lg text-xs border border-white/20 hover:bg-black/90 flex items-center gap-2"
                        >
                            <Wand2 size={12} /> Edit Image
                        </button>
                    </div>
                    {showEditInput && (
                        <div className="absolute bottom-0 left-0 right-0 p-3 bg-black/80 backdrop-blur border-t border-white/10">
                            <div className="flex gap-2">
                                <input 
                                    type="text" 
                                    value={editPrompt}
                                    onChange={(e) => setEditPrompt(e.target.value)}
                                    placeholder="Add a retro filter, make it night time..."
                                    className="flex-1 bg-slate-800 text-xs p-2 rounded border border-slate-600 text-white focus:outline-none focus:border-amber-500"
                                    onKeyDown={(e) => e.key === 'Enter' && handleEditImage()}
                                />
                                <button 
                                    onClick={handleEditImage}
                                    className="bg-amber-600 hover:bg-amber-500 text-white px-3 py-1 rounded text-xs font-bold"
                                >
                                    Update
                                </button>
                            </div>
                        </div>
                    )}
                 </>
             ) : (
                 <div className="w-full h-full flex flex-col items-center justify-center text-slate-500 gap-4 bg-slate-900/50">
                     <ImageIcon size={48} opacity={0.2} />
                     <div className="text-center">
                        <p className="text-sm mb-3">Visualizing event...</p>
                     </div>
                 </div>
             )}
        </div>

        {/* Main Description */}
        <div className="prose prose-invert max-w-none">
          <p className="text-lg leading-relaxed text-slate-200">{event.description}</p>
        </div>

        {/* Key Details */}
        <div className="bg-slate-800/50 rounded-xl p-5 border border-slate-700">
            <h3 className="text-sm uppercase tracking-wider text-slate-500 font-bold mb-3 flex items-center gap-2">
                <BookOpen size={16} /> Key Facts
            </h3>
            <ul className="space-y-3">
                {event.details.map((detail, idx) => (
                    <li key={idx} className="flex items-start gap-3 text-slate-300 text-sm">
                        <span className="mt-1.5 w-1.5 h-1.5 bg-amber-500 rounded-full flex-shrink-0" />
                        {detail}
                    </li>
                ))}
            </ul>
        </div>

        {/* AI Section */}
        <div className="bg-indigo-950/30 rounded-xl p-5 border border-indigo-500/30">
            <div className="flex items-center justify-between mb-3">
                <h3 className="text-indigo-300 font-bold flex items-center gap-2">
                    <Bot size={18} /> AI Historical Analysis
                </h3>
                {!aiExplanation && !loadingAi && (
                    <button 
                        onClick={handleAskAI}
                        className="text-xs bg-indigo-600 hover:bg-indigo-500 px-3 py-1 rounded text-white transition-colors"
                    >
                        Generate Insight
                    </button>
                )}
            </div>
            
            {loadingAi && (
                <div className="flex items-center gap-2 text-indigo-400 text-sm animate-pulse">
                    <Loader2 size={14} className="animate-spin" />
                    Analyzing historical context...
                </div>
            )}

            {aiExplanation && (
                <div className="text-indigo-100 text-sm leading-relaxed animate-in fade-in bg-indigo-900/20 p-3 rounded-lg border border-indigo-500/20">
                    {aiExplanation}
                </div>
            )}
        </div>

      </div>
    </motion.div>
  );
};