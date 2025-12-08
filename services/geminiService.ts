import { GoogleGenAI, Type, FunctionDeclaration, Tool } from "@google/genai";
import { Task, TaskPriority, Project, UserProfile } from "../types";
import { getKnowledgeString, addKnowledge } from "./knowledge";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

// -- HELPER: Location --
const getUserLocation = (): Promise<{latitude: number, longitude: number} | undefined> => {
  return new Promise((resolve) => {
    if (typeof navigator === 'undefined' || !navigator.geolocation) {
      resolve(undefined);
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude
        });
      },
      (error) => {
        console.warn("Location access denied or failed", error);
        resolve(undefined);
      },
      { timeout: 3000 }
    );
  });
};

// -- MOCK APIs --
const mockWeatherApi = (location: string) => {
    const conditions = ['Clear Sky', 'Overcast', 'Light Rain', 'Windy', 'Sunny', 'Thunderstorms'];
    const temp = Math.floor(Math.random() * (30 - 10) + 10);
    const condition = conditions[Math.floor(Math.random() * conditions.length)];
    return { 
        result: `Current weather in ${location}: ${temp}°C, ${condition}. Humidity: 65%. Wind: 12km/h.` 
    };
};

const mockEmailApi = (from: string, to: string, subject: string, body: string) => {
    return { status: 'success', message: `[SIMULATION] Email sent FROM ${from} TO ${to} with subject "${subject}".` };
};

const mockCalendarApi = (user: string, title: string, dateTime: string, durationMinutes: number) => {
    return { status: 'success', message: `[SIMULATION] Calendar Event for ${user}: "${title}" scheduled for ${dateTime} (${durationMinutes} min).` };
};

// -- TOOL DEFINITIONS --
const weatherTool: FunctionDeclaration = {
    name: 'getCurrentWeather',
    description: 'Get the current weather forecast and conditions for a specific location.',
    parameters: {
        type: Type.OBJECT,
        properties: {
            location: { type: Type.STRING, description: 'The city and state, e.g. San Francisco, CA' }
        },
        required: ['location']
    }
};

const emailTool: FunctionDeclaration = {
    name: 'sendEmail',
    description: 'Draft and send an email to a recipient. Use this for communication tasks.',
    parameters: {
        type: Type.OBJECT,
        properties: {
            to: { type: Type.STRING, description: 'Email address of the recipient' },
            subject: { type: Type.STRING, description: 'Subject line of the email' },
            body: { type: Type.STRING, description: 'The content/body of the email' }
        },
        required: ['to', 'subject', 'body']
    }
};

const calendarTool: FunctionDeclaration = {
    name: 'scheduleEvent',
    description: 'Schedule an event, meeting, or reminder on the user\'s calendar.',
    parameters: {
        type: Type.OBJECT,
        properties: {
            title: { type: Type.STRING, description: 'Title of the event' },
            dateTime: { type: Type.STRING, description: 'ISO 8601 date time string (e.g. 2024-10-25T14:00:00)' },
            durationMinutes: { type: Type.NUMBER, description: 'Duration in minutes' }
        },
        required: ['title', 'dateTime', 'durationMinutes']
    }
};

// -- INTERACTIVE BRAIN DUMP ORGANIZER --
export interface BrainDumpAnalysis {
    tasks: Task[];
    projects: Project[];
    strategy: string; // The "Coach" speaking to the user
    clarifyingQuestions: string[]; // Questions to drill down
    isComplete: boolean; // True if actionable, False if needs more info
}

export const analyzeBrainDump = async (
    conversationHistory: { role: 'user' | 'model', text: string }[],
    profile: UserProfile
): Promise<BrainDumpAnalysis> => {
  if (!process.env.API_KEY) {
      return { tasks: [], projects: [], strategy: "API Key Missing", clarifyingQuestions: [], isComplete: true };
  }

  const model = "gemini-2.5-flash";
  const userContext = getKnowledgeString();

  const systemInstruction = `
    You are the "Behavioral Architect" and a Strategic Career Coach for: ${profile.name} (${profile.email}).
    Known Context/Bio: ${profile.bio || "N/A"}.
    
    YOUR GOAL:
    Turn the user's "Brain Dump" into a concrete, psychological execution plan. 
    
    CORE PHILOSOPHY:
    1. **Do not be generic.** If a user says "make money", do not list "freelancing". Ask *what* they freelance in.
    2. **Leverage Uniqueness.** If the user mentions niche skills ("vibe coding", "music production") or constraints ("banned from chemistry"), USE THEM. 
    3. **The Socratic Method.** If the input is vague, ASK QUESTIONS. Do not finalize the plan until you know the *leverage point*.
    4. **Tone:** Professional, slightly witty, deeply insightful, and tailored to their constraints.

    USER KNOWLEDGE:
    ${userContext}
    
    OUTPUT PROTOCOL:
    - If the input is simple (e.g. "Buy milk"), set 'isComplete' to TRUE and output tasks.
    - If the input is complex (e.g. "I need $2k/week"), set 'isComplete' to FALSE. Provide a 'strategy' analysis and 'clarifyingQuestions'.
    - If 'isComplete' is FALSE, 'tasks' and 'projects' should be empty or only contain the obvious ones.
  `;

  const schema = {
    type: Type.OBJECT,
    properties: {
        strategy: { type: Type.STRING, description: "Your analysis of their situation, acknowledging their unique skills/constraints." },
        clarifyingQuestions: { 
            type: Type.ARRAY, 
            items: { type: Type.STRING }, 
            description: "3 maximum. High-impact questions to narrow down the plan." 
        },
        isComplete: { type: Type.BOOLEAN, description: "Are we ready to commit to the dashboard? True for simple tasks, False for complex strategies requiring input." },
        tasks: {
            type: Type.ARRAY,
            items: {
                type: Type.OBJECT,
                properties: {
                    title: { type: Type.STRING },
                    description: { type: Type.STRING },
                    estimatedDuration: { type: Type.NUMBER },
                    priority: { type: Type.STRING, enum: ["CRITICAL", "HIGH", "MEDIUM", "LOW"] },
                    energyCost: { type: Type.STRING, enum: ["HIGH", "LOW"] },
                    category: { type: Type.STRING, enum: ["WORK", "LEARNING", "LIFE"] },
                    isAiGeneratable: { type: Type.BOOLEAN },
                    autoExecuteWithAI: { type: Type.BOOLEAN }
                },
                required: ["title", "estimatedDuration", "priority", "energyCost", "category", "isAiGeneratable"]
            }
        },
        projects: {
            type: Type.ARRAY,
            items: {
                type: Type.OBJECT,
                properties: {
                    title: { type: Type.STRING },
                    description: { type: Type.STRING },
                    subtasks: {
                        type: Type.ARRAY,
                        items: {
                             type: Type.OBJECT,
                             properties: {
                                title: { type: Type.STRING },
                                estimatedDuration: { type: Type.NUMBER },
                                priority: { type: Type.STRING, enum: ["CRITICAL", "HIGH", "MEDIUM", "LOW"] },
                                energyCost: { type: Type.STRING, enum: ["HIGH", "LOW"] },
                                category: { type: Type.STRING, enum: ["WORK", "LEARNING", "LIFE"] },
                                isAiGeneratable: { type: Type.BOOLEAN },
                                autoExecuteWithAI: { type: Type.BOOLEAN }
                             },
                             required: ["title", "estimatedDuration", "priority", "energyCost", "category", "isAiGeneratable"]
                        }
                    }
                },
                required: ["title", "description", "subtasks"]
            }
        },
        learnedFacts: { type: Type.ARRAY, items: { type: Type.STRING } }
    },
    required: ["strategy", "clarifyingQuestions", "isComplete", "tasks", "projects"]
  };

  try {
      const contents = conversationHistory.map(entry => ({
          role: entry.role,
          parts: [{ text: entry.text }]
      }));

      const response = await ai.models.generateContent({
          model,
          contents,
          config: {
              systemInstruction,
              responseMimeType: "application/json",
              responseSchema: schema
          }
      });

      const text = response.text;
      if (!text) throw new Error("No response from AI");
      const parsed = JSON.parse(text);

      if (parsed.learnedFacts && Array.isArray(parsed.learnedFacts)) {
        parsed.learnedFacts.forEach((fact: string) => addKnowledge(fact));
      }

      const tasks: Task[] = (parsed.tasks || []).map((t: any) => ({
          ...t, id: Math.random().toString(36).substr(2, 9), status: 'PENDING'
      }));

      const projects: Project[] = (parsed.projects || []).map((p: any) => {
          const projectId = Math.random().toString(36).substr(2, 9);
          return {
              ...p,
              id: projectId,
              progress: 0,
              status: 'ACTIVE',
              subtasks: (p.subtasks || []).map((st: any) => ({
                  ...st, id: Math.random().toString(36).substr(2, 9), status: 'PENDING', projectId
              }))
          };
      });

      return { 
          tasks, 
          projects, 
          strategy: parsed.strategy || "Analysis complete.",
          clarifyingQuestions: parsed.clarifyingQuestions || [],
          isComplete: parsed.isComplete 
      };

  } catch (error) {
      console.error("Brain Dump Error:", error);
      return { tasks: [], projects: [], strategy: "Connection interrupted.", clarifyingQuestions: [], isComplete: true };
  }
};


// -- INPUT PARSING AGENT --
export const parseNaturalInput = async (input: string, currentTasks: Task[], profile: UserProfile): Promise<{ newTasks: Task[], suggestions: string }> => {
  if (!process.env.API_KEY) {
    return {
      newTasks: [],
      suggestions: "API Key missing."
    };
  }

  const model = "gemini-2.5-flash";
  const userContext = getKnowledgeString();
  
  const systemInstruction = `
    You are the "Brain" of Flux, a behavioral productivity app for ${profile.name} (${profile.email}).
    User Bio/Context: ${profile.bio || "N/A"}
    
    USER KNOWLEDGE SYSTEM:
    ${userContext}
    
    INSTRUCTIONS:
    1. Analyze the user's request.
    2. Set 'isAiGeneratable' = TRUE for writing, scheduling, research.
    3. Set 'autoExecuteWithAI' = TRUE ONLY if explicit ("do it now").
    
    Current Date: ${new Date().toISOString()}
  `;

  const schema = {
    type: Type.OBJECT,
    properties: {
      newTasks: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            description: { type: Type.STRING },
            estimatedDuration: { type: Type.NUMBER },
            priority: { type: Type.STRING, enum: ["CRITICAL", "HIGH", "MEDIUM", "LOW"] },
            energyCost: { type: Type.STRING, enum: ["HIGH", "LOW"] },
            category: { type: Type.STRING, enum: ["WORK", "LEARNING", "LIFE"] },
            isAiGeneratable: { type: Type.BOOLEAN },
            autoExecuteWithAI: { type: Type.BOOLEAN }
          },
          required: ["title", "estimatedDuration", "priority", "energyCost", "category", "isAiGeneratable", "autoExecuteWithAI"]
        }
      },
      suggestions: { type: Type.STRING },
      learnedFacts: { type: Type.ARRAY, items: { type: Type.STRING } }
    },
    required: ["newTasks", "suggestions"]
  };

  try {
    const response = await ai.models.generateContent({
      model,
      contents: input,
      config: {
        systemInstruction,
        responseMimeType: "application/json",
        responseSchema: schema
      }
    });

    const text = response.text;
    if (!text) throw new Error("No response");
    const parsed = JSON.parse(text);
    
    if (parsed.learnedFacts) parsed.learnedFacts.forEach((fact: string) => addKnowledge(fact));

    const newTasks: Task[] = parsed.newTasks.map((t: any) => ({
      ...t,
      id: Math.random().toString(36).substr(2, 9),
      status: 'PENDING'
    }));

    return { newTasks, suggestions: parsed.suggestions };
  } catch (error) {
    console.error("Gemini Error:", error);
    return { newTasks: [], suggestions: "Error processing input." };
  }
};

// -- TASK EXECUTION AGENT (MULTI-TURN) --
export const executeTaskAssist = async (
    task: Task, 
    specificPrompt: string | undefined, 
    history: { role: 'user' | 'ai'; content: string }[] = [],
    profile: UserProfile
): Promise<string> => {
  if (!process.env.API_KEY) return "API Key missing.";

  const model = "gemini-2.5-flash"; 
  const userContext = getKnowledgeString();
  const location = await getUserLocation();

  const systemInstruction = `
    You are Flux Intelligence, acting on behalf of ${profile.name} <${profile.email}>.
    Your bio context: ${profile.bio || "None"}.
    
    TASK CONTEXT:
    Title: ${task.title}
    Description: ${task.description || 'N/A'}
    
    USER KNOWLEDGE:
    ${userContext}
    
    INSTRUCTIONS:
    1. **IDENTITY**: When sending emails or invites, assume YOU are ${profile.name}. Sign emails with ${profile.name}.
    2. **TOOLS**:
       - 'sendEmail': Use this to simulate sending emails.
       - 'scheduleEvent': Use this to simulate calendar blocks.
    3. **ACTION**: Execute the task.
    
    OUTPUT:
    Provide the result directly.
  `;

  // Define Tools
  const tools: Tool[] = [
      { googleSearch: {} },
      { googleMaps: {} },
      { functionDeclarations: [weatherTool, emailTool, calendarTool] }
  ];

  const toolConfig = location ? {
      retrievalConfig: {
          latLng: location
      }
  } : undefined;

  const contents: any[] = history.map(msg => ({
      role: msg.role === 'ai' ? 'model' : 'user',
      parts: [{ text: msg.content }]
  }));

  const currentText = specificPrompt || `Execute: "${task.title}".`;
  contents.push({ role: 'user', parts: [{ text: currentText }] });

  try {
    let response = await ai.models.generateContent({
      model,
      contents,
      config: { systemInstruction, tools, toolConfig }
    });

    let turns = 0;
    while (response.functionCalls && response.functionCalls.length > 0 && turns < 5) {
        turns++;
        const functionCalls = response.functionCalls;
        
        if (response.candidates?.[0]?.content) {
            contents.push(response.candidates[0].content);
        }

        const functionResponses = functionCalls.map(call => {
            const args = call.args as any;
            let result: any = { status: 'failed', message: 'Unknown function' };

            try {
                if (call.name === 'getCurrentWeather') {
                    result = mockWeatherApi(args.location);
                } else if (call.name === 'sendEmail') {
                    // Inject the user's email as the sender in the mock log
                    result = mockEmailApi(profile.email, args.to, args.subject, args.body);
                } else if (call.name === 'scheduleEvent') {
                    result = mockCalendarApi(profile.name, args.title, args.dateTime, args.durationMinutes);
                }
            } catch (e) {
                result = { status: 'error', message: String(e) };
            }

            return { id: call.id, name: call.name, response: { result } };
        });

        contents.push({
            role: 'function',
            parts: functionResponses.map(fr => ({ functionResponse: fr }))
        });

        response = await ai.models.generateContent({
            model,
            contents,
            config: { systemInstruction, tools, toolConfig }
        });
    }

    const grounding = response.candidates?.[0]?.groundingMetadata;
    let text = response.text || "Task executed.";

    if (grounding?.groundingChunks) {
      const sources: string[] = [];
      grounding.groundingChunks.forEach((chunk: any) => {
          if (chunk.web?.uri) sources.push(`[${chunk.web.title}](${chunk.web.uri})`);
          if (chunk.maps?.uri) sources.push(`[${chunk.maps.title || 'Location'}](${chunk.maps.uri})`);
      });
      const uniqueSources = [...new Set(sources)];
      if (uniqueSources.length > 0) {
        text += `\n\n**Reference Sources:**\n${uniqueSources.join('\n')}`;
      }
    }

    return text;

  } catch (error) {
    console.error("Execution Error:", error);
    return "Execution failed.";
  }
};
