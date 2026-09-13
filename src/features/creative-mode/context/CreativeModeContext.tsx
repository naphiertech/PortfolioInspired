"use client";

import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";
import { useReducedMotion } from "framer-motion";
import { usePresentationMode } from "@/features/presentation-modes/context/PresentationModeContext";
import { INITIAL_CREATIVE_STATE, supportsCreativeMode } from "../lib/creativeModeConfig";
import type { CreativeModeState, CreativeSettings, MotionLevel } from "../types/creativeMode";

interface CreativeModeValue {
  state: CreativeModeState;
  active: boolean;
  panelOpen: boolean;
  effectiveMotion: MotionLevel;
  setEnabled: (enabled: boolean) => void;
  setPanelOpen: (open: boolean) => void;
  updateSetting: <K extends keyof CreativeSettings>(key: K, value: CreativeSettings[K]) => void;
  reset: () => void;
}

const CreativeModeContext = createContext<CreativeModeValue | null>(null);

/** One in-memory owner under the root presentation provider, never keyed by route. */
export function CreativeModeProvider({ children }: { children: ReactNode }) {
  const { mode } = usePresentationMode();
  const reducedMotion = useReducedMotion();
  const [state, setState] = useState<CreativeModeState>(INITIAL_CREATIVE_STATE);
  const [panelOpen, setPanelOpen] = useState(false);
  const active = supportsCreativeMode(mode) && state.enabled;

  const setEnabled = useCallback((enabled: boolean) => {
    setState(previous => ({ ...previous, enabled }));
    setPanelOpen(false);
  }, []);
  const updateSetting = useCallback(<K extends keyof CreativeSettings,>(key: K, value: CreativeSettings[K]) => {
    setState(previous => ({ ...previous, [key]: value }));
  }, []);
  const reset = useCallback(() => {
    setState({ ...INITIAL_CREATIVE_STATE, enabled: true });
    setPanelOpen(true);
  }, []);

  const effectiveMotion = reducedMotion ? "off" : state.motion;
  const value = useMemo(() => ({
    state, active, panelOpen, effectiveMotion, setEnabled, setPanelOpen, updateSetting, reset,
  }), [state, active, panelOpen, effectiveMotion, setEnabled, updateSetting, reset]);

  return <CreativeModeContext.Provider value={value}>{children}</CreativeModeContext.Provider>;
}

export function useCreativeMode() {
  const value = useContext(CreativeModeContext);
  if (!value) throw new Error("useCreativeMode requires CreativeModeProvider");
  return value;
}
