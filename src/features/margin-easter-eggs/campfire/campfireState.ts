export type CampfirePhase = "unlit" | "igniting" | "lit" | "dousing";

export type CampfireVariant = "classic" | "soul";

export interface CampfireState {
  phase: CampfirePhase;
  variant: CampfireVariant;
}

export type CampfireEvent =
  | { type: "CLICK"; shiftKey?: boolean }
  | { type: "IGNITE_COMPLETE" }
  | { type: "DOUSE_COMPLETE" };

export const INITIAL_CAMPFIRE_STATE: CampfireState = {
  phase: "unlit",
  variant: "classic",
};

export const IGNITE_DURATION_MS = 380;
export const DOUSE_DURATION_MS = 460;

/**
 * Pure state machine governing campfire ignition, burning, variant switching, and dousing.
 * - Click while unlit: ignites classic fire (or Soul Fire on Shift+Click).
 * - Shift+Click while lit: flares into the opposite flame variant without extinguishing.
 * - Click while lit: douses with a smoke puff back to unlit.
 */
export function campfireReducer(
  state: CampfireState,
  event: CampfireEvent
): CampfireState {
  switch (event.type) {
    case "CLICK": {
      const wantSoul = Boolean(event.shiftKey);

      if (state.phase === "unlit" || state.phase === "dousing") {
        return {
          phase: "igniting",
          variant: wantSoul ? "soul" : "classic",
        };
      }

      if (state.phase === "lit") {
        if (wantSoul) {
          return {
            phase: "igniting",
            variant: state.variant === "classic" ? "soul" : "classic",
          };
        }
        return {
          ...state,
          phase: "dousing",
        };
      }

      return state;
    }

    case "IGNITE_COMPLETE": {
      if (state.phase !== "igniting") return state;
      return {
        ...state,
        phase: "lit",
      };
    }

    case "DOUSE_COMPLETE": {
      if (state.phase !== "dousing") return state;
      return {
        phase: "unlit",
        variant: "classic",
      };
    }

    default:
      return state;
  }
}

export function isCampfireActive(phase: CampfirePhase): boolean {
  return phase === "igniting" || phase === "lit";
}
