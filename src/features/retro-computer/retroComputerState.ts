export type RetroScreenMode =
  | "off"
  | "booting"
  | "hello"
  | "terminal"
  | "screensaver"
  | "shutting-down";

export interface RetroComputerState {
  mode: RetroScreenMode;
  floppyEjected: boolean;
  cycleCount: number;
}

export type RetroComputerEvent =
  | { type: "CLICK"; shiftKey?: boolean }
  | { type: "BOOT_COMPLETE" }
  | { type: "SHUTDOWN_COMPLETE" };

export const INITIAL_RETRO_COMPUTER_STATE: RetroComputerState = {
  mode: "off",
  floppyEjected: false,
  cycleCount: 0,
};

export const CRT_BOOT_MS = 320;
export const CRT_SHUTDOWN_MS = 300;

/**
 * Pure state machine for the 1990s 2D CRT Desktop Computer.
 * - Normal click cycles: off -> booting -> hello -> terminal -> screensaver -> shutting-down -> off.
 * - Shift+Click toggles the 3.5" floppy disk ejection without interrupting the CRT screen.
 */
export function retroComputerReducer(
  state: RetroComputerState,
  event: RetroComputerEvent
): RetroComputerState {
  switch (event.type) {
    case "CLICK": {
      if (event.shiftKey) {
        return {
          ...state,
          floppyEjected: !state.floppyEjected,
        };
      }

      if (state.mode === "booting" || state.mode === "shutting-down") {
        return state;
      }

      if (state.mode === "off") {
        return {
          ...state,
          mode: "booting",
          cycleCount: state.cycleCount + 1,
        };
      }

      if (state.mode === "hello") {
        return { ...state, mode: "terminal" };
      }

      if (state.mode === "terminal") {
        return { ...state, mode: "screensaver" };
      }

      return { ...state, mode: "shutting-down" };
    }

    case "BOOT_COMPLETE": {
      if (state.mode !== "booting") return state;
      return { ...state, mode: "hello" };
    }

    case "SHUTDOWN_COMPLETE": {
      if (state.mode !== "shutting-down") return state;
      return { ...state, mode: "off" };
    }

    default:
      return state;
  }
}

export function isRetroScreenOn(mode: RetroScreenMode): boolean {
  return (
    mode === "booting" ||
    mode === "hello" ||
    mode === "terminal" ||
    mode === "screensaver"
  );
}
