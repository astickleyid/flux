import { supabase, getCurrentUser } from './supabase';
import { Tables, TablesInsert, TablesUpdate } from '../../types/supabase';
import { Project, Task } from '../../types';
import { getTasks, createTask, updateTask, deleteTask } from './tasks';

type DbProject = Tables<'projects'>;
type DbProjectInsert = TablesInsert<'projects'>;
type DbProjectUpdate = TablesUpdate<'projects'>;

// Convert database project to app Project type (with subtasks)
const dbProjectToProject = async (dbProject: DbProject): Promise<Project> => {
  // Fetch all tasks for this project
  const { data: tasks, error } = await supabase
    .from('tasks')
    .select('*')
    .eq('project_id', dbProject.id)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching project tasks:', error);
  }

  // Convert db tasks to app Task format
  const subtasks: Task[] = (tasks || []).map(task => ({
    id: task.id,
    title: task.title,
    description: task.description || undefined,
    estimatedDuration: task.estimated_duration,
    priority: task.priority as any,
    energyCost: task.energy_cost as 'HIGH' | 'LOW',
    deadline: task.deadline || undefined,
    category: task.category as 'WORK' | 'LEARNING' | 'LIFE',
    status: task.status as 'PENDING' | 'COMPLETED' | 'DEFERRED',
    aiResult: task.ai_result || undefined,
    isAiGeneratable: task.is_ai_generatable || undefined,
    autoExecuteWithAI: task.auto_execute_with_ai || undefined,
    projectId: task.project_id || undefined,
  }));

  return {
    id: dbProject.id,
    title: dbProject.title,
    description: dbProject.description,
    progress: dbProject.progress || 0,
    status: dbProject.status as 'ACTIVE' | 'COMPLETED' | 'ON_HOLD',
    subtasks,
  };
};

// Convert app Project to database insert format
const projectToDbInsert = (project: Partial<Project>, userId: string): DbProjectInsert => ({
  user_id: userId,
  title: project.title || '',
  description: project.description || '',
  progress: project.progress || 0,
  status: project.status || 'ACTIVE',
});

// Convert app Project to database update format
const projectToDbUpdate = (project: Partial<Project>): DbProjectUpdate => ({
  title: project.title,
  description: project.description,
  progress: project.progress,
  status: project.status,
  updated_at: new Date().toISOString(),
});

export const getProjects = async (): Promise<Project[]> => {
  const user = await getCurrentUser();
  if (!user) throw new Error('Not authenticated');

  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

  if (error) throw error;
  
  // Convert all projects with their subtasks
  return Promise.all((data || []).map(dbProjectToProject));
};

export const getProject = async (id: string): Promise<Project> => {
  const user = await getCurrentUser();
  if (!user) throw new Error('Not authenticated');

  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .eq('id', id)
    .eq('user_id', user.id)
    .single();

  if (error) throw error;
  if (!data) throw new Error('Project not found');
  
  return dbProjectToProject(data);
};

export const createProject = async (project: Partial<Project>): Promise<Project> => {
  const user = await getCurrentUser();
  if (!user) throw new Error('Not authenticated');

  const dbProject = projectToDbInsert(project, user.id);
  
  const { data, error } = await supabase
    .from('projects')
    .insert(dbProject)
    .select()
    .single();

  if (error) throw error;
  if (!data) throw new Error('Failed to create project');

  // Create subtasks if provided
  if (project.subtasks && project.subtasks.length > 0) {
    for (const subtask of project.subtasks) {
      await createTask({
        ...subtask,
        projectId: data.id,
      });
    }
  }
  
  return dbProjectToProject(data);
};

export const updateProject = async (id: string, updates: Partial<Project>): Promise<Project> => {
  const user = await getCurrentUser();
  if (!user) throw new Error('Not authenticated');

  const dbUpdates = projectToDbUpdate(updates);
  
  const { data, error } = await supabase
    .from('projects')
    .update(dbUpdates)
    .eq('id', id)
    .eq('user_id', user.id)
    .select()
    .single();

  if (error) throw error;
  if (!data) throw new Error('Project not found');

  // Handle subtasks updates if provided
  if (updates.subtasks) {
    // Get existing subtasks
    const { data: existingTasks } = await supabase
      .from('tasks')
      .select('id')
      .eq('project_id', id);

    const existingTaskIds = new Set((existingTasks || []).map(t => t.id));
    const updatedTaskIds = new Set(updates.subtasks.filter(t => t.id).map(t => t.id));

    // Delete removed subtasks
    for (const existingId of existingTaskIds) {
      if (!updatedTaskIds.has(existingId)) {
        await deleteTask(existingId);
      }
    }

    // Create or update subtasks
    for (const subtask of updates.subtasks) {
      if (subtask.id && existingTaskIds.has(subtask.id)) {
        await updateTask(subtask.id, subtask);
      } else {
        await createTask({
          ...subtask,
          projectId: id,
        });
      }
    }
  }
  
  return dbProjectToProject(data);
};

export const deleteProject = async (id: string): Promise<void> => {
  const user = await getCurrentUser();
  if (!user) throw new Error('Not authenticated');

  // Delete all associated tasks first
  const { error: tasksError } = await supabase
    .from('tasks')
    .delete()
    .eq('project_id', id);

  if (tasksError) throw tasksError;

  // Delete the project
  const { error } = await supabase
    .from('projects')
    .delete()
    .eq('id', id)
    .eq('user_id', user.id);

  if (error) throw error;
};

export const updateProjectProgress = async (projectId: string): Promise<Project> => {
  const user = await getCurrentUser();
  if (!user) throw new Error('Not authenticated');

  // Fetch all subtasks for the project
  const { data: tasks, error: tasksError } = await supabase
    .from('tasks')
    .select('status')
    .eq('project_id', projectId);

  if (tasksError) throw tasksError;

  // Calculate progress percentage
  const totalTasks = tasks?.length || 0;
  const completedTasks = tasks?.filter(t => t.status === 'COMPLETED').length || 0;
  const progress = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  // Update project progress
  const { data, error } = await supabase
    .from('projects')
    .update({ 
      progress,
      updated_at: new Date().toISOString(),
    })
    .eq('id', projectId)
    .eq('user_id', user.id)
    .select()
    .single();

  if (error) throw error;
  if (!data) throw new Error('Project not found');

  return dbProjectToProject(data);
};
