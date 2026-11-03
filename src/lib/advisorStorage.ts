import { Conversation, ChatMessage, GeneratedMarketingStrategy } from '../types/advisor';

const CONVERSATIONS_STORAGE_KEY = 'tapgrow_advisor_conversations_v1';
const ACTIVE_CONV_KEY = 'tapgrow_advisor_active_conv_v1';
const STRATEGIES_STORAGE_KEY = 'tapgrow_saved_strategies_v1';

let memoryStore: Record<string, string> = {};

function isLocalStorageAvailable(): boolean {
  try {
    const testKey = '__advisor_test__';
    window.localStorage.setItem(testKey, testKey);
    window.localStorage.removeItem(testKey);
    return true;
  } catch {
    return false;
  }
}

const storageAvailable = typeof window !== 'undefined' && isLocalStorageAvailable();

function getItem(key: string): string | null {
  if (storageAvailable) {
    return window.localStorage.getItem(key);
  }
  return memoryStore[key] || null;
}

function setItem(key: string, value: string): void {
  if (storageAvailable) {
    try {
      window.localStorage.setItem(key, value);
      return;
    } catch (err) {
      console.warn('LocalStorage write failed, using in-memory store:', err);
    }
  }
  memoryStore[key] = value;
}

function removeItem(key: string): void {
  if (storageAvailable) {
    window.localStorage.removeItem(key);
  }
  delete memoryStore[key];
}

/**
 * Loads all saved conversations sorted by updatedAt descending.
 */
export function loadAllConversations(): Conversation[] {
  try {
    const raw = getItem(CONVERSATIONS_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.sort(
      (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
    );
  } catch (err) {
    console.error('Failed to load conversations from storage:', err);
    return [];
  }
}

/**
 * Saves or updates a conversation.
 */
export function saveConversation(conv: Conversation): void {
  try {
    const all = loadAllConversations();
    const existingIndex = all.findIndex((c) => c.id === conv.id);
    const updated = {
      ...conv,
      updatedAt: new Date().toISOString(),
    };

    if (existingIndex >= 0) {
      all[existingIndex] = updated;
    } else {
      all.unshift(updated);
    }

    setItem(CONVERSATIONS_STORAGE_KEY, JSON.stringify(all));
    setActiveConversationId(updated.id);
  } catch (err) {
    console.error('Failed to save conversation:', err);
  }
}

/**
 * Creates a fresh empty conversation with a given initial title.
 */
export function createNewConversation(title = 'New Strategy Session'): Conversation {
  const now = new Date().toISOString();
  const id = `conv_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
  const newConv: Conversation = {
    id,
    title,
    createdAt: now,
    updatedAt: now,
    messages: [],
  };
  saveConversation(newConv);
  return newConv;
}

/**
 * Renames an existing conversation.
 */
export function renameConversation(id: string, newTitle: string): Conversation | null {
  try {
    const all = loadAllConversations();
    const conv = all.find((c) => c.id === id);
    if (!conv) return null;
    conv.title = newTitle.trim() || 'Untitled Session';
    conv.updatedAt = new Date().toISOString();
    setItem(CONVERSATIONS_STORAGE_KEY, JSON.stringify(all));
    return conv;
  } catch (err) {
    console.error('Failed to rename conversation:', err);
    return null;
  }
}

/**
 * Deletes a conversation by ID.
 */
export function deleteConversation(id: string): void {
  try {
    const all = loadAllConversations();
    const filtered = all.filter((c) => c.id !== id);
    setItem(CONVERSATIONS_STORAGE_KEY, JSON.stringify(filtered));

    if (getActiveConversationId() === id) {
      if (filtered.length > 0) {
        setActiveConversationId(filtered[0].id);
      } else {
        removeItem(ACTIVE_CONV_KEY);
      }
    }
  } catch (err) {
    console.error('Failed to delete conversation:', err);
  }
}

/**
 * Clears all conversations.
 */
export function clearAllConversations(): void {
  removeItem(CONVERSATIONS_STORAGE_KEY);
  removeItem(ACTIVE_CONV_KEY);
}

/**
 * Gets currently active conversation ID.
 */
export function getActiveConversationId(): string | null {
  return getItem(ACTIVE_CONV_KEY);
}

/**
 * Sets currently active conversation ID.
 */
export function setActiveConversationId(id: string): void {
  setItem(ACTIVE_CONV_KEY, id);
}

/**
 * Appends a message to a conversation and auto-generates a title from the first user prompt if default.
 */
export function appendMessageToConversation(convId: string, message: ChatMessage): Conversation | null {
  const all = loadAllConversations();
  const conv = all.find((c) => c.id === convId);
  if (!conv) return null;

  conv.messages.push(message);
  conv.updatedAt = new Date().toISOString();

  // If title is default and user sent first message, generate a 4-6 word title
  if (
    (conv.title === 'New Strategy Session' || conv.title === 'Marketing Advice') &&
    message.role === 'user'
  ) {
    const cleanPrompt = message.content.trim().replace(/[?!.]/g, '');
    const words = cleanPrompt.split(/\s+/).slice(0, 5).join(' ');
    if (words) {
      conv.title = words.charAt(0).toUpperCase() + words.slice(1);
    }
  }

  setItem(CONVERSATIONS_STORAGE_KEY, JSON.stringify(all));
  return conv;
}

/**
 * Saved Marketing Strategies
 */
export function loadSavedStrategies(): GeneratedMarketingStrategy[] {
  try {
    const raw = getItem(STRATEGIES_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  } catch {
    return [];
  }
}

export function saveMarketingStrategy(strategy: GeneratedMarketingStrategy): void {
  try {
    const all = loadSavedStrategies();
    const existingIndex = all.findIndex((s) => s.id === strategy.id);
    if (existingIndex >= 0) {
      all[existingIndex] = strategy;
    } else {
      all.unshift(strategy);
    }
    setItem(STRATEGIES_STORAGE_KEY, JSON.stringify(all));
  } catch (err) {
    console.error('Failed to save strategy:', err);
  }
}

export function deleteMarketingStrategy(id: string): void {
  try {
    const all = loadSavedStrategies().filter((s) => s.id !== id);
    setItem(STRATEGIES_STORAGE_KEY, JSON.stringify(all));
  } catch (err) {
    console.error('Failed to delete strategy:', err);
  }
}
