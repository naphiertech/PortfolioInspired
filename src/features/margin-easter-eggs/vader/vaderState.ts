export type VaderPhase = "off" | "igniting" | "on" | "retracting";

export type SaberColor = "sith" | "jedi";

export interface VaderState {
  phase: VaderPhase;
  saber: SaberColor;
}

export type VaderEvent =
  | { type: "CLICK"; shiftKey?: boolean }
  | { type: "IGNITE_COMPLETE" }
  | { type: "RETRACT_COMPLETE" };

export const INITIAL_VADER_STATE: VaderState = {
  phase: "off",
  saber: "sith",
};

export const SABER_IGNITE_MS = 280;
export const SABER_RETRACT_MS = 260;

/**
 * Pure state machine governing Darth Vader's lightsaber ignition, hum, color
 * swap (Shift+Click for Jedi Blue), and retraction.
 */
export function vaderReducer(state: VaderState, event: VaderEvent): VaderState {
  switch (event.type) {
    case "CLICK": {
      const wantJedi = Boolean(event.shiftKey);

      if (state.phase === "off" || state.phase === "retracting") {
        return {
          phase: "igniting",
          saber: wantJedi ? "jedi" : "sith",
        };
      }

      if (state.phase === "on") {
        if (wantJedi) {
          return {
            phase: "igniting",
            saber: state.saber === "sith" ? "jedi" : "sith",
          };
        }
        return {
          ...state,
          phase: "retracting",
        };
      }

      return state;
    }

    case "IGNITE_COMPLETE": {
      if (state.phase !== "igniting") return state;
      return {
        ...state,
        phase: "on",
      };
    }

    case "RETRACT_COMPLETE": {
      if (state.phase !== "retracting") return state;
      return {
        phase: "off",
        saber: "sith",
      };
    }

    default:
      return state;
  }
}

export function isSaberActive(phase: VaderPhase): boolean {
  return phase === "igniting" || phase === "on";
}
