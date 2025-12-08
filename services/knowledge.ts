
const STORAGE_KEY = 'flux_user_knowledge';

export const getKnowledge = (): string[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (e) {
    console.warn("Failed to load knowledge", e);
    return [];
  }
};

export const addKnowledge = (fact: string) => {
  try {
    const facts = getKnowledge();
    // Normalize string for better deduplication (trim, lowercase check)
    const normalizedFact = fact.trim();
    const exists = facts.some(f => f.toLowerCase() === normalizedFact.toLowerCase());
    
    if (!exists && normalizedFact.length > 0) {
      const updated = [...facts, normalizedFact];
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      console.log("Flux learned:", normalizedFact);
    }
  } catch (e) {
    console.warn("Failed to save knowledge", e);
  }
};

export const getKnowledgeString = (): string => {
  const facts = getKnowledge();
  if (facts.length === 0) return "No specific user knowledge yet.";
  return facts.map(f => `- ${f}`).join('\n');
};
