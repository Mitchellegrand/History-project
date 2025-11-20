import { GoogleGenAI, Modality } from "@google/genai";

const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

// --- Helper Functions for Audio Decoding ---
function decode(base64: string) {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

async function decodeAudioData(
  data: Uint8Array,
  ctx: AudioContext,
  sampleRate: number,
  numChannels: number,
): Promise<AudioBuffer> {
  const dataInt16 = new Int16Array(data.buffer);
  const frameCount = dataInt16.length / numChannels;
  const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);

  for (let channel = 0; channel < numChannels; channel++) {
    const channelData = buffer.getChannelData(channel);
    for (let i = 0; i < frameCount; i++) {
      channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
    }
  }
  return buffer;
}

// --- Existing Text Services ---

export const generateExplanation = async (topic: string, context: string): Promise<string> => {
  if (!apiKey) return "API Key not configured. Please check your environment variables.";

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `You are a helpful history tutor for a Year 10 student.
      
      The student is studying: "${topic}".
      Context from their notes: "${context}".
      
      Please provide a concise, engaging paragraph explaining why this event is historically significant. Keep it under 150 words. Focus on cause and effect.`,
    });
    return response.text || "No explanation generated.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Sorry, I couldn't generate an explanation at this time.";
  }
};

export const chatWithTutor = async (message: string, historyContext: string): Promise<string> => {
  if (!apiKey) return "API Key not configured.";

  try {
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: `You are an expert history tutor helping a Year 10 student prepare for their exam.
        The exam covers World War 2 (Rise of Nazism, Pacific War) and Rights & Freedoms in Australia (1930s-1990s).
        
        Here is some specific context about the events the student is looking at right now:
        ${historyContext}

        Student Question: ${message}

        Answer accurately, citing specific dates or names if relevant. Keep the tone encouraging and educational.`,
    });
    return response.text || "I didn't catch that.";
  } catch (error) {
    console.error("Chat Error:", error);
    return "I'm having trouble connecting to the history archives (API Error).";
  }
}

// --- New Visual & Audio Services ---

export const generateEventAudio = async (text: string): Promise<AudioBuffer | null> => {
    if (!apiKey) return null;

    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash-preview-tts",
            contents: [{ parts: [{ text: `(Deep, documentary style narration) ${text}` }] }],
            config: {
                responseModalities: [Modality.AUDIO],
                speechConfig: {
                    voiceConfig: {
                        prebuiltVoiceConfig: { voiceName: 'Fenrir' }, 
                    },
                },
            },
        });

        const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
        if (!base64Audio) throw new Error("No audio data returned");

        const outputAudioContext = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
        const audioBuffer = await decodeAudioData(
            decode(base64Audio),
            outputAudioContext,
            24000,
            1,
        );
        return audioBuffer;

    } catch (error) {
        console.error("TTS Error:", error);
        return null;
    }
};

export const generateEventImage = async (description: string): Promise<string | null> => {
    if (!apiKey) return null;

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash-image',
            contents: {
                parts: [
                    {
                        text: `Create a highly detailed, historically accurate visualization of this event: ${description}. Cinematic lighting, 8k resolution, photorealistic style.`,
                    },
                ],
            },
            config: {
                responseModalities: [Modality.IMAGE],
            },
        });

        for (const part of response.candidates?.[0]?.content?.parts || []) {
            if (part.inlineData) {
                const base64ImageBytes: string = part.inlineData.data;
                // Defaulting to jpeg as it's safer for broad compatibility
                return `data:image/jpeg;base64,${base64ImageBytes}`;
            }
        }
        return null;
    } catch (error) {
        console.error("Image Gen Error:", error);
        return null;
    }
};

export const editEventImage = async (base64Image: string, prompt: string): Promise<string | null> => {
    if (!apiKey) return null;

    // Robustly remove any data URI prefix to get raw base64
    const base64Data = base64Image.replace(/^data:image\/\w+;base64,/, '');

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash-image',
            contents: {
                parts: [
                    {
                        inlineData: {
                            data: base64Data,
                            mimeType: 'image/jpeg', // Sending as jpeg usually works best
                        },
                    },
                    {
                        text: `Edit this image: ${prompt}`,
                    },
                ],
            },
            config: {
                responseModalities: [Modality.IMAGE],
            },
        });

        for (const part of response.candidates?.[0]?.content?.parts || []) {
            if (part.inlineData) {
                const base64ImageBytes: string = part.inlineData.data;
                return `data:image/jpeg;base64,${base64ImageBytes}`;
            }
        }
        return null;
    } catch (error) {
        console.error("Image Edit Error:", error);
        return null;
    }
};