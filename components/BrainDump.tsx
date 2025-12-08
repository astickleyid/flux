import React, { useState, useEffect, useRef } from 'react';
import { analyzeBrainDump, BrainDumpAnalysis } from '../services/geminiService';
import { Task, Project, UserProfile } from '../types';

interface BrainDumpProps {
  onCancel: () => void;
  onCommit: (newTasks: Task[], newProjects: Project[]) => void;
  userProfile: UserProfile;
}

export const BrainDump: React.FC<BrainDumpProps> = ({ onCancel, onCommit, userProfile }) => {
  const [text, setText] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [history, setHistory] = useState<{role: 'user' | 'model', text: string}[]>([]);
  const [analysis, setAnalysis] = useState<BrainDumpAnalysis | null>(null);
  
  const recognitionRef = useRef<any>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Initialize Speech Recognition
  useEffect(() => {
    if ('webkitSpeechRecognition' in window) {
      const SpeechRecognition = (window as any).webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;

      recognitionRef.current.onresult = (event: any) => {
        let interimTranscript = '';
        let finalTranscript = '';

        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            finalTranscript += event.results[i][0].transcript;
          } else {
            interimTranscript += event.results[i][0].transcript;
          }
        }
        setText(prev => prev + ' ' + finalTranscript + interimTranscript);
      };

      recognitionRef.current.onerror = (event: any) => {
        console.error('Speech recognition error', event.error);
        setIsListening(false);
      };
      
      recognitionRef.current.onend = () => {
         setIsListening(false);
      };
    }
  }, []);

  // Auto-scroll to analysis
  useEffect(() => {
    if (analysis) {
        scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [analysis]);

  const toggleListening = () => {
    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
    } else {
      // Don't clear text if we are in conversation mode, user might want to add to it
      recognitionRef.current?.start();
      setIsListening(true);
    }
  };

  const handleProcess = async () => {
    if (!text.trim()) return;
    setIsListening(false);
    recognitionRef.current?.stop();
    setIsProcessing(true);

    const newEntry = { role: 'user' as const, text: text };
    const updatedHistory = [...history, newEntry];
    setHistory(updatedHistory);
    setText(''); // Clear input for next turn

    const result = await analyzeBrainDump(updatedHistory, userProfile);
    
    // Add AI response to history so it remembers context next turn
    setHistory([...updatedHistory, { role: 'model' as const, text: result.strategy }]);
    setAnalysis(result);
    setIsProcessing(false);
  };

  const handleFinalCommit = () => {
      if (analysis) {
          onCommit(analysis.tasks, analysis.projects);
      }
  };

  return (
    <div className="h-screen w-screen bg-[#FDFBF7] flex flex-col items-center p-6 relative overflow-hidden">
      
      {/* Visual Ambience */}
      <div className={`absolute inset-0 bg-stone-100 transition-opacity duration-1000 ${isProcessing ? 'opacity-100' : 'opacity-0'}`}>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-indigo-500/10 rounded-full blur-[80px] animate-pulse"></div>
      </div>

      <div className="z-10 w-full max-w-4xl flex flex-col h-full">
        
        {/* Header */}
        <div className="flex justify-between items-center mb-6 pt-4">
             <div className="space-y-1">
                <h2 className="text-stone-400 text-xs uppercase tracking-[0.2em] font-medium">Strategic Release Valve</h2>
                <h1 className="text-2xl font-serif text-stone-800">The War Room</h1>
             </div>
             <button onClick={onCancel} className="text-stone-400 text-xs hover:text-stone-600 uppercase tracking-widest">Exit</button>
        </div>

        {/* Conversation / Analysis Area */}
        <div className="flex-1 overflow-y-auto space-y-6 pr-2 pb-20 scrollbar-hide">
            {/* Initial Prompt Placeholder if empty */}
            {history.length === 0 && (
                <div className="text-center mt-20 opacity-40">
                    <p className="font-serif text-3xl italic text-stone-600 mb-4">"Chaos precedes order."</p>
                    <p className="text-stone-500">Unload your mind. Flux will structure it.</p>
                </div>
            )}

            {/* History Loop */}
            {history.map((msg, i) => (
                <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[85%] rounded-2xl p-5 text-sm leading-relaxed ${
                        msg.role === 'user' 
                        ? 'bg-stone-200 text-stone-800 rounded-tr-sm' 
                        : 'bg-white border border-stone-100 text-stone-600 shadow-sm rounded-tl-sm'
                    }`}>
                        {msg.text}
                    </div>
                </div>
            ))}
            
            {/* Active Analysis Card */}
            {analysis && !isProcessing && (
                <div className="animate-fade-in-up space-y-4 pb-4" ref={scrollRef}>
                    {!analysis.isComplete && (
                        <div className="bg-indigo-50 border border-indigo-100 p-6 rounded-xl relative overflow-hidden">
                            <div className="absolute top-0 left-0 w-1 h-full bg-indigo-500"></div>
                            <h3 className="text-indigo-900 font-serif text-lg mb-2">Strategy Required</h3>
                            <p className="text-indigo-800/80 text-sm mb-4">{analysis.strategy}</p>
                            
                            {analysis.clarifyingQuestions.length > 0 && (
                                <div className="space-y-2">
                                    <p className="text-xs uppercase tracking-widest text-indigo-400 font-bold">Clarification Needed</p>
                                    <ul className="space-y-2">
                                        {analysis.clarifyingQuestions.map((q, idx) => (
                                            <li key={idx} className="flex gap-3 items-start text-indigo-900 text-sm bg-white/50 p-3 rounded-lg">
                                                <span className="text-indigo-400 font-bold">?</span>
                                                {q}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </div>
                    )}
                    
                    {/* Draft Plan Preview */}
                    {(analysis.tasks.length > 0 || analysis.projects.length > 0) && (
                         <div className="bg-emerald-50/50 border border-emerald-100 p-6 rounded-xl">
                             <div className="flex justify-between items-center mb-4">
                                <h3 className="text-emerald-900 font-serif text-lg">Draft Plan</h3>
                                {analysis.isComplete ? (
                                    <span className="text-[10px] bg-emerald-200 text-emerald-800 px-2 py-1 rounded uppercase tracking-wider font-bold">Ready</span>
                                ) : (
                                    <span className="text-[10px] bg-amber-200 text-amber-800 px-2 py-1 rounded uppercase tracking-wider font-bold">Drafting...</span>
                                )}
                             </div>
                             
                             <div className="space-y-2 mb-4">
                                 {analysis.projects.map(p => (
                                     <div key={p.id} className="text-sm bg-white p-3 rounded border border-emerald-100/50 shadow-sm flex justify-between">
                                         <span className="font-medium text-stone-700">{p.title}</span>
                                         <span className="text-stone-400 text-xs">Project</span>
                                     </div>
                                 ))}
                                 {analysis.tasks.map(t => (
                                     <div key={t.id} className="text-sm bg-white p-3 rounded border border-emerald-100/50 shadow-sm flex justify-between">
                                         <span className="text-stone-700">{t.title}</span>
                                         <span className="text-stone-400 text-xs">Task</span>
                                     </div>
                                 ))}
                             </div>
                             
                             <button 
                                onClick={handleFinalCommit}
                                className={`w-full py-3 rounded-lg font-medium transition-all shadow-lg ${
                                    analysis.isComplete 
                                    ? 'bg-emerald-600 hover:bg-emerald-500 text-white' 
                                    : 'bg-white border border-emerald-200 text-emerald-700 hover:bg-emerald-50'
                                }`}
                             >
                                {analysis.isComplete ? 'Execute Strategy (Commit to Dashboard)' : 'Commit Current Draft Anyway'}
                             </button>
                         </div>
                    )}
                </div>
            )}
            
            {isProcessing && (
                 <div className="flex items-center gap-2 text-stone-400 text-sm animate-pulse p-4">
                    <div className="w-2 h-2 bg-stone-400 rounded-full"></div>
                    <span>Flux is strategizing...</span>
                 </div>
            )}
        </div>

        {/* Input Area */}
        <div className="relative group mt-4">
           <textarea 
             value={text}
             onChange={(e) => setText(e.target.value)}
             onKeyDown={(e) => {
                 if (e.key === 'Enter' && !e.shiftKey) {
                     e.preventDefault();
                     handleProcess();
                 }
             }}
             placeholder={history.length > 0 ? "Reply to Flux..." : "Dump your thoughts here..."}
             className="w-full h-32 bg-white border border-stone-200 p-4 pr-16 rounded-2xl text-lg font-light text-stone-700 placeholder:text-stone-300 focus:outline-none focus:ring-1 focus:ring-stone-300 shadow-xl resize-none transition-shadow"
           />
           
           <div className="absolute bottom-4 right-4 flex gap-2">
                <button 
                onClick={toggleListening}
                className={`p-3 rounded-full transition-all shadow-md ${isListening ? 'bg-rose-500 text-white animate-pulse' : 'bg-stone-100 text-stone-500 hover:bg-stone-200'}`}
                >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    {isListening ? (
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    ) : (
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                    )}
                </svg>
                </button>

                <button 
                    onClick={handleProcess}
                    disabled={!text.trim() || isProcessing}
                    className={`p-3 rounded-full transition-all shadow-md ${
                        !text.trim() 
                        ? 'bg-stone-100 text-stone-300' 
                        : 'bg-stone-900 text-white hover:bg-black'
                    }`}
                >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 12h14M12 5l7 7-7 7" />
                    </svg>
                </button>
           </div>
        </div>
      </div>
    </div>
  );
};
