
// AIサービスのインターフェース
import { ChatMessage } from '@/types';

// API Keyの一時保存用
let tempApiKey: string | null = null;

export const setApiKey = (key: string) => {
  tempApiKey = key;
  localStorage.setItem('gemini_api_key', key);
};

export const getApiKey = (): string | null => {
  if (tempApiKey) return tempApiKey;
  return localStorage.getItem('gemini_api_key');
};

// Google Gemini APIを使って応答を生成する
export const generateAIResponse = async (messages: ChatMessage[], language: 'ja' | 'en' | 'zh' | 'ko'): Promise<string> => {
  const apiKey = getApiKey();
  
  if (!apiKey) {
    throw new Error('API key is not set');
  }

  try {
    // 最新のユーザーメッセージを取得
    const latestUserMessage = [...messages].reverse().find(m => m.sender === 'user');
    
    if (!latestUserMessage) {
      throw new Error('No user message found');
    }

    // システムプロンプトを言語に応じて設定
    const systemPrompt = {
      ja: "あなたは印刷業界のプロフェッショナルアシスタントです。印刷、製本、物流、環境印刷に関する質問に丁寧に回答してください。専門知識を活かして、わかりやすく説明してください。",
      en: "You are a professional assistant in the printing industry. Please politely answer questions about printing, binding, logistics, and eco-friendly printing. Use your expertise to explain clearly.",
      zh: "您是印刷行业的专业助手。请礼貌地回答有关印刷、装订、物流和环保印刷的问题。利用您的专业知识进行清晰解释。",
      ko: "귀하는 인쇄 산업의 전문 어시스턴트입니다. 인쇄, 제본, 물류 및 친환경 인쇄에 관한 질문에 정중하게 답변해 주세요. 전문 지식을 활용하여 명확하게 설명해 주세요."
    };

    // Gemini API エンドポイント
    const apiUrl = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent';
    
    const response = await fetch(`${apiUrl}?key=${apiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              { text: systemPrompt[language] },
              { text: latestUserMessage.content }
            ]
          }
        ],
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 1024,
        },
        safetySettings: [
          {
            category: "HARM_CATEGORY_HARASSMENT",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          },
          {
            category: "HARM_CATEGORY_HATE_SPEECH",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          },
          {
            category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          },
          {
            category: "HARM_CATEGORY_DANGEROUS_CONTENT",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          }
        ]
      }),
    });

    const data = await response.json();
    
    if (data.error) {
      throw new Error(data.error.message || 'Failed to generate response');
    }

    // レスポンスから生成されたテキストを抽出
    const generatedText = data.candidates[0]?.content?.parts[0]?.text;
    
    if (!generatedText) {
      throw new Error('No text generated');
    }

    return generatedText;
  } catch (error) {
    console.error('Error generating AI response:', error);
    throw error;
  }
};

// APIキー設定状態確認
export const isApiKeySet = (): boolean => {
  return !!getApiKey();
};
