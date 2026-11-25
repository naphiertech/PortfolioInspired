export type MascotId = "scout" | "tinker" | "craft";

export type MascotMood = "idle" | "reacting" | "celebrating";

export interface MascotTrioState {
  moods: Record<MascotId, MascotMood>;
  greeted: Record<MascotId, boolean>;
  waveCount: number;
  reactionNonce: Record<MascotId, number>;
}

export type MascotEvent =
  | { type: "CLICK"; id: MascotId }
  | { type: "REACT_COMPLETE"; id: MascotId }
  | { type: "WAVE_COMPLETE" };

export const MASCOT_IDS: readonly MascotId[] = ["scout", "tinker", "craft"];

export const MASCOT_REACT_MS: Record<MascotId, number> = {
  scout: 860,
  tinker: 860,
  craft: 1020,
};

export const MASCOT_WAVE_MS = 1050;

export const INITIAL_MASCOT_TRIO_STATE: MascotTrioState = {
  moods: { scout: "idle", tinker: "idle", craft: "idle" },
  greeted: { scout: false, tinker: false, craft: false },
  waveCount: 0,
  reactionNonce: { scout: 0, tinker: 0, craft: 0 },
};

/**
 * Pure state machine for the trio of peeking ProfileInfoBlock mascots.
 * - Clicking a mascot triggers its unique reaction animation and records it as greeted.
 * - Once all 3 mascots have been greeted, launches a synchronized celebration wave
 *   across all three and resets the greeted tracker for replayability.
 */
export function mascotTrioReducer(
  state: MascotTrioState,
  event: MascotEvent
): MascotTrioState {
  switch (event.type) {
    case "CLICK": {
      const nextGreeted: Record<MascotId, boolean> = {
        ...state.greeted,
        [event.id]: true,
      };

      const allGreeted = MASCOT_IDS.every((id) => nextGreeted[id]);

      if (allGreeted) {
        return {
          moods: {
            scout: "celebrating",
            tinker: "celebrating",
            craft: "celebrating",
          },
          greeted: { scout: false, tinker: false, craft: false },
          waveCount: state.waveCount + 1,
          reactionNonce: {
            ...state.reactionNonce,
            [event.id]: state.reactionNonce[event.id] + 1,
          },
        };
      }

      return {
        ...state,
        moods: {
          ...state.moods,
          [event.id]: "reacting",
        },
        greeted: nextGreeted,
        reactionNonce: {
          ...state.reactionNonce,
          [event.id]: state.reactionNonce[event.id] + 1,
        },
      };
    }

    case "REACT_COMPLETE": {
      if (state.moods[event.id] !== "reacting") return state;
      return {
        ...state,
        moods: {
          ...state.moods,
          [event.id]: "idle",
        },
      };
    }

    case "WAVE_COMPLETE": {
      return {
        ...state,
        moods: { scout: "idle", tinker: "idle", craft: "idle" },
      };
    }

    default:
      return state;
  }
}
