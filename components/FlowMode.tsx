import React, { useState, useEffect, useRef } from 'react';
import { Task, AppState, UserProfile } from '../types';
import { executeTaskAssist } from '../services/geminiService';

interface FlowModeProps {
  task: Task;
  onComplete: () => void;
  onExit: () => void;
  userProfile: UserProfile;
}

export const FlowMode: React.FC<FlowModeProps> = ({ task, onComplete, onExit, userProfile }) => {
  const [timeLeft, setTimeLeft] = useState(task.estimatedDuration * 60);
  const [isActive, setIsActive] = useState(false);
  
  // AI State
  const [isAiOpen, setIsAiOpen] = useState(false);
  const [aiPrompt, setAiPrompt] = useState('');
  const [chatHistory, setChatHistory] = useState<{role: 'user' | 'ai', content: string}[]>([]);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const hasInitializedAi = useRef(false);
  
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Auto-load previous result if exists, otherwise trigger proactive help
  useEffect(() => {
    if (isAiOpen && chatHistory.length === 0 && !isAiLoading && !hasInitializedAi.current) {
        if (task.aiResult) {
            setChatHistory([{ role: 'ai', content: task.aiResult }]);
            hasInitializedAi.current = true;
        } else {
            handleProactiveAssist();
        }
    }
  }, [isAiOpen]);

  const handleProactiveAssist = async () => {
    hasInitializedAi.current = true;
    setIsAiLoading(true);
    // The "Invisible Hand" acts immediately without asking
    const result = await executeTaskAssist(
        task, 
        "I am starting this task now. Proactively execute the first step, draft the content, or provide the critical data needed. Do not ask questions. Just act.",
        [],
        userProfile
    );
    
    setChatHistory(prev => [...prev, { role: 'ai', content: result }]);
    setIsAiLoading(false);
  };

  // Scroll to bottom of chat
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatHistory, isAiOpen, isAiLoading]);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isActive, timeLeft]);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handleAiExecute = async () => {
    if (!aiPrompt.trim()) return;
    
    const userMessage = aiPrompt;
    setAiPrompt('');
    
    const currentHistory = chatHistory;

    setChatHistory(prev => [...prev, { role: 'user', content: userMessage }]);
    setIsAiLoading(true);
    
    const result = await executeTaskAssist(task, userMessage, currentHistory, userProfile);
    
    setChatHistory(prev => [...prev, { role: 'ai', content: result }]);
    setIsAiLoading(false);
  };

  const progress = ((task.estimatedDuration * 60 - timeLeft) / (task.estimatedDuration * 60)) * 100;

  return (
    <div className="h-screen w-screen bg-[#0F172A] text-white flex overflow-hidden relative transition-all duration-700">
      
      {/* Ambient Background */}
      <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-500/10 rounded-full blur-[120px] pointer-events-none animate-pulse ${isAiOpen ? 'bg-purple-500/10' : ''}`}></div>

      {/* Main Content Area */}
      <div className={`flex-1 flex flex-col items-center justify-center relative z-10 transition-all duration-500 ${isAiOpen ? 'md:mr-[450px]' : ''}`}>
        <div className="text-center max-w-2xl px-8">
            <h2 className="text-stone-400 text-sm uppercase tracking-[0.3em] mb-8 animate-fade-in-up">Current Focus</h2>
            
            <h1 className="text-4xl md:text-6xl font-serif font-light mb-12 leading-tight">
            {task.title}
            </h1>

            <div className="mb-16">
            <div className="text-8xl font-mono font-extralight tabular-nums tracking-tighter opacity-90">
                {formatTime(timeLeft)}
            </div>
            </div>

            <div className="flex gap-6 justify-center items-center">
            {!isActive ? (
                <button 
                onClick={() => setIsActive(true)}
                className="px-10 py-4 bg-white text-black rounded-full text-lg hover:scale-105 transition-all shadow-xl shadow-white/10"
                >
                Begin Flow
                </button>
            ) : (
                <button 
                    onClick={() => setIsActive(false)}
                    className="px-10 py-4 border border-stone-700 text-stone-300 rounded-full text-lg hover:bg-stone-800 transition-all"
                >
                Pause
                </button>
            )}

            <button 
                onClick={onComplete}
                className="px-10 py-4 bg-emerald-900/30 text-emerald-400 border border-emerald-900/50 rounded-full text-lg hover:bg-emerald-900/50 transition-all"
            >
                Complete
            </button>
            </div>
        </div>

        {/* AI Toggle Button (Floating) */}
        <button 
            onClick={() => setIsAiOpen(!isAiOpen)}
            className={`absolute bottom-8 right-8 flex items-center gap-3 px-6 py-4 rounded-full backdrop-blur-xl border transition-all shadow-2xl z-30 group ${isAiOpen ? 'bg-indigo-600 border-indigo-500 text-white' : 'bg-white/10 border-white/10 text-stone-300 hover:bg-white/20'}`}
        >
            <div className="relative">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                {(isAiLoading || (!isAiOpen && task.isAiGeneratable)) && <div className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-purple-400 rounded-full animate-ping"></div>}
            </div>
            <span className="text-sm tracking-widest uppercase font-medium">
                {isAiOpen ? 'Close Co-Pilot' : (task.isAiGeneratable ? 'Auto-Execute' : 'Flux Intelligence')}
            </span>
        </button>
      </div>

      {/* AI Side Panel */}
      <div className={`fixed inset-y-0 right-0 w-full md:w-[450px] bg-[#020617]/95 backdrop-blur-2xl border-l border-white/10 shadow-2xl z-20 transform transition-transform duration-500 cubic-bezier(0.16, 1, 0.3, 1) flex flex-col ${isAiOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        
        {/* Header */}
        <div className="p-6 border-b border-white/5 flex justify-between items-center bg-white/5">
             <div>
                <h3 className="text-white font-serif text-xl tracking-wide">Flux Co-Pilot</h3>
                <div className="flex gap-2 mt-2">
                    <span className="text-[10px] uppercase tracking-wider bg-indigo-500/20 text-indigo-300 px-2 py-0.5 rounded border border-indigo-500/30">Auto-Email</span>
                    <span className="text-[10px] uppercase tracking-wider bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded border border-emerald-500/30">Calendar</span>
                    <span className="text-[10px] uppercase tracking-wider bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded border border-amber-500/30">Maps</span>
                </div>
             </div>
        </div>
           
        {/* Chat Area */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {chatHistory.map((msg, idx) => (
                <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[90%] rounded-2xl p-5 text-sm leading-relaxed whitespace-pre-wrap shadow-lg ${
                        msg.role === 'user' 
                        ? 'bg-indigo-600 text-white' 
                        : 'bg-[#1E293B] text-stone-200 border border-white/5'
                    }`}>
                        {msg.content}
                    </div>
                </div>
            ))}
            
            {isAiLoading && (
                 <div className="flex justify-start animate-fade-in">
                    <div className="bg-[#1E293B] border border-white/5 rounded-2xl p-5 flex flex-col gap-3 min-w-[200px]">
                        <div className="flex gap-2 items-center">
                            <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce"></div>
                            <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce delay-75"></div>
                            <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce delay-150"></div>
                        </div>
                        <span className="text-xs text-stone-500 uppercase tracking-widest">Accessing Neural Tools...</span>
                    </div>
                 </div>
            )}
            <div ref={chatEndRef} />
        </div>

        {/* Input Area */}
        <div className="p-5 bg-black/20 border-t border-white/5">
            <div className="relative">
                <input 
                    type="text" 
                    value={aiPrompt}
                    onChange={(e) => setAiPrompt(e.target.value)}
                    placeholder="Refine execution or add details..."
                    className="w-full bg-[#1E293B] border border-stone-700 rounded-xl pl-4 pr-12 py-4 text-white placeholder:text-stone-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/50 transition-all text-sm"
                    onKeyDown={(e) => e.key === 'Enter' && handleAiExecute()}
                    autoFocus={isAiOpen}
                />
                <button 
                    onClick={handleAiExecute}
                    disabled={isAiLoading || (!aiPrompt.trim())}
                    className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg transition-colors disabled:opacity-0 disabled:pointer-events-none"
                >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 12h14M12 5l7 7-7 7" />
                    </svg>
                </button>
            </div>
        </div>
      </div>

      {/* Progress Bar Top */}
      <div className="absolute top-0 left-0 h-1 bg-indigo-500 transition-all duration-1000 ease-linear shadow-[0_0_15px_rgba(99,102,241,0.5)]" style={{ width: `${progress}%` }}></div>
      
      <button 
          onClick={onExit}
          className="absolute top-8 right-8 text-stone-600 hover:text-stone-400 text-xs tracking-[0.2em] uppercase transition-colors z-30 font-medium"
        >
          Exit Flow
      </button>
    </div>
  );
};
