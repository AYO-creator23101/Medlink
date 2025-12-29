import { GoogleGenAI, GenerateContentResponse, Type } from "@google/genai";
import { GroundingChunk } from '../types';

if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export async function findNearbySpecialists(
  specialty: string,
  location: { latitude: number; longitude: number }
): Promise<{ text: string, groundingChunks: GroundingChunk[] }> {
  try {
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `Find ${specialty} specialists near me. Provide a brief description for each.`,
      config: {
        tools: [{ googleMaps: {} }],
        toolConfig: {
          retrievalConfig: {
            latLng: {
              latitude: location.latitude,
              longitude: location.longitude
            }
          }
        }
      },
    });

    const text = response.text;
    const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks as GroundingChunk[] || [];
    
    return { text, groundingChunks };
  } catch (error) {
    console.error("Error finding nearby specialists:", error);
    return { text: "Sorry, I couldn't find any specialists at the moment. Please try again later.", groundingChunks: [] };
  }
}

export async function findNearbyPharmacies(
  location: { latitude: number; longitude: number }
): Promise<{ text: string, groundingChunks: GroundingChunk[] }> {
  try {
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `Find pharmacies near me. List at least 5 options if available.`,
      config: {
        tools: [{ googleMaps: {} }],
        toolConfig: {
          retrievalConfig: {
            latLng: {
              latitude: location.latitude,
              longitude: location.longitude
            }
          }
        }
      },
    });

    const text = response.text;
    const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks as GroundingChunk[] || [];
    
    return { text, groundingChunks };
  } catch (error) {
    console.error("Error finding nearby pharmacies:", error);
    return { text: "Sorry, I couldn't find any pharmacies at the moment. Please try again later.", groundingChunks: [] };
  }
}


export async function getSymptomCheckerResponse(
  history: { role: 'user' | 'model'; parts: { text: string }[] }[],
  newMessage: string
): Promise<string> {
    try {
        const chat = ai.chats.create({
            model: 'gemini-2.5-flash',
            config: {
                systemInstruction: "You are a helpful AI Triage Symptom Checker for Medlink. You are not a doctor and your advice is not a substitute for professional medical consultation. Start by introducing yourself and stating this disclaimer clearly. Keep your responses concise and helpful. Always advise users to consult a real doctor for serious issues or if symptoms persist. When you advise consulting a doctor, end your response with the exact phrase: 'To find a specialist, you can [consult a doctor](find-doctor).'"
            },
            history: history,
        });

        const response = await chat.sendMessage({ message: newMessage });
        return response.text;
    } catch (error) {
        console.error("Error with symptom checker:", error);
        return "I'm having trouble connecting right now. Please try again in a moment.";
    }
}

export async function findNearbyLabs(
  testName: string,
  location: { latitude: number; longitude: number }
): Promise<{ text: string, groundingChunks: GroundingChunk[] }> {
  try {
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `Find diagnostic centers or labs near me that offer "${testName}". Provide a list of options with addresses and opening hours if available.`,
      config: {
        tools: [{ googleMaps: {} }],
        toolConfig: {
          retrievalConfig: {
            latLng: {
              latitude: location.latitude,
              longitude: location.longitude
            }
          }
        }
      },
    });

    const text = response.text;
    const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks as GroundingChunk[] || [];
    
    return { text, groundingChunks };
  } catch (error) {
    console.error("Error finding nearby labs:", error);
    return { text: "Sorry, I couldn't find any labs for that test at the moment. Please try again later.", groundingChunks: [] };
  }
}

export async function summarizeConsultation(chatHistory: string): Promise<{ subjective: string, objective: string, assessment: string, plan: string }> {
    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: `Based on the following consultation transcript, generate a clinical summary in the SOAP note format (Subjective, Objective, Assessment, Plan). Be concise and professional.
            Transcript:
            ${chatHistory}`,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        subjective: { type: Type.STRING, description: "Patient's reported symptoms and feelings." },
                        objective: { type: Type.STRING, description: "Doctor's objective findings and observations." },
                        assessment: { type: Type.STRING, description: "Doctor's diagnosis or clinical impression." },
                        plan: { type: Type.STRING, description: "Treatment plan, next steps, and follow-up." },
                    },
                    required: ["subjective", "objective", "assessment", "plan"],
                },
            },
        });

        const jsonStr = response.text.trim();
        return JSON.parse(jsonStr);
    } catch (error) {
        console.error("Error summarizing consultation:", error);
        return {
            subjective: 'Error generating summary.',
            objective: 'Please review the transcript manually.',
            assessment: '',
            plan: '',
        };
    }
}