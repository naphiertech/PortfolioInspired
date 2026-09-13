"use client";

import { useId } from "react";
import { motion, useIsPresent, useReducedMotion } from "framer-motion";
import { X } from "lucide-react";
import { usePresentationMode } from "@/features/presentation-modes/context/PresentationModeContext";
import { useCreativeMode } from "../context/CreativeModeContext";
import styles from "../creativeMode.module.css";
import { CREATIVE_FONT_PAIRINGS } from "../lib/creativeFonts";
import type { CreativeFontPairing } from "../types/creativeMode";

function Choice<T extends string>({ label, value, options, onChange, disabled = false }: {
  label: string;
  value: T;
  options: readonly T[];
  onChange: (value: T) => void;
  disabled?: boolean;
}) {
  const name = useId();
  return (
    <fieldset className={styles.field} disabled={disabled}>
      <legend>{label}</legend>
      <div className={styles.segments}>
        {options.map(option => (
          <label key={option}>
            <input type="radio" name={name} value={option} checked={value === option} onChange={() => onChange(option)} />
            <span>{option}</span>
          </label>
        ))}
      </div>
    </fieldset>
  );
}

export function CreativeModePanel({ id, onClose }: { id: string; onClose: () => void }) {
  const isPresent = useIsPresent();
  const reducedMotion = useReducedMotion();
  const { state, setEnabled, updateSetting, reset } = useCreativeMode();
  const { gridEnabled } = usePresentationMode();
  return (
    <motion.section
      id={id}
      role="dialog"
      aria-modal="false"
      aria-labelledby={`${id}-title`}
      aria-hidden={!isPresent}
      inert={!isPresent}
      initial={{ opacity: 0, y: reducedMotion ? 0 : 14, scale: reducedMotion ? 1 : 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: reducedMotion ? 0 : 10, scale: reducedMotion ? 1 : 0.98 }}
      transition={{ duration: reducedMotion ? 0.05 : 0.26, ease: "easeOut" }}
      style={{ transformOrigin: "bottom right", pointerEvents: isPresent ? "auto" : "none" }}
      className={styles.panel}
    >
      <header className={styles.panelHeader}>
        <div>
          <h2 id={`${id}-title`}>CREATIVE MODE</h2>
          <p>Modify the interface live.</p>
        </div>
        <button type="button" onClick={onClose} className={styles.closeButton} aria-label="Close Creative Mode controls">
          <X size={16} />
        </button>
      </header>
      {isPresent && !state.enabled && (
        <div className={styles.disabledNote}>
          <p>Enable Creative Mode to try these settings.</p>
          <button type="button" onClick={() => setEnabled(true)}>Enable</button>
        </div>
      )}
      <div className={styles.fields}>
        <label className={styles.fontField}>
          <span>FONT PAIRING</span>
          <select
            value={state.fontPairing}
            disabled={!state.enabled}
            onChange={event => updateSetting("fontPairing", event.target.value as CreativeFontPairing)}
            onKeyDown={event => { if (event.key === "Escape") event.stopPropagation(); }}
          >
            {Object.entries(CREATIVE_FONT_PAIRINGS).map(([value, pairing]) => (
              <option key={value} value={value}>{pairing.label}</option>
            ))}
          </select>
        </label>
        <Choice label="Type scale" value={state.typeScale} options={["compact", "standard", "big"]} onChange={value => updateSetting("typeScale", value)} disabled={!state.enabled} />
        <Choice label="Spacing" value={state.spacing} options={["compact", "balanced", "airy"]} onChange={value => updateSetting("spacing", value)} disabled={!state.enabled} />
        <Choice label="Content width" value={state.contentWidth} options={["narrow", "standard", "wide"]} onChange={value => updateSetting("contentWidth", value)} disabled={!state.enabled} />
        <Choice label="Corners" value={state.corners} options={["sharp", "soft"]} onChange={value => updateSetting("corners", value)} disabled={!state.enabled} />
        <Choice label="Motion" value={state.motion} options={["off", "subtle", "expressive"]} onChange={value => updateSetting("motion", value)} disabled={!state.enabled} />
        <p className={styles.hint}>Decorative accents and grid. Reduced motion takes priority.</p>
        <Choice label="Grid" value={state.gridStyle} options={["fine", "blueprint", "hidden"]} onChange={value => updateSetting("gridStyle", value)} disabled={!state.enabled || !gridEnabled} />
        {!gridEnabled && <p className={styles.hint}>Turn on Flickering Grid in Visual Layers to preview this control.</p>}
      </div>
      <footer className={styles.panelFooter}>
        <div><span>LOCAL EXPERIMENT</span><p>Changes reset on refresh.</p></div>
        <button type="button" onClick={reset} disabled={!state.enabled}>Reset</button>
      </footer>
    </motion.section>
  );
}
