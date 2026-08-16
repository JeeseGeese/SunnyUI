export const SUNNY_BACKGROUND_MODES = ["light", "dark", "party"];

export const DEFAULT_SUNNY_BACKGROUND_MODE = "light";

export const SUNNY_BACKGROUND_STORAGE_KEY = "sunny-background-mode";

export function isValidSunnyBackgroundMode(value) {
  return SUNNY_BACKGROUND_MODES.includes(value);
}

export function readStoredSunnyBackgroundMode() {
  try {
    const stored = window.localStorage.getItem(SUNNY_BACKGROUND_STORAGE_KEY);
    return isValidSunnyBackgroundMode(stored) ? stored : DEFAULT_SUNNY_BACKGROUND_MODE;
  } catch {
    return DEFAULT_SUNNY_BACKGROUND_MODE;
  }
}
