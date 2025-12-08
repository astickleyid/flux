import { Task, Project } from '../types';
import { createTask } from '../services/api/tasks';
import { createProject } from '../services/api/projects';
import { addKnowledge } from '../services/api/knowledge';

const MIGRATION_KEY = 'flux_migration_completed';

export const hasMigrationCompleted = (): boolean => {
  return localStorage.getItem(MIGRATION_KEY) === 'true';
};

export const markMigrationCompleted = (): void => {
  localStorage.setItem(MIGRATION_KEY, 'true');
};

export const migrateFromLocalStorage = async (): Promise<{
  tasksCount: number;
  projectsCount: number;
  knowledgeCount: number;
}> => {
  let tasksCount = 0;
  let projectsCount = 0;
  let knowledgeCount = 0;

  try {
    // Migrate tasks
    const tasksJson = localStorage.getItem('flux_tasks');
    if (tasksJson) {
      const tasks: Task[] = JSON.parse(tasksJson);
      for (const task of tasks) {
        try {
          await createTask(task);
          tasksCount++;
        } catch (error) {
          console.error('Error migrating task:', task.title, error);
        }
      }
    }

    // Migrate projects
    const projectsJson = localStorage.getItem('flux_projects');
    if (projectsJson) {
      const projects: Project[] = JSON.parse(projectsJson);
      for (const project of projects) {
        try {
          await createProject(project);
          projectsCount++;
        } catch (error) {
          console.error('Error migrating project:', project.title, error);
        }
      }
    }

    // Migrate knowledge
    const knowledgeJson = localStorage.getItem('flux_user_knowledge');
    if (knowledgeJson) {
      const facts: string[] = JSON.parse(knowledgeJson);
      for (const fact of facts) {
        try {
          await addKnowledge(fact);
          knowledgeCount++;
        } catch (error) {
          console.error('Error migrating knowledge:', fact, error);
        }
      }
    }

    // Mark migration as complete
    markMigrationCompleted();

    return { tasksCount, projectsCount, knowledgeCount };
  } catch (error) {
    console.error('Migration failed:', error);
    throw error;
  }
};
