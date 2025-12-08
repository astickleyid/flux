import { supabase, getCurrentUser } from './supabase';
import { Tables, TablesInsert, TablesUpdate } from '../../types/supabase';
import { Task, TaskPriority } from '../../types';

type DbTask = Tables<'tasks'>;
type DbTaskInsert = TablesInsert<'tasks'>;
type DbTaskUpdate = TablesUpdate<'tasks'>;

// Convert database task to app Task type
const dbTaskToTask = (dbTask: DbTask): Task => ({
  id: dbTask.id,
  title: dbTask.title,
  description: dbTask.description || undefined,
  estimatedDuration: dbTask.estimated_duration,
  priority: dbTask.priority as TaskPriority,
  energyCost: dbTask.energy_cost as 'HIGH' | 'LOW',
  deadline: dbTask.deadline || undefined,
  category: dbTask.category as 'WORK' | 'LEARNING' | 'LIFE',
  status: dbTask.status as 'PENDING' | 'COMPLETED' | 'DEFERRED',
  aiResult: dbTask.ai_result || undefined,
  isAiGeneratable: dbTask.is_ai_generatable || undefined,
  autoExecuteWithAI: dbTask.auto_execute_with_ai || undefined,
  projectId: dbTask.project_id || undefined,
});

// Convert app Task to database insert format
const taskToDbInsert = (task: Partial<Task>, userId: string): DbTaskInsert => ({
  user_id: userId,
  title: task.title || '',
  description: task.description || null,
  estimated_duration: task.estimatedDuration || 0,
  priority: task.priority || TaskPriority.MEDIUM,
  energy_cost: task.energyCost || 'MEDIUM',
  deadline: task.deadline || null,
  category: task.category || 'WORK',
  status: task.status || 'PENDING',
  ai_result: task.aiResult || null,
  is_ai_generatable: task.isAiGeneratable || false,
  auto_execute_with_ai: task.autoExecuteWithAI || false,
  project_id: task.projectId || null,
});

// Convert app Task to database update format
const taskToDbUpdate = (task: Partial<Task>): DbTaskUpdate => ({
  title: task.title,
  description: task.description || null,
  estimated_duration: task.estimatedDuration,
  priority: task.priority,
  energy_cost: task.energyCost,
  deadline: task.deadline || null,
  category: task.category,
  status: task.status,
  ai_result: task.aiResult || null,
  is_ai_generatable: task.isAiGeneratable,
  auto_execute_with_ai: task.autoExecuteWithAI,
  project_id: task.projectId || null,
  updated_at: new Date().toISOString(),
});

export const getTasks = async (): Promise<Task[]> => {
  const user = await getCurrentUser();
  if (!user) throw new Error('Not authenticated');

  const { data, error } = await supabase
    .from('tasks')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return (data || []).map(dbTaskToTask);
};

export const getTask = async (id: string): Promise<Task> => {
  const user = await getCurrentUser();
  if (!user) throw new Error('Not authenticated');

  const { data, error } = await supabase
    .from('tasks')
    .select('*')
    .eq('id', id)
    .eq('user_id', user.id)
    .single();

  if (error) throw error;
  if (!data) throw new Error('Task not found');
  
  return dbTaskToTask(data);
};

export const createTask = async (task: Partial<Task>): Promise<Task> => {
  const user = await getCurrentUser();
  if (!user) throw new Error('Not authenticated');

  const dbTask = taskToDbInsert(task, user.id);
  
  const { data, error } = await supabase
    .from('tasks')
    .insert(dbTask)
    .select()
    .single();

  if (error) throw error;
  if (!data) throw new Error('Failed to create task');
  
  return dbTaskToTask(data);
};

export const updateTask = async (id: string, updates: Partial<Task>): Promise<Task> => {
  const user = await getCurrentUser();
  if (!user) throw new Error('Not authenticated');

  const dbUpdates = taskToDbUpdate(updates);
  
  const { data, error } = await supabase
    .from('tasks')
    .update(dbUpdates)
    .eq('id', id)
    .eq('user_id', user.id)
    .select()
    .single();

  if (error) throw error;
  if (!data) throw new Error('Task not found');
  
  return dbTaskToTask(data);
};

export const deleteTask = async (id: string): Promise<void> => {
  const user = await getCurrentUser();
  if (!user) throw new Error('Not authenticated');

  const { error } = await supabase
    .from('tasks')
    .delete()
    .eq('id', id)
    .eq('user_id', user.id);

  if (error) throw error;
};

export const completeTask = async (id: string): Promise<Task> => {
  const user = await getCurrentUser();
  if (!user) throw new Error('Not authenticated');

  const { data, error } = await supabase
    .from('tasks')
    .update({
      status: 'COMPLETED',
      completed_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    })
    .eq('id', id)
    .eq('user_id', user.id)
    .select()
    .single();

  if (error) throw error;
  if (!data) throw new Error('Task not found');
  
  return dbTaskToTask(data);
};

export const subscribeToTasks = (
  userId: string,
  callback: (tasks: Task[]) => void
) => {
  const subscription = supabase
    .channel('tasks_changes')
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'tasks',
        filter: `user_id=eq.${userId}`,
      },
      async () => {
        // Fetch updated tasks when any change occurs
        try {
          const { data, error } = await supabase
            .from('tasks')
            .select('*')
            .eq('user_id', userId)
            .order('created_at', { ascending: false });

          if (!error && data) {
            callback(data.map(dbTaskToTask));
          }
        } catch (err) {
          console.error('Error fetching tasks in subscription:', err);
        }
      }
    )
    .subscribe();

  return () => {
    subscription.unsubscribe();
  };
};
