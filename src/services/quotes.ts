import { QuoteDetails } from '@/types';

// ローカルストレージのキー
const QUOTES_STORAGE_KEY = 'saved_quotes';

/**
 * 保存された見積もりをローカルストレージから取得
 */
export const getSavedQuotes = (): QuoteDetails[] => {
  try {
    const savedQuotes = localStorage.getItem(QUOTES_STORAGE_KEY);
    return savedQuotes ? JSON.parse(savedQuotes) : [];
  } catch (error) {
    console.error('見積もりデータの取得に失敗しました:', error);
    return [];
  }
};

/**
 * 見積もりをローカルストレージに保存
 */
export const saveQuote = (quote: QuoteDetails): Promise<QuoteDetails> => {
  return new Promise((resolve, reject) => {
    try {
      // 既存の見積もりを取得
      const existingQuotes = getSavedQuotes();
      
      // 重複IDチェック（実際のAPIではサーバーでIDが生成されるが、ここではフロントエンドでシミュレーション）
      const timestamp = new Date().getTime();
      const newQuote = {
        ...quote,
        id: quote.id || `Q-${timestamp}`, // IDがない場合は生成
        createdAt: quote.createdAt || new Date().toISOString(),
      };
      
      // 配列の先頭に追加（最新順）
      const updatedQuotes = [newQuote, ...existingQuotes];
      
      // ローカルストレージに保存
      localStorage.setItem(QUOTES_STORAGE_KEY, JSON.stringify(updatedQuotes));
      
      // データ保存を模擬的に非同期処理
      setTimeout(() => {
        resolve(newQuote);
      }, 800);
    } catch (error) {
      console.error('見積もりの保存に失敗しました:', error);
      reject(error);
    }
  });
};

/**
 * 見積もりIDで削除
 */
export const deleteQuote = (quoteId: string): Promise<boolean> => {
  return new Promise((resolve, reject) => {
    try {
      const existingQuotes = getSavedQuotes();
      const filteredQuotes = existingQuotes.filter(quote => quote.id !== quoteId);
      
      // 削除前後で数が変わらない場合はIDが見つからなかった
      if (filteredQuotes.length === existingQuotes.length) {
        throw new Error('見積もりが見つかりませんでした');
      }
      
      localStorage.setItem(QUOTES_STORAGE_KEY, JSON.stringify(filteredQuotes));
      
      // 非同期処理をシミュレーション
      setTimeout(() => {
        resolve(true);
      }, 500);
    } catch (error) {
      console.error('見積もりの削除に失敗しました:', error);
      reject(error);
    }
  });
};
