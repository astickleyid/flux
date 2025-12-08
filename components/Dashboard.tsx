import React, { useState, useEffect } from 'react';
import { Task, TaskPriority, EnergyLevel, AppState, Project, UserProfile } from '../types';
import { parseNaturalInput, executeTaskAssist } from '../services/geminiService';
import { addKnowledge } from '../services/knowledge';

interface DashboardProps {
  tasks: Task[];
  setTasks: React.Dispatch<React.SetStateAction<Task[]>>;
  projects: Project[];
  setProjects: React.Dispatch<React.SetStateAction<Project[]>>;
  userEnergy: EnergyLevel;
  setUserEnergy: (level: EnergyLevel) => void;
  setAppState: (state: AppState) => void;
  activeTask: Task | null;
  setActiveTask: (task: Task | null) => void;
  userProfile: UserProfile;
}

export const Dashboard: React.FC<DashboardProps> = ({ tasks, setTasks, projects, setProjects, userEnergy, setUserEnergy, setAppState, activeTask, setActiveTask, userProfile }) => {
  const [input, setInput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [suggestion, setSuggestion] = useState<string | null>(null);
  const [showEnergyMenu, setShowEnergyMenu] = useState(false);

  // Automation State
  const [executingTaskIds, setExecutingTaskIds] = useState<Set<string>>(new Set());
  const [viewingTask, setViewingTask] = useState<Task | null>(null);
  const [viewingProject, setViewingProject] = useState<Project | null>(null);
  
  // Feedback State
  const [feedbackState, setFeedbackState] = useState<'IDLE' | 'CRITIQUE' | 'SAVED'>('IDLE');
  const [critiqueInput, setCritiqueInput] = useState('');

  // Reality Check
  const totalHours = tasks.filter(t => t.status === 'PENDING').reduce((acc, t) => acc + t.estimatedDuration, 0) / 60;
  const isOverbooked = totalHours > 6;

  useEffect(() => {
    if (viewingTask) {
        setFeedbackState('IDLE');
        setCritiqueInput('');
    }
  }, [viewingTask]);

  const handleInputSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    setIsProcessing(true);
    const { newTasks, suggestions } = await parseNaturalInput(input, tasks, userProfile);
    
    setTasks(prev => [...prev, ...newTasks]);
    setSuggestion(suggestions);
    setInput('');
    setIsProcessing(false);
    
    newTasks.forEach(task => {
        if (task.autoExecuteWithAI) {
            handleAutoExecute(task);
        }
    });
    
    setTimeout(() => setSuggestion(null), 8000);
  };

  const startFlow = (task: Task) => {
    setActiveTask(task);
    setAppState(AppState.FLOW_MODE);
  };

  const handleAutoExecute = async (task: Task) => {
    setExecutingTaskIds(prev => new Set(prev).add(task.id));
    try {
        const result = await executeTaskAssist(task, undefined, [], userProfile);
        setTasks(prev => prev.map(t => 
            t.id === task.id 
            ? { ...t, status: 'COMPLETED', aiResult: result } 
            : t
        ));
    } catch (e) {
        console.error("Auto-execution failed", e);
    } finally {
        setExecutingTaskIds(prev => {
            const next = new Set(prev);
            next.delete(task.id);
            return next;
        });
    }
  };

  const handlePositiveFeedback = () => {
    if (!viewingTask) return;
    addKnowledge(`User approved the style and execution of the task type: "${viewingTask.title}". Maintain this standard.`);
    setFeedbackState('SAVED');
  };

  const handleCritiqueSubmit = () => {
    if (!viewingTask || !critiqueInput.trim()) return;
    addKnowledge(`User feedback correction for "${viewingTask.title}": ${critiqueInput}. Adjust future behavior accordingly.`);
    setFeedbackState('SAVED');
  };

  const getPriorityColor = (p: TaskPriority) => {
    switch (p) {
      case TaskPriority.CRITICAL: return 'bg-rose-100 text-rose-800 border-rose-200';
      case TaskPriority.HIGH: return 'bg-amber-100 text-amber-800 border-amber-200';
      case TaskPriority.MEDIUM: return 'bg-blue-100 text-blue-800 border-blue-200';
      default: return 'bg-stone-100 text-stone-600 border-stone-200';
    }
  };

  const getStatusMessage = () => {
    if (userEnergy === EnergyLevel.DEPLETED) return "🔋 Critical Energy Drain. Rest is productive.";
    if (userEnergy === EnergyLevel.LOW && tasks.some(t => t.energyCost === 'HIGH' && t.status === 'PENDING')) return "🐢 Energy Low. Defer high-cognitive tasks.";
    if (isOverbooked) return "⚠️ Workload High. Consider deferring tasks.";
    return `✨ Hello ${userProfile.name}. Optimal Flow State Achievable.`;
  };

  const getEnergyConfig = (level: EnergyLevel) => {
    switch(level) {
        case EnergyLevel.HIGH: return { bg: 'bg-emerald-100', text: 'text-emerald-700', icon: '⚡' };
        case EnergyLevel.MEDIUM: return { bg: 'bg-yellow-100', text: 'text-yellow-700', icon: '☀' };
        case EnergyLevel.LOW: return { bg: 'bg-orange-100', text: 'text-orange-700', icon: '🐢' };
        case EnergyLevel.DEPLETED: return { bg: 'bg-red-100', text: 'text-red-700', icon: '🔋' };
        default: return { bg: 'bg-stone-100', text: 'text-stone-600', icon: '•' };
    }
  };

  const currentEnergyConfig = getEnergyConfig(userEnergy);
  const sortedPendingTasks = tasks.filter(t => t.status === 'PENDING' && !t.projectId).sort((a, b) => {
      return (a.priority === 'CRITICAL' ? -1 : 1);
  });

  return (
    <div className="min-h-screen bg-[#FDFBF7] text-stone-800 p-6 md:p-12 transition-all relative" onClick={() => showEnergyMenu && setShowEnergyMenu(false)}>
      
      {/* Brain Dump FAB */}
      <button 
        onClick={() => setAppState(AppState.BRAIN_DUMP)}
        className="fixed bottom-8 left-8 md:bottom-12 md:left-12 bg-stone-900 text-white p-4 rounded-full shadow-2xl hover:scale-105 hover:bg-black transition-all z-40 group flex items-center gap-3 pr-6"
      >
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
        </svg>
        <span className="font-medium">Brain Dump</span>
      </button>

      <header className="flex justify-between items-center mb-12">
        <div>
          <h1 className="text-3xl font-serif font-bold text-stone-900">Today's Flux</h1>
          <p className="text-stone-500 mt-1 text-sm tracking-wide animate-fade-in">
            {getStatusMessage()}
          </p>
        </div>
        
        {/* Energy Widget */}
        <div className="relative" onClick={(e) => e.stopPropagation()}>
           <button 
             onClick={() => setShowEnergyMenu(!showEnergyMenu)}
             className={`flex items-center gap-3 p-2 pl-3 pr-4 rounded-full transition-all duration-300 border border-stone-200 ${currentEnergyConfig.bg}`}
           >
             <span className="text-lg">{currentEnergyConfig.icon}</span>
             <span className={`text-sm font-medium ${currentEnergyConfig.text} hidden md:block`}>{userEnergy}</span>
           </button>
           {showEnergyMenu && (
             <div className="absolute right-0 top-full mt-3 w-56 bg-white border border-stone-200 rounded-xl shadow-xl p-2 z-50">
               {Object.values(EnergyLevel).map((level) => (
                   <button key={level} onClick={() => { setUserEnergy(level); setShowEnergyMenu(false); }} className="w-full text-left px-4 py-3 hover:bg-stone-50 rounded-lg text-sm">{level}</button>
               ))}
             </div>
           )}
        </div>
      </header>

      {/* The Brain Input */}
      <section className="mb-16 relative z-20">
        <form onSubmit={handleInputSubmit} className="relative group">
           <div className="absolute inset-0 bg-stone-200 rounded-2xl blur opacity-25 group-hover:opacity-40 transition-opacity"></div>
           <input 
            type="text" 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={isProcessing}
            placeholder={isProcessing ? "The Brain is analyzing..." : "Quick add a task..."}
            className="relative w-full bg-white/80 backdrop-blur-md border border-stone-200 p-6 rounded-2xl text-xl font-light placeholder:text-stone-300 focus:outline-none focus:ring-1 focus:ring-stone-300 shadow-sm transition-all"
           />
        </form>
        {suggestion && (
          <div className="mt-4 p-4 bg-stone-50 border border-stone-100 rounded-xl text-stone-600 text-sm flex items-start gap-3 animate-fade-in">
             <span className="text-xl">💡</span>
             <p>{suggestion}</p>
          </div>
        )}
      </section>

      {/* Main Grid */}
      <section className="grid md:grid-cols-2 lg:grid-cols-3 gap-12">
        
        {/* Col 1: Active Tasks */}
        <div className="lg:col-span-1">
           <div className="flex items-baseline justify-between mb-6">
             <h2 className="text-lg font-medium tracking-tight">Focus Queue</h2>
             <span className="text-xs text-stone-400 uppercase tracking-widest">{sortedPendingTasks.length} Tasks</span>
           </div>
           
           <div className="space-y-4">
             {sortedPendingTasks.map(task => (
               <div key={task.id} className={`group relative bg-white border border-stone-100 rounded-xl p-5 shadow-sm hover:shadow-md transition-all hover:-translate-y-0.5`}>
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-lg font-medium text-stone-800">{task.title}</h3>
                      <div className="flex gap-2 mt-2">
                        <span className={`text-[10px] font-bold px-2 py-1 rounded-md tracking-wider ${getPriorityColor(task.priority)}`}>{task.priority}</span>
                        <span className="text-[10px] font-bold px-2 py-1 rounded-md bg-stone-50 text-stone-500 tracking-wider">{task.estimatedDuration} MIN</span>
                        {task.isAiGeneratable && (
                            <span className="text-[10px] font-bold px-2 py-1 rounded-md bg-indigo-50 text-indigo-500 tracking-wider border border-indigo-100 flex items-center gap-1">
                                {task.autoExecuteWithAI ? 'AUTO-PILOT' : 'AI READY'}
                            </span>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        {task.isAiGeneratable && (
                             <button
                               onClick={() => handleAutoExecute(task)}
                               disabled={executingTaskIds.has(task.id)}
                               className={`flex items-center gap-2 bg-indigo-600 text-white px-3 py-2 rounded-full shadow-lg hover:bg-indigo-700 transition-all ${executingTaskIds.has(task.id) ? 'animate-pulse cursor-wait' : ''}`}
                             >
                               {executingTaskIds.has(task.id) ? (
                                   <div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                               ) : (
                                   <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                               )}
                             </button>
                        )}
                        <button 
                          onClick={() => startFlow(task)}
                          className="bg-stone-900 text-white p-3 rounded-full shadow-lg hover:bg-black"
                        >
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>
                        </button>
                    </div>
                  </div>
               </div>
             ))}
           </div>
        </div>

        {/* Col 2: Projects (Complex Plans) */}
        <div className="lg:col-span-1">
            <div className="flex items-baseline justify-between mb-6">
             <h2 className="text-lg font-medium tracking-tight">Active Projects</h2>
             <span className="text-xs text-stone-400 uppercase tracking-widest">{projects.length} Active</span>
           </div>

           <div className="space-y-6">
                {projects.map(proj => (
                    <div 
                        key={proj.id} 
                        onClick={() => setViewingProject(proj)}
                        className="bg-white border border-stone-200 rounded-xl p-6 cursor-pointer hover:border-stone-400 transition-all group"
                    >
                        <div className="flex justify-between items-start mb-4">
                            <h3 className="text-xl font-serif text-stone-800 group-hover:text-indigo-900 transition-colors">{proj.title}</h3>
                            <span className="text-xs font-bold bg-stone-100 px-2 py-1 rounded text-stone-500 uppercase tracking-wide">Project</span>
                        </div>
                        <p className="text-stone-500 text-sm line-clamp-2 mb-4">{proj.description}</p>
                        
                        {/* Mini progress visualization */}
                        <div className="flex gap-1 h-1.5 mb-2">
                             {proj.subtasks.map((st, i) => (
                                 <div key={i} className={`flex-1 rounded-full ${st.status === 'COMPLETED' ? 'bg-emerald-400' : 'bg-stone-200'}`}></div>
                             ))}
                        </div>
                        <div className="flex justify-between text-xs text-stone-400">
                             <span>{proj.subtasks.filter(t => t.status === 'COMPLETED').length}/{proj.subtasks.length} Steps</span>
                             <span className="group-hover:translate-x-1 transition-transform">View Plan →</span>
                        </div>
                    </div>
                ))}
                {projects.length === 0 && (
                     <div className="border border-dashed border-stone-300 rounded-xl p-8 text-center text-stone-400">
                         <p className="text-sm">No complex projects yet.</p>
                         <button onClick={() => setAppState(AppState.BRAIN_DUMP)} className="text-indigo-600 hover:underline mt-2 text-sm">Create via Brain Dump</button>
                     </div>
                )}
           </div>
        </div>

        {/* Col 3: Completed */}
        <div className="opacity-60 hover:opacity-100 transition-opacity duration-500 lg:col-span-1">
           <h2 className="text-lg font-medium tracking-tight mb-6 text-stone-400">Completed</h2>
           <div className="space-y-3">
              {tasks.filter(t => t.status === 'COMPLETED').map(task => (
                 <div key={task.id} className="flex flex-col p-4 border-b border-stone-100 bg-white/50 rounded-lg">
                    <div className="flex justify-between items-center">
                        <span className="line-through text-stone-400">{task.title}</span>
                        <span className="text-xs text-stone-300">Done</span>
                    </div>
                    {task.aiResult && (
                        <button 
                            onClick={() => setViewingTask(task)}
                            className="mt-2 text-xs text-indigo-600 hover:text-indigo-800 bg-indigo-50 p-2 rounded text-left w-full flex items-center justify-between group transition-colors"
                        >
                            <span className="truncate italic opacity-80 font-serif">Result available...</span>
                            <span className="uppercase tracking-widest text-[10px] font-bold">View</span>
                        </button>
                    )}
                 </div>
              ))}
           </div>
        </div>
      </section>

      {/* Result Viewer Modal */}
      {viewingTask && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/40 backdrop-blur-sm animate-fade-in" onClick={() => setViewingTask(null)}>
           <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh]" onClick={e => e.stopPropagation()}>
              <div className="p-6 border-b border-stone-100 flex justify-between items-center bg-stone-50">
                  <h3 className="text-xl font-serif font-bold text-stone-800">Task Execution Log</h3>
                  <button onClick={() => setViewingTask(null)} className="text-stone-400 hover:text-stone-600">✕</button>
              </div>
              
              <div className="p-8 overflow-y-auto flex-1">
                 <h4 className="text-sm uppercase tracking-widest text-stone-400 mb-2">Objective</h4>
                 <p className="text-lg font-medium mb-6">{viewingTask.title}</p>
                 
                 <h4 className="text-sm uppercase tracking-widest text-stone-400 mb-4">Flux Intelligence Report</h4>
                 <div className="prose prose-stone prose-sm max-w-none bg-stone-50 p-6 rounded-xl border border-stone-100 font-light leading-relaxed">
                     <pre className="whitespace-pre-wrap font-sans text-stone-700">{viewingTask.aiResult}</pre>
                 </div>
              </div>

              {/* Feedback Section */}
              <div className="p-6 border-t border-stone-100 bg-white">
                 {feedbackState === 'IDLE' && (
                    <div className="bg-stone-50 p-4 rounded-xl flex flex-col sm:flex-row items-center justify-between gap-4">
                       <span className="text-sm font-medium text-stone-600">Was this execution accurate?</span>
                       <div className="flex gap-3">
                           <button onClick={handlePositiveFeedback} className="px-4 py-2 bg-white border border-stone-200 rounded-lg text-sm hover:text-emerald-600">Perfect</button>
                           <button onClick={() => setFeedbackState('CRITIQUE')} className="px-4 py-2 bg-white border border-stone-200 rounded-lg text-sm hover:text-amber-600">Refine</button>
                       </div>
                    </div>
                 )}
                 {feedbackState === 'CRITIQUE' && (
                    <div className="flex gap-2">
                        <input 
                            value={critiqueInput}
                            onChange={(e) => setCritiqueInput(e.target.value)}
                            className="flex-1 border p-2 rounded-lg text-sm"
                            placeholder="Feedback..."
                        />
                        <button onClick={handleCritiqueSubmit} className="bg-amber-600 text-white px-4 py-2 rounded-lg text-sm">Send</button>
                    </div>
                 )}
                 {feedbackState === 'SAVED' && (
                     <div className="text-emerald-600 text-sm font-medium text-center">Feedback recorded. Flux is learning.</div>
                 )}
              </div>
           </div>
        </div>
      )}

      {/* Project Viewer Modal */}
      {viewingProject && (
         <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/40 backdrop-blur-sm animate-fade-in" onClick={() => setViewingProject(null)}>
            <div className="bg-white w-full max-w-4xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]" onClick={e => e.stopPropagation()}>
               <div className="p-8 bg-stone-50 border-b border-stone-200 flex justify-between items-start">
                   <div>
                       <span className="text-xs font-bold uppercase tracking-widest text-indigo-600 mb-2 block">Project Blueprint</span>
                       <h2 className="text-3xl font-serif text-stone-900 mb-2">{viewingProject.title}</h2>
                       <p className="text-stone-500 max-w-2xl">{viewingProject.description}</p>
                   </div>
                   <button onClick={() => setViewingProject(null)} className="p-2 hover:bg-stone-200 rounded-full transition-colors">✕</button>
               </div>
               
               <div className="flex-1 overflow-y-auto p-8 bg-white">
                   <div className="mb-8">
                       <h3 className="text-sm font-bold uppercase tracking-widest text-stone-400 mb-4">Execution Plan</h3>
                       <div className="space-y-3">
                           {viewingProject.subtasks.map(st => (
                               <div key={st.id} className="flex items-center gap-4 p-4 border border-stone-100 rounded-xl hover:bg-stone-50 transition-colors">
                                   <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${st.status === 'COMPLETED' ? 'bg-emerald-500 border-emerald-500' : 'border-stone-300'}`}>
                                       {st.status === 'COMPLETED' && <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" /></svg>}
                                   </div>
                                   <div className="flex-1">
                                       <div className={`text-lg ${st.status === 'COMPLETED' ? 'line-through text-stone-400' : 'text-stone-800'}`}>{st.title}</div>
                                       <div className="flex gap-2 text-xs text-stone-400 mt-1">
                                           <span>{st.estimatedDuration} min</span>
                                           <span>•</span>
                                           <span>{st.priority} Priority</span>
                                       </div>
                                   </div>
                                   <button 
                                      onClick={() => {
                                          setActiveTask(st);
                                          setViewingProject(null);
                                          setAppState(AppState.FLOW_MODE);
                                      }}
                                      className="px-4 py-2 bg-stone-900 text-white text-sm rounded-lg hover:bg-black"
                                    >
                                       Start
                                   </button>
                               </div>
                           ))}
                       </div>
                   </div>
               </div>
            </div>
         </div>
      )}

    </div>
  );
};
