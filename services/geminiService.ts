import { GoogleGenAI, Type } from "@google/genai";
import { AgentId, Message, AssessmentQuestion } from "../types";

// Initialize Gemini Client
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

// Constants for Models
const MODEL_STANDARD = 'gemini-2.5-flash';

/**
 * Handles the specific logic for each agent type.
 */
export const sendMessageToAgent = async (
  agentId: AgentId,
  history: Message[],
  userMessage: string
): Promise<Message> => {
  try {
    // 1. Resource Agent: Uses Google Search Grounding
    if (agentId === 'resource') {
      const response = await ai.models.generateContent({
        model: MODEL_STANDARD,
        contents: [
          ...history.map(m => ({ role: m.role === 'assistant' ? 'model' : 'user', parts: [{ text: m.content }] })),
          { role: 'user', parts: [{ text: userMessage }] }
        ],
        config: {
          systemInstruction: "You are a Resource Discovery Agent for the KasiRise Scholar Platform. Your mission is to help township learners access high-quality IEB (Independent Examinations Board) mathematics learning materials. Prioritize South African platforms like Siyavula and Mindset Learn. You MUST use the googleSearch tool to find the most current links.",
          tools: [{ googleSearch: {} }]
        }
      });

      // Extract Grounding Metadata
      const sources = response.candidates?.[0]?.groundingMetadata?.groundingChunks
        ?.map((chunk: any) => chunk.web)
        .filter((web: any) => web && web.uri && web.title);

      return {
        role: 'assistant',
        content: response.text || "I found some resources, but I couldn't generate a summary.",
        groundingSources: sources
      };
    }

    // 2. Assessment Agent: Uses JSON Mode for structured output
    if (agentId === 'assessment') {
        // We prompt specifically for a JSON structure
        const assessmentPrompt = `
          Generate a cognitive aptitude assessment question based on fluid intelligence (pattern recognition, logic).
          Return ONLY a JSON object. Do not include markdown formatting like \`\`\`json.
          
          The user says: "${userMessage}"
        `;

        const response = await ai.models.generateContent({
          model: MODEL_STANDARD,
          contents: [
              ...history.map(m => ({ role: m.role === 'assistant' ? 'model' : 'user', parts: [{ text: m.content }] })),
              { role: 'user', parts: [{ text: assessmentPrompt }] }
          ],
          config: {
            systemInstruction: "You are a Cognitive Aptitude Assessment Agent. You measure fluid intelligence, not prior schooling. Generate abstract reasoning and pattern recognition puzzles. You MUST respond in JSON format.",
            responseMimeType: "application/json",
            responseSchema: {
              type: Type.OBJECT,
              properties: {
                question: { type: Type.STRING, description: "The text description of the logic puzzle." },
                options: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Multiple choice options" },
                explanation: { type: Type.STRING, description: "Hidden explanation of the logic (for internal use/grading)" }
              },
              required: ["question", "options", "explanation"]
            }
          }
        });

        // The text is guaranteed to be a JSON string due to responseMimeType
        return {
          role: 'assistant',
          content: response.text || "{}",
          isJsonAssessment: true
        };
    }

    // 3. Socratic Mentor & 4. Advocacy Agent (Standard Text Generation)
    let systemInstruction = "";
    if (agentId === 'mentor') {
      systemInstruction = `You are a Socratic Mathematics Mentor. 
      1. NEVER solve problems directly. 
      2. Ask probing questions. 
      3. Use analogies from South African township life. 
      4. Break complex concepts into small steps.`;
    } else if (agentId === 'advocacy') {
      systemInstruction = `You are an Advocacy Assistant. 
      1. Draft personalized scholarship application letters. 
      2. Emphasize potential and growth mindset. 
      3. Always end with: "Review required by human mentor before submission."`;
    }

    const response = await ai.models.generateContent({
      model: MODEL_STANDARD,
      contents: [
        ...history.map(m => ({ role: m.role === 'assistant' ? 'model' : 'user', parts: [{ text: m.content }] })),
        { role: 'user', parts: [{ text: userMessage }] }
      ],
      config: {
        systemInstruction: systemInstruction,
      }
    });

    return {
      role: 'assistant',
      content: response.text || "I apologize, I could not generate a response."
    };

  } catch (error) {
    console.error("Gemini API Error:", error);
    return {
      role: 'assistant',
      content: "I'm having trouble connecting to the KasiRise network. Please try again.",
      isError: true
    };
  }
};
