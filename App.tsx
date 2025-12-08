import React, { useState } from 'react';
import { AppState, Task, EnergyLevel, TaskPriority, Project, UserProfile } from './types';
import { Manifesto } from './components/Manifesto';
import { Onboarding } from './components/Onboarding';
import { Dashboard } from './components/Dashboard';
import { FlowMode } from './components/FlowMode';
import { BrainDump } from './components/BrainDump';

const INITIAL_TASKS: Task[] = [
  {
    id: '1',
    title: 'Review Quarterly Strategy',
    estimatedDuration: 45,
    priority: TaskPriority.HIGH,
    energyCost: 'HIGH',
    category: 'WORK',
    status: 'PENDING'
  },
  {
    id: '2',
    title: 'Meditation Break',
    estimatedDuration: 15,
    priority: TaskPriority.MEDIUM,
    energyCost: 'LOW',
    category: 'LIFE',
    status: 'PENDING'
  }
];

export default function App() {
  const [appState, setAppState] = useState<AppState>(AppState.MANIFESTO);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  
  const [tasks, setTasks] = useState<Task[]>(INITIAL_TASKS);
  const [projects, setProjects] = useState<Project[]>([]);
  const [userEnergy, setUserEnergy] = useState<EnergyLevel>(EnergyLevel.MEDIUM);
  const [activeTask, setActiveTask] = useState<Task | null>(null);

  const handleTaskComplete = () => {
    if (activeTask) {
      // Complete the task in the main list
      setTasks(prev => prev.map(t => t.id === activeTask.id ? { ...t, status: 'COMPLETED' } : t));
      
      // Also update if it belongs to a project
      if (activeTask.projectId) {
          setProjects(prev => prev.map(p => {
              if (p.id === activeTask.projectId) {
                  return {
                      ...p,
                      subtasks: p.subtasks.map(st => st.id === activeTask.id ? { ...st, status: 'COMPLETED' as const } : st)
                  };
              }
              return p;
          }));
      }

      setActiveTask(null);
      setAppState(AppState.DASHBOARD);
    }
  };

  const handleBrainDumpCommit = (newTasks: Task[], newProjects: Project[]) => {
      setTasks(prev => [...prev, ...newTasks]);
      setProjects(prev => [...prev, ...newProjects]);
      setAppState(AppState.DASHBOARD);
  };

  const handleOnboardingComplete = (profile: UserProfile) => {
    setUserProfile(profile);
    setAppState(AppState.DASHBOARD);
  };

  const renderView = () => {
    switch (appState) {
      case AppState.MANIFESTO:
        return <Manifesto onComplete={() => setAppState(AppState.ONBOARDING)} />;
      case AppState.ONBOARDING:
        return <Onboarding onComplete={handleOnboardingComplete} />;
      case AppState.DASHBOARD:
        return (
          <Dashboard 
            tasks={tasks} 
            setTasks={setTasks}
            projects={projects}
            setProjects={setProjects}
            userEnergy={userEnergy} 
            setUserEnergy={setUserEnergy}
            setAppState={setAppState}
            activeTask={activeTask}
            setActiveTask={setActiveTask}
            userProfile={userProfile!}
          />
        );
      case AppState.FLOW_MODE:
        return activeTask ? (
          <FlowMode 
            task={activeTask} 
            onComplete={handleTaskComplete}
            onExit={() => setAppState(AppState.DASHBOARD)}
            userProfile={userProfile!}
          />
        ) : (
          <div className="p-10">Error: No active task</div>
        );
      case AppState.BRAIN_DUMP:
        return (
            <BrainDump 
                onCancel={() => setAppState(AppState.DASHBOARD)}
                onCommit={handleBrainDumpCommit}
                userProfile={userProfile!}
            />
        );
      default:
        return <div className="p-10">Unknown State</div>;
    }
  };

  return (
    <main className="antialiased">
      {renderView()}
    </main>
  );
}
