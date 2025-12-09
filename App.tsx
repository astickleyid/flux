import React, { useState, useEffect } from 'react';
import { AppState, Task, EnergyLevel, TaskPriority, Project, UserProfile } from './types';
import { Manifesto } from './components/Manifesto';
import { Onboarding } from './components/Onboarding';
import { Dashboard } from './components/Dashboard';
import { FlowMode } from './components/FlowMode';
import { BrainDump } from './components/BrainDump';
import { Login } from './components/Login';
import { useAuth } from './hooks/useAuth';
import { getTasks } from './services/api/tasks';
import { getProjects } from './services/api/projects';
import { migrateFromLocalStorage, hasMigrationCompleted } from './lib/migration';

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
  const { user, loading: authLoading, isAuthenticated } = useAuth();
  const [appState, setAppState] = useState<AppState>(AppState.MANIFESTO);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  
  const [tasks, setTasks] = useState<Task[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [userEnergy, setUserEnergy] = useState<EnergyLevel>(EnergyLevel.MEDIUM);
  const [activeTask, setActiveTask] = useState<Task | null>(null);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [migrationStatus, setMigrationStatus] = useState<string | null>(null);

  // Load data from Supabase when authenticated
  useEffect(() => {
    if (isAuthenticated && user) {
      loadUserData();
    } else {
      setIsLoadingData(false);
    }
  }, [isAuthenticated, user]);

  const loadUserData = async () => {
    try {
      setIsLoadingData(true);

      // Set user profile from auth
      setUserProfile({
        name: user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'User',
        email: user?.email || '',
        bio: user?.user_metadata?.bio || undefined
      });

      // Check if migration needed
      if (!hasMigrationCompleted()) {
        setMigrationStatus('Migrating your data from localStorage...');
        const result = await migrateFromLocalStorage();
        setMigrationStatus(`Migrated ${result.tasksCount} tasks, ${result.projectsCount} projects, ${result.knowledgeCount} facts`);
        setTimeout(() => setMigrationStatus(null), 5000);
      }

      // Load tasks and projects from Supabase
      const [loadedTasks, loadedProjects] = await Promise.all([
        getTasks(),
        getProjects()
      ]);

      setTasks(loadedTasks);
      setProjects(loadedProjects);
      setIsLoadingData(false);
    } catch (error) {
      console.error('Error loading user data:', error);
      setIsLoadingData(false);
    }
  };

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
    // Show loading while checking auth
    if (authLoading || isLoadingData) {
      return (
        <div className="min-h-screen bg-[#FDFBF7] flex items-center justify-center">
          <div className="text-center space-y-4">
            <div className="w-12 h-12 border-4 border-stone-300 border-t-stone-900 rounded-full animate-spin mx-auto"></div>
            <p className="text-stone-600">{migrationStatus || 'Loading...'}</p>
          </div>
        </div>
      );
    }

    // Show login if not authenticated
    if (!isAuthenticated) {
      return <Login />;
    }

    // Show migration status if present
    if (migrationStatus) {
      return (
        <div className="min-h-screen bg-[#FDFBF7] flex items-center justify-center">
          <div className="text-center space-y-4">
            <div className="w-12 h-12 border-4 border-stone-300 border-t-stone-900 rounded-full animate-spin mx-auto"></div>
            <p className="text-stone-600">{migrationStatus}</p>
          </div>
        </div>
      );
    }

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
