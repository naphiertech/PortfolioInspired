export type DuckPhase = "idle" | "squeaking";

export const DUCK_QUIPS = [
  "try console.log",
  "works locally",
  "missing ; ?",
  "clear cache!",
  "did you save?",
  "read the logs",
] as const;

export interface RubberDuckState {
  phase: DuckPhase;
  sunglasses: boolean;
  quip: string;
  quipIndex: number;
  squeakCount: number;
  bubbleVisible: boolean;
}

export type RubberDuckEvent =
  | { type: "SQUEAK"; shiftKey?: boolean }
  | { type: "SQUISH_COMPLETE" }
  | { type: "HIDE_BUBBLE" };

export const INITIAL_DUCK_STATE: RubberDuckState = {
  phase: "idle",
  sunglasses: false,
  quip: DUCK_QUIPS[0],
  quipIndex: 0,
  squeakCount: 0,
  bubbleVisible: false,
};

export const DUCK_SQUISH_MS = 320;
export const DUCK_BUBBLE_MS = 2300;

/**
 * Pure state machine for the Pixel Rubber Duck Debugger.
 * - Click: squishes with a squeak and pops the next concise dev-debugging quip.
 * - Shift+Click: toggles cool hacker sunglasses ("ship it." when put on).
 */
export function rubberDuckReducer(
  state: RubberDuckState,
  event: RubberDuckEvent
): RubberDuckState {
  switch (event.type) {
    case "SQUEAK": {
      const nextCount = state.squeakCount + 1;

      if (event.shiftKey) {
        const nextGlasses = !state.sunglasses;
        return {
          ...state,
          phase: "squeaking",
          sunglasses: nextGlasses,
          quip: nextGlasses ? "ship it." : "back to debugging",
          squeakCount: nextCount,
          bubbleVisible: true,
        };
      }

      const nextIdx =
        state.squeakCount === 0
          ? 0
          : (state.quipIndex + 1) % DUCK_QUIPS.length;

      return {
        ...state,
        phase: "squeaking",
        quip: DUCK_QUIPS[nextIdx],
        quipIndex: nextIdx,
        squeakCount: nextCount,
        bubbleVisible: true,
      };
    }

    case "SQUISH_COMPLETE": {
      if (state.phase !== "squeaking") return state;
      return {
        ...state,
        phase: "idle",
      };
    }

    case "HIDE_BUBBLE": {
      return {
        ...state,
        bubbleVisible: false,
      };
    }

    default:
      return state;
  }
}
