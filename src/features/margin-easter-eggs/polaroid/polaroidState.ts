export type PolaroidPhase = "idle" | "flashing" | "ejecting" | "developed";

export type PolaroidFilmMode = "color" | "sepia";

export const POLAROID_SCENE_COUNT = 4;

export interface PolaroidState {
  phase: PolaroidPhase;
  sceneIndex: number;
  filmMode: PolaroidFilmMode;
  snapCount: number;
}

export type PolaroidEvent =
  | { type: "SNAP"; shiftKey?: boolean }
  | { type: "FLASH_COMPLETE" }
  | { type: "EJECT_COMPLETE" };

export const INITIAL_POLAROID_STATE: PolaroidState = {
  phase: "idle",
  sceneIndex: 0,
  filmMode: "color",
  snapCount: 0,
};

export const POLAROID_FLASH_MS = 220;
export const POLAROID_EJECT_MS = 780;

/**
 * Pure state machine for the Vintage Pixel Polaroid Camera.
 * - Click when idle/developed: fires xenon flash, increments to the next pixel
 *   memory scene, ejects a fresh Polaroid out the bottom slot, and develops it.
 * - Shift+Click toggles vintage warm sepia film mode.
 */
export function polaroidReducer(
  state: PolaroidState,
  event: PolaroidEvent
): PolaroidState {
  switch (event.type) {
    case "SNAP": {
      if (state.phase === "flashing" || state.phase === "ejecting") {
        return state;
      }

      const nextSnap = state.snapCount + 1;
      const nextScene =
        state.snapCount === 0
          ? 0
          : (state.sceneIndex + 1) % POLAROID_SCENE_COUNT;

      return {
        phase: "flashing",
        sceneIndex: nextScene,
        filmMode: event.shiftKey ? "sepia" : "color",
        snapCount: nextSnap,
      };
    }

    case "FLASH_COMPLETE": {
      if (state.phase !== "flashing") return state;
      return {
        ...state,
        phase: "ejecting",
      };
    }

    case "EJECT_COMPLETE": {
      if (state.phase !== "ejecting") return state;
      return {
        ...state,
        phase: "developed",
      };
    }

    default:
      return state;
  }
}
