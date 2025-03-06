
import { ChatMessage } from "@/types";

export interface ChatLog {
  id: string;
  date: Date;
  messages: ChatMessage[];
  serviceType?: string;
  quoteGenerated?: boolean;
}

// localStorageにログを保存するキー
const CHAT_LOGS_KEY = 'print_ai_chat_logs';

// 新しいチャットログを保存する
export function saveChatLog(messages: ChatMessage[], serviceType?: string, quoteGenerated: boolean = false): void {
  const logs = getChatLogs();
  
  const newLog: ChatLog = {
    id: Date.now().toString(),
    date: new Date(),
    messages: [...messages],
    serviceType,
    quoteGenerated
  };
  
  logs.unshift(newLog); // 新しいログを先頭に追加
  
  // 最大100件のログを保持
  const trimmedLogs = logs.slice(0, 100);
  localStorage.setItem(CHAT_LOGS_KEY, JSON.stringify(trimmedLogs));
}

// 全てのチャットログを取得する
export function getChatLogs(): ChatLog[] {
  const logsJson = localStorage.getItem(CHAT_LOGS_KEY);
  if (!logsJson) return [];
  
  try {
    const logs = JSON.parse(logsJson);
    // 日付文字列をDateオブジェクトに変換
    return logs.map((log: any) => ({
      ...log,
      date: new Date(log.date),
      // messagesの各メッセージのtimestampをDateオブジェクトに変換
      messages: log.messages.map((msg: any) => ({
        ...msg,
        timestamp: new Date(msg.timestamp)
      }))
    }));
  } catch (error) {
    console.error('チャットログの解析に失敗しました:', error);
    return [];
  }
}

// チャットログを削除する
export function deleteChatLog(id: string): void {
  const logs = getChatLogs();
  const filteredLogs = logs.filter(log => log.id !== id);
  localStorage.setItem(CHAT_LOGS_KEY, JSON.stringify(filteredLogs));
}

// 全てのチャットログを削除する
export function clearAllChatLogs(): void {
  localStorage.removeItem(CHAT_LOGS_KEY);
}
