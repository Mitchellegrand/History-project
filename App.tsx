import React, { useState } from 'react';
import { ThreeTimeline } from './components/ThreeTimeline';
import { DetailPanel } from './components/DetailPanel';
import { StudyCenter } from './components/StudyCenter';
import { ChatTutor } from './components/ChatTutor';
import { HistoryEvent } from './types';
import { AnimatePresence } from 'framer-motion';
import { Box, Book, Search, X } from 'lucide-react';
import { HISTORY_EVENTS } from './constants';

enum ViewMode {
  TIMELINE = 'TIMELINE',
  STUDY = 'STUDY'
}

const App: React.FC = () => {
  const [activeEventId, setActiveEventId] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>(ViewMode.TIMELINE);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const handleSelectEvent = (event: HistoryEvent) => {
    setActiveEventId(event.id);
  };

  const handleCloseDetail = () => {
    setActiveEventId(null);
  };

  const selectedEventData = HISTORY_EVENTS.find((e: HistoryEvent) => e.id === activeEventId) || null;

  const filteredEvents = HISTORY_EVENTS.filter(e => 
    e.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    e.year.toString().includes(searchQuery)
  );

  const handleSearchSelect = (eventId: string) => {
      setActiveEventId(eventId);
      setViewMode(ViewMode.TIMELINE);
      setIsSearchOpen(false);
      setSearchQuery('');
  };

  return (
    <div className="relative w-full h-screen bg-slate-950 overflow-hidden text-slate-200">
      
      {/* Navigation / Header */}
      <div className="absolute top-0 left-0 w-full z-40 p-6 flex justify-between items-center pointer-events-none">
        <div className="flex items-center gap-8 pointer-events-auto">
            <div>
                <h1 className="text-2xl font-bold tracking-tighter text-white drop-shadow-lg serif-font">
                    CHRONO<span className="text-amber-500">LEARN</span>
                </h1>
                <p className="text-xs text-slate-400 opacity-70">Year 10 History Prep 2025</p>
            </div>

            {/* Search Bar */}
            <div className="relative">
                <div className={`flex items-center bg-slate-900/80 backdrop-blur border border-slate-700 rounded-lg transition-all ${isSearchOpen ? 'w-64 shadow-xl' : 'w-10 shadow-none border-transparent bg-transparent'}`}>
                    <button 
                        onClick={() => setIsSearchOpen(!isSearchOpen)}
                        className="p-2 text-slate-400 hover:text-white"
                    >
                        {isSearchOpen ? <X size={18} /> : <Search size={20} />}
                    </button>
                    {isSearchOpen && (
                        <input
                            type="text"
                            autoFocus
                            placeholder="Find event..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="bg-transparent border-none outline-none text-sm text-white w-full pr-3 placeholder-slate-500"
                        />
                    )}
                </div>
                {isSearchOpen && searchQuery && (
                    <div className="absolute top-full left-0 w-64 mt-2 bg-slate-900 border border-slate-700 rounded-lg shadow-xl overflow-hidden max-h-60 overflow-y-auto custom-scrollbar">
                        {filteredEvents.length > 0 ? (
                            filteredEvents.map(event => (
                                <button
                                    key={event.id}
                                    onClick={() => handleSearchSelect(event.id)}
                                    className="w-full text-left px-4 py-2 text-sm hover:bg-slate-800 flex justify-between items-center group"
                                >
                                    <span className="text-slate-200 group-hover:text-amber-500 transition-colors truncate">{event.title}</span>
                                    <span className="text-xs text-slate-500">{event.year}</span>
                                </button>
                            ))
                        ) : (
                            <div className="p-4 text-xs text-slate-500 text-center">No events found</div>
                        )}
                    </div>
                )}
            </div>
        </div>
        
        <div className="flex gap-2 bg-slate-900/80 backdrop-blur p-1 rounded-lg border border-slate-700 pointer-events-auto shadow-xl">
            <button
                onClick={() => setViewMode(ViewMode.TIMELINE)}
                className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all ${viewMode === ViewMode.TIMELINE ? 'bg-amber-500 text-slate-900 shadow-lg' : 'text-slate-400 hover:text-white'}`}
            >
                <Box size={16} /> 3D Timeline
            </button>
            <button
                onClick={() => setViewMode(ViewMode.STUDY)}
                className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all ${viewMode === ViewMode.STUDY ? 'bg-amber-500 text-slate-900 shadow-lg' : 'text-slate-400 hover:text-white'}`}
            >
                <Book size={16} /> Study Centre
            </button>
        </div>
      </div>

      {/* Main Content Area */}
      <main className="w-full h-full relative">
        {viewMode === ViewMode.TIMELINE && (
             <ThreeTimeline 
                onSelectEvent={handleSelectEvent} 
                activeEventId={activeEventId} 
             />
        )}
        
        {viewMode === ViewMode.STUDY && (
            <div className="absolute inset-0 z-10 bg-slate-950">
                <StudyCenter />
            </div>
        )}
      </main>

      {/* UI Overlays */}
      <AnimatePresence>
        {activeEventId && viewMode === ViewMode.TIMELINE && (
            <DetailPanel event={selectedEventData} onClose={handleCloseDetail} />
        )}
      </AnimatePresence>

      <ChatTutor />
    </div>
  );
};

export default App;