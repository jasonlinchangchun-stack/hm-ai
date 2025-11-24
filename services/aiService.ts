import { InterviewConfig, InterviewReport } from "../types";
import { GENERATE_REPORT_SCHEMA } from "../constants";

// Helper function to safely get the API key without crashing
const getApiKey = () => {
  try {
    // Check if import.meta and import.meta.env exist before accessing
    // This prevents "Accessing property 'env' of undefined" errors
    const env = (import.meta as any).env;
    if (env && env.VITE_DEEPSEEK_API_KEY) {
      return env.VITE_DEEPSEEK_API_KEY;
    }
  } catch (e) {
    // Ignore errors in environments where import.meta is not fully supported
  }
  return "";
};

const API_KEY = getApiKey();
const API_URL = "https://api.deepseek.com/chat/completions";

interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

let conversationHistory: ChatMessage[] = [];

// --- Browser Native TTS ---
export const speakText = (text: string) => {
  if (!('speechSynthesis' in window)) {
    console.warn("Browser does not support TTS");
    return;
  }

  // Cancel any ongoing speech
  window.speechSynthesis.cancel();

  // Strip markdown symbols for smoother reading (simple regex)
  const cleanText = text.replace(/[*#_]/g, '').replace(/\[.*?\]/g, ''); 

  const utterance = new SpeechSynthesisUtterance(cleanText);
  
  // Detect language to choose voice
  const isChinese = /[\u4e00-\u9fa5]/.test(cleanText);
  utterance.lang = isChinese ? 'zh-CN' : 'en-US';

  // Try to find a good voice
  const voices = window.speechSynthesis.getVoices();
  const preferredVoice = voices.find(v => 
    isChinese 
      ? (v.name.includes('Google') && v.lang.includes('zh')) || v.lang === 'zh-CN'
      : (v.name.includes('Google') && v.lang.includes('en')) || v.lang === 'en-US'
  );

  if (preferredVoice) {
    utterance.voice = preferredVoice;
  }

  utterance.rate = 1.0;
  utterance.pitch = 1.0;

  window.speechSynthesis.speak(utterance);
};

export const startInterview = async (config: InterviewConfig) => {
  conversationHistory = [
    { role: 'system', content: config.systemInstruction }
  ];
  return true;
};

export const sendMessageToAI = async (
  text: string, 
  audioBase64?: string
): Promise<{ text: string, audioData?: string }> => {
  
  if (!API_KEY) {
    // Alert the user only when they actually try to use it, not on app load
    alert("API Key 未配置。请在 Vercel 环境变量中设置 VITE_DEEPSEEK_API_KEY");
    throw new Error("API Key missing");
  }

  if (text) {
    conversationHistory.push({ role: 'user', content: text });
  }

  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_KEY}`
      },
      body: JSON.stringify({
        model: "deepseek-chat",
        messages: conversationHistory,
        temperature: 0.7,
        max_tokens: 1024,
        stream: false
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`DeepSeek API Error: ${errorData.error?.message || response.statusText}`);
    }

    const data = await response.json();
    const assistantMessage = data.choices[0].message.content;

    conversationHistory.push({ role: 'assistant', content: assistantMessage });

    // Trigger TTS locally
    speakText(assistantMessage);

    return { 
      text: assistantMessage, 
      audioData: undefined // We use browser TTS, so no audio file data needed
    };

  } catch (error) {
    console.error("DeepSeek Interaction Failed:", error);
    throw error;
  }
};

export const generateFinalReport = async (fullHistoryText: string): Promise<InterviewReport> => {
  if (!API_KEY) {
    throw new Error("API Key missing");
  }

  const reportSystemPrompt = `
    You are an expert HR Assessment Director at a top global firm (like HighMark Career).
    
    Task: Analyze the following interview transcript strictly based on the BEI (Behavioral Event Interview) methodology.
    Ignore the resume content for scoring; score ONLY based on the candidate's actual answers in the transcript.
    
    Transcript:
    ${fullHistoryText}
    
    OUTPUT FORMAT:
    You MUST output valid JSON only. Do not add markdown code blocks like \`\`\`json. Just the raw JSON string.
    The JSON structure must match this schema:
    {
      "overallScore": number (1-5, allowing decimals like 3.5),
      "overallSummary": "string (in Chinese, professional ATS style commentary)",
      "topStrengths": ["string", "string", "string"],
      "areasForImprovement": ["string", "string", "string"],
      "competencyAnalysis": [
        { "category": "string", "score": number, "feedback": "string" }
      ] (Must cover exactly 8 dimensions),
      "developmentPlan": {
        "shortTerm": ["string"],
        "longTerm": ["string"]
      }
    }
  `;

  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_KEY}`
      },
      body: JSON.stringify({
        model: "deepseek-chat",
        messages: [
          { role: 'system', content: reportSystemPrompt },
          { role: 'user', content: "Generate the assessment report now." }
        ],
        temperature: 0.3, // Lower temp for consistent JSON
        response_format: { type: 'json_object' } 
      })
    });

    if (!response.ok) {
        throw new Error("Report generation failed");
    }

    const data = await response.json();
    let jsonString = data.choices[0].message.content;
    
    // Clean potential markdown wrappers if DeepSeek adds them despite instructions
    jsonString = jsonString.replace(/```json/g, '').replace(/```/g, '').trim();

    return JSON.parse(jsonString) as InterviewReport;
  } catch (error) {
    console.error("Report Generation Error:", error);
    throw new Error("Failed to generate report");
  }
};
