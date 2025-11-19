import { GoogleGenAI, Modality } from "@google/genai";

const getClient = () => {
    const apiKey = process.env.API_KEY;
    if (!apiKey) {
        console.error("API Key not found");
        throw new Error("API Key is required");
    }
    return new GoogleGenAI({ apiKey });
};

// Helper to convert raw PCM to WAV for browser playback
const pcmToWav = (base64Pcm: string, sampleRate: number = 24000): string => {
    const binaryString = atob(base64Pcm);
    const len = binaryString.length;
    const buffer = new ArrayBuffer(44 + len);
    const view = new DataView(buffer);

    const writeString = (offset: number, string: string) => {
        for (let i = 0; i < string.length; i++) {
            view.setUint8(offset + i, string.charCodeAt(i));
        }
    };

    // RIFF identifier
    writeString(0, 'RIFF');
    // file length
    view.setUint32(4, 36 + len, true);
    // RIFF type
    writeString(8, 'WAVE');
    // format chunk identifier
    writeString(12, 'fmt ');
    // format chunk length
    view.setUint32(16, 16, true);
    // sample format (raw)
    view.setUint16(20, 1, true);
    // channel count (mono)
    view.setUint16(22, 1, true);
    // sample rate
    view.setUint32(24, sampleRate, true);
    // byte rate (sample rate * block align)
    view.setUint32(28, sampleRate * 2, true);
    // block align (channel count * bytes per sample)
    view.setUint16(32, 2, true);
    // bits per sample
    view.setUint16(34, 16, true);
    // data chunk identifier
    writeString(36, 'data');
    // data chunk length
    view.setUint32(40, len, true);

    // Write PCM samples
    const pcmData = new Uint8Array(buffer, 44);
    for (let i = 0; i < len; i++) {
        pcmData[i] = binaryString.charCodeAt(i);
    }

    // Convert back to base64
    let binary = '';
    const bytes = new Uint8Array(buffer);
    // Process in chunks to avoid stack overflow
    const chunk = 8192;
    for (let i = 0; i < bytes.length; i += chunk) {
        binary += String.fromCharCode.apply(null, Array.from(bytes.subarray(i, i + chunk)));
    }
    return btoa(binary);
};

export const generateScript = async (prompt: string): Promise<string> => {
  try {
    const ai = getClient();
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `Write a short, engaging video script or captions for a video about: ${prompt}. Keep it under 100 words.`,
    });
    return response.text || "Could not generate script.";
  } catch (error) {
    console.error("Script generation error:", error);
    return "Error generating script. Please check API Key.";
  }
};

export const generateImage = async (prompt: string): Promise<string | null> => {
  try {
    const ai = getClient();
    // Using the newer imagen model as requested in guidelines
    const response = await ai.models.generateImages({
      model: 'imagen-4.0-generate-001',
      prompt: prompt,
      config: {
        numberOfImages: 1,
        outputMimeType: 'image/jpeg',
        aspectRatio: '16:9',
      },
    });
    
    const base64ImageBytes = response.generatedImages?.[0]?.image?.imageBytes;
    if (base64ImageBytes) {
        return `data:image/jpeg;base64,${base64ImageBytes}`;
    }
    return null;
  } catch (error) {
    console.error("Image generation error:", error);
    // Fallback to flash-image if imagen fails or unavailable
    try {
        console.log("Retrying with Gemini Flash Image...");
        const ai = getClient();
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash-image',
            contents: {
                parts: [{ text: prompt }]
            },
            config: {
                responseModalities: [Modality.IMAGE]
            }
        });
        
        const part = response.candidates?.[0]?.content?.parts?.[0];
        if (part?.inlineData) {
            return `data:image/png;base64,${part.inlineData.data}`;
        }
    } catch(e) {
        console.error("Fallback failed", e);
    }
    return null;
  }
};

export const generateSpeech = async (text: string, voice: string = 'Kore'): Promise<string | null> => {
  try {
    const ai = getClient();
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-preview-tts",
      contents: [{ parts: [{ text }] }],
      config: {
        responseModalities: [Modality.AUDIO],
        speechConfig: {
            voiceConfig: {
              prebuiltVoiceConfig: { voiceName: voice },
            },
        },
      },
    });

    const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
    if (base64Audio) {
        // Fix: Convert raw PCM to WAV
        const wavBase64 = pcmToWav(base64Audio, 24000); 
        return `data:audio/wav;base64,${wavBase64}`; 
    }
    return null;
  } catch (error) {
    console.error("TTS error:", error);
    return null;
  }
};