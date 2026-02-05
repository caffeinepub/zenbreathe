import { STORAGE_KEYS } from './storageKeys';

export type AmbientMode = 'off' | 'rain' | 'waves';

// Safe localStorage getter with fallback
function getStorageItem(key: string, defaultValue: string): string {
  try {
    const value = localStorage.getItem(key);
    return value !== null ? value : defaultValue;
  } catch {
    return defaultValue;
  }
}

// Safe localStorage setter
function setStorageItem(key: string, value: string): void {
  try {
    localStorage.setItem(key, value);
  } catch {
    // Silent fail
  }
}

// Ambient Mode
export function getAmbientMode(): AmbientMode {
  const value = getStorageItem(STORAGE_KEYS.AMBIENT_MODE, 'off');
  if (value === 'rain' || value === 'waves' || value === 'off') {
    return value;
  }
  return 'off';
}

export function setAmbientMode(mode: AmbientMode): void {
  setStorageItem(STORAGE_KEYS.AMBIENT_MODE, mode);
}

// Ambient Volume (0-100)
export function getAmbientVolume(): number {
  const value = getStorageItem(STORAGE_KEYS.AMBIENT_VOLUME, '50');
  const parsed = parseInt(value, 10);
  if (isNaN(parsed)) return 50;
  return Math.max(0, Math.min(100, parsed));
}

export function setAmbientVolume(volume: number): void {
  const clamped = Math.max(0, Math.min(100, Math.round(volume)));
  setStorageItem(STORAGE_KEYS.AMBIENT_VOLUME, clamped.toString());
}

// Guided Meditation Enabled
export function getGuidedMeditationEnabled(): boolean {
  const value = getStorageItem(STORAGE_KEYS.GUIDED_MEDITATION_ENABLED, 'true');
  return value === 'true';
}

export function setGuidedMeditationEnabled(enabled: boolean): void {
  setStorageItem(STORAGE_KEYS.GUIDED_MEDITATION_ENABLED, enabled.toString());
}
