import { supabase, getCurrentUser } from './supabase';
import { Tables, TablesInsert } from '../../types/supabase';
import { getKnowledge as getLocalKnowledge, addKnowledge as addLocalKnowledge } from '../knowledge';

type DbKnowledge = Tables<'knowledge_base'>;
type DbKnowledgeInsert = TablesInsert<'knowledge_base'>;

export interface KnowledgeFact {
  id: string;
  fact: string;
  createdAt: string;
}

// Convert database knowledge to app format
const dbKnowledgeToFact = (dbKnowledge: DbKnowledge): KnowledgeFact => ({
  id: dbKnowledge.id,
  fact: dbKnowledge.fact,
  createdAt: dbKnowledge.created_at || new Date().toISOString(),
});

export const getKnowledge = async (): Promise<KnowledgeFact[]> => {
  const user = await getCurrentUser();
  if (!user) throw new Error('Not authenticated');

  const { data, error } = await supabase
    .from('knowledge_base')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return (data || []).map(dbKnowledgeToFact);
};

export const addKnowledge = async (fact: string): Promise<KnowledgeFact> => {
  const user = await getCurrentUser();
  if (!user) throw new Error('Not authenticated');

  // Normalize the fact
  const normalizedFact = fact.trim();
  if (normalizedFact.length === 0) {
    throw new Error('Fact cannot be empty');
  }

  // Check for duplicates (case-insensitive)
  const { data: existingFacts } = await supabase
    .from('knowledge_base')
    .select('fact')
    .eq('user_id', user.id);

  const exists = existingFacts?.some(
    f => f.fact.toLowerCase() === normalizedFact.toLowerCase()
  );

  if (exists) {
    throw new Error('This fact already exists');
  }

  const dbKnowledge: DbKnowledgeInsert = {
    user_id: user.id,
    fact: normalizedFact,
  };

  const { data, error } = await supabase
    .from('knowledge_base')
    .insert(dbKnowledge)
    .select()
    .single();

  if (error) throw error;
  if (!data) throw new Error('Failed to add knowledge');

  // Also add to localStorage for backward compatibility
  addLocalKnowledge(normalizedFact);

  return dbKnowledgeToFact(data);
};

export const deleteKnowledge = async (id: string): Promise<void> => {
  const user = await getCurrentUser();
  if (!user) throw new Error('Not authenticated');

  const { error } = await supabase
    .from('knowledge_base')
    .delete()
    .eq('id', id)
    .eq('user_id', user.id);

  if (error) throw error;
};

// Migration helper: sync localStorage knowledge to database
export const migrateLocalKnowledge = async (): Promise<void> => {
  const user = await getCurrentUser();
  if (!user) throw new Error('Not authenticated');

  const localFacts = getLocalKnowledge();
  if (localFacts.length === 0) return;

  // Get existing database facts
  const { data: dbFacts } = await supabase
    .from('knowledge_base')
    .select('fact')
    .eq('user_id', user.id);

  const existingFacts = new Set(
    (dbFacts || []).map(f => f.fact.toLowerCase())
  );

  // Insert facts that don't exist in database
  const factsToInsert: DbKnowledgeInsert[] = localFacts
    .filter(fact => !existingFacts.has(fact.toLowerCase()))
    .map(fact => ({
      user_id: user.id,
      fact,
    }));

  if (factsToInsert.length > 0) {
    const { error } = await supabase
      .from('knowledge_base')
      .insert(factsToInsert);

    if (error) {
      console.error('Error migrating local knowledge:', error);
      throw error;
    }
  }
};

// Get knowledge as formatted string (for AI context)
export const getKnowledgeString = async (): Promise<string> => {
  try {
    const facts = await getKnowledge();
    if (facts.length === 0) return 'No specific user knowledge yet.';
    return facts.map(f => `- ${f.fact}`).join('\n');
  } catch (error) {
    console.error('Error fetching knowledge string:', error);
    return 'No specific user knowledge yet.';
  }
};
