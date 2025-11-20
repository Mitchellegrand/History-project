import React, { useState } from 'react';
import { HISTORY_EVENTS } from '../constants';
import { Category } from '../types';
import { motion } from 'framer-motion';
import { ChevronRight, PenTool } from 'lucide-react';

export const StudyCenter: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'cards' | 'essay'>('cards');
  const [filter, setFilter] = useState<Category | 'ALL'>('ALL');

  const filteredEvents = filter === 'ALL' ? HISTORY_EVENTS : HISTORY_EVENTS.filter(e => e.category === filter);

  return (
    <div className="h-full overflow-y-auto custom-scrollbar bg-slate-900 p-6 md:p-12 pt-24">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-end mb-8 border-b border-slate-800 pb-4">
            <div>
                <h1 className="text-4xl font-bold serif-font text-slate-100 mb-2">Study Centre</h1>
                <p className="text-slate-400">Review key facts or learn how to structure your exam responses.</p>
            </div>
            <div className="flex gap-2 mt-4 md:mt-0">
                <button 
                    onClick={() => setActiveTab('cards')}
                    className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${activeTab === 'cards' ? 'bg-amber-500 text-slate-900' : 'bg-slate-800 text-slate-400 hover:bg-slate-700'}`}
                >
                    Flashcards
                </button>
                <button 
                    onClick={() => setActiveTab('essay')}
                    className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${activeTab === 'essay' ? 'bg-amber-500 text-slate-900' : 'bg-slate-800 text-slate-400 hover:bg-slate-700'}`}
                >
                    Essay Guide
                </button>
            </div>
        </div>

        {activeTab === 'cards' && (
            <>
                <div className="flex gap-2 mb-6">
                    <button onClick={() => setFilter('ALL')} className={`text-xs px-3 py-1 rounded-full border ${filter === 'ALL' ? 'border-amber-500 text-amber-500' : 'border-slate-700 text-slate-500'}`}>All</button>
                    <button onClick={() => setFilter(Category.WW2)} className={`text-xs px-3 py-1 rounded-full border ${filter === Category.WW2 ? 'border-red-500 text-red-500' : 'border-slate-700 text-slate-500'}`}>WW2 & Nazism</button>
                    <button onClick={() => setFilter(Category.RIGHTS)} className={`text-xs px-3 py-1 rounded-full border ${filter === Category.RIGHTS ? 'border-blue-500 text-blue-500' : 'border-slate-700 text-slate-500'}`}>Rights & Freedoms</button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredEvents.map((event, idx) => (
                        <motion.div 
                            key={event.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.05 }}
                            className="bg-slate-800 border border-slate-700 rounded-xl p-6 hover:border-amber-500/50 transition-colors group"
                        >
                            <div className="flex justify-between items-start mb-4">
                                <span className="text-sm font-mono text-slate-400">{event.year}</span>
                                <div className={`w-2 h-2 rounded-full ${event.category === Category.WW2 ? 'bg-red-500' : 'bg-blue-500'}`} />
                            </div>
                            <h3 className="text-xl font-bold text-slate-100 mb-2 serif-font">{event.title}</h3>
                            <p className="text-slate-400 text-sm mb-4 line-clamp-3">{event.description}</p>
                            <ul className="text-xs text-slate-500 space-y-2 border-t border-slate-700 pt-4">
                                {event.details.slice(0, 2).map((d, i) => (
                                    <li key={i} className="flex gap-2">
                                        <span className="text-amber-500">•</span> {d}
                                    </li>
                                ))}
                                {event.details.length > 2 && <li className="italic opacity-50">+ {event.details.length - 2} more facts</li>}
                            </ul>
                        </motion.div>
                    ))}
                </div>
            </>
        )}

        {activeTab === 'essay' && (
            <div className="max-w-3xl mx-auto bg-slate-800 rounded-2xl p-8 border border-slate-700">
                <div className="flex items-center gap-4 mb-6">
                    <div className="p-3 bg-amber-500/20 rounded-lg text-amber-500">
                        <PenTool size={32} />
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold text-white">Extended Response Guide</h2>
                        <p className="text-slate-400">Mastering the T.E.E.L. structure for your exam.</p>
                    </div>
                </div>

                <div className="space-y-8">
                    <section>
                        <h3 className="text-lg font-bold text-amber-400 mb-3">1. Introduction</h3>
                        <p className="text-slate-300 text-sm leading-relaxed">
                            Introduce the topic and immediately state your <strong className="text-white">main argument (contention)</strong> clearly in response to the prompt. Signpost the key areas your essay will cover.
                        </p>
                    </section>

                    <section>
                        <h3 className="text-lg font-bold text-amber-400 mb-3">2. Body Paragraphs (T.E.E.L.)</h3>
                        <div className="grid gap-4">
                            <div className="bg-slate-900/50 p-4 rounded-lg border-l-4 border-red-500">
                                <strong className="block text-red-400 mb-1">T - Topic Sentence</strong>
                                <span className="text-slate-400 text-sm">State the point of this paragraph clearly.</span>
                            </div>
                            <div className="bg-slate-900/50 p-4 rounded-lg border-l-4 border-blue-500">
                                <strong className="block text-blue-400 mb-1">E - Explanation & Evidence</strong>
                                <span className="text-slate-400 text-sm">
                                    Provide in-depth explanation supported by historical evidence (dates, names, statistics). <br/>
                                    <em>Example: "The Beer Hall Putsch failed in 1923, but led Hitler to realize he needed to use democratic means..."</em>
                                </span>
                            </div>
                            <div className="bg-slate-900/50 p-4 rounded-lg border-l-4 border-green-500">
                                <strong className="block text-green-400 mb-1">L - Link</strong>
                                <span className="text-slate-400 text-sm">Clearly link the point and evidence back to your initial contention. Why does this prove your argument?</span>
                            </div>
                        </div>
                    </section>

                    <section>
                        <h3 className="text-lg font-bold text-amber-400 mb-3">3. Conclusion</h3>
                        <p className="text-slate-300 text-sm leading-relaxed">
                            Summarize your key supporting points in a new way, and then restate your overall contention strongly. <strong className="text-red-400">Do not introduce new evidence here.</strong>
                        </p>
                    </section>
                    
                    <div className="mt-8 p-4 bg-indigo-900/20 border border-indigo-500/30 rounded-lg">
                        <h4 className="font-bold text-indigo-300 mb-2">Pro Tip: Sources</h4>
                        <p className="text-indigo-200 text-sm">
                            Always distinguish between <strong>Primary Sources</strong> (created at the time, e.g., propaganda posters, oral histories) and <strong>Secondary Sources</strong> (interpretations created later, e.g., textbooks).
                        </p>
                    </div>
                </div>
            </div>
        )}
      </div>
    </div>
  );
};
