import { SavedPlanState, CURRENT_STORAGE_SCHEMA_VERSION, STORAGE_KEY } from '../types/storage';
import { GeneratedTask } from '../types/recommendations';

// In-memory fallback storage in case browser localStorage is unavailable or blocked (e.g. private mode, cookies disabled)
let memoryStore: Record<string, string> = {};

function isLocalStorageAvailable(): boolean {
  try {
    const testKey = '__storage_test__';
    window.localStorage.setItem(testKey, testKey);
    window.localStorage.removeItem(testKey);
    return true;
  } catch {
    return false;
  }
}

const storageAvailable = typeof window !== 'undefined' && isLocalStorageAvailable();

/**
 * Saves plan state to localStorage with in-memory fallback.
 */
export function savePlanToStorage(plan: SavedPlanState): { success: boolean; error?: string } {
  try {
    const serialized = JSON.stringify({
      ...plan,
      schemaVersion: CURRENT_STORAGE_SCHEMA_VERSION,
      lastUpdated: new Date().toISOString(),
    });

    if (storageAvailable) {
      window.localStorage.setItem(STORAGE_KEY, serialized);
    } else {
      memoryStore[STORAGE_KEY] = serialized;
    }
    return { success: true };
  } catch (err) {
    console.error('Failed to save to localStorage:', err);
    try {
      // In-memory fallback if storage quota exceeded
      memoryStore[STORAGE_KEY] = JSON.stringify(plan);
      return { success: true };
    } catch {
      return { success: false, error: 'Storage quota exceeded or browser storage blocked.' };
    }
  }
}

/**
 * Loads plan state from localStorage with validation and corrupt-data recovery.
 */
export function loadPlanFromStorage(): SavedPlanState | null {
  try {
    let raw: string | null = null;
    if (storageAvailable) {
      raw = window.localStorage.getItem(STORAGE_KEY);
    } else {
      raw = memoryStore[STORAGE_KEY] || null;
    }

    if (!raw) return null;

    const parsed = JSON.parse(raw);

    // Validate essential structure
    if (!parsed || typeof parsed !== 'object') {
      console.warn('Invalid storage content encountered; resetting');
      return null;
    }

    // Check version compatibility
    if (parsed.schemaVersion !== CURRENT_STORAGE_SCHEMA_VERSION) {
      console.warn(`Storage schema mismatch (${parsed.schemaVersion} vs ${CURRENT_STORAGE_SCHEMA_VERSION}); attempting safe recovery`);
      // If we need migrations in future versions, handle here. For now, ensure core structures exist
    }

    if (!parsed.answers || !Array.isArray(parsed.tasks) || !parsed.scoreResult) {
      console.warn('Corrupt storage payload missing required keys; discarding');
      return null;
    }

    return parsed as SavedPlanState;
  } catch (err) {
    console.error('Error reading saved plan from localStorage; clearing corrupted data:', err);
    clearPlanStorage();
    return null;
  }
}

/**
 * Updates a single task in storage.
 */
export function updateTaskInStorage(
  taskId: string,
  updater: (prev: GeneratedTask) => GeneratedTask
): SavedPlanState | null {
  const current = loadPlanFromStorage();
  if (!current) return null;

  const updatedTasks = current.tasks.map((task) => {
    if (task.id === taskId) {
      return updater(task);
    }
    return task;
  });

  const updatedPlan: SavedPlanState = {
    ...current,
    tasks: updatedTasks,
    lastUpdated: new Date().toISOString(),
  };

  savePlanToStorage(updatedPlan);
  return updatedPlan;
}

/**
 * Clears plan data from localStorage and in-memory store.
 */
export function clearPlanStorage(): void {
  try {
    if (storageAvailable) {
      window.localStorage.removeItem(STORAGE_KEY);
    }
    delete memoryStore[STORAGE_KEY];
  } catch (err) {
    console.error('Failed to clear storage:', err);
  }
}

/**
 * Updates or removes the reminders subscription in storage.
 */
export function updateRemindersSubscriptionInStorage(
  subscription: SavedPlanState['remindersSubscription']
): SavedPlanState | null {
  const current = loadPlanFromStorage();
  if (!current) return null;

  const updatedPlan: SavedPlanState = {
    ...current,
    remindersSubscription: subscription,
    lastUpdated: new Date().toISOString(),
  };

  savePlanToStorage(updatedPlan);
  return updatedPlan;
}
