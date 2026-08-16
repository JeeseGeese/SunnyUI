import { useEffect, useState } from "react";
import {
  isValidSunnyBackgroundMode,
  readStoredSunnyBackgroundMode,
  SUNNY_BACKGROUND_STORAGE_KEY
} from "../theme/backgroundMode";

export default function useSunnyBackgroundMode() {
  const [mode, setModeState] = useState(readStoredSunnyBackgroundMode);

  useEffect(() => {
    document.documentElement.setAttribute("data-sunny-background", mode);
    try {
      window.localStorage.setItem(SUNNY_BACKGROUND_STORAGE_KEY, mode);
    } catch {
      // localStorage unavailable (private mode, disabled storage, etc.) - mode still works for this session.
    }
  }, [mode]);

  function setMode(next) {
    if (isValidSunnyBackgroundMode(next)) setModeState(next);
  }

  return [mode, setMode];
}
