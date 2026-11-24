export type GachaponPhase = "idle" | "cranking" | "dropping" | "revealed";

export type GachaponCharm = "duck" | "cat" | "heart" | "coffee" | "trophy";

export const GACHAPON_CHARMS: readonly GachaponCharm[] = [
  "duck",
  "cat",
  "heart",
  "coffee",
  "trophy",
];

export interface GachaponState {
  phase: GachaponPhase;
  charm: GachaponCharm;
  pullCount: number;
}

export type GachaponEvent =
  | { type: "CRANK"; shiftKey?: boolean }
  | { type: "CRANK_COMPLETE" }
  | { type: "DROP_COMPLETE" };

export const INITIAL_GACHAPON_STATE: GachaponState = {
  phase: "idle",
  charm: "duck",
  pullCount: 0,
};

export const GACHAPON_CRANK_MS = 420;
export const GACHAPON_DROP_MS = 320;

/**
 * Pure state machine for the Pixel Japanese Gachapon Capsule Machine.
 * - Click while idle/revealed: cranks dial 360deg -> drops capsule -> reveals collectible charm.
 * - Cycles cleanly through all 5 pixel charms without repeating back-to-back.
 * - Shift+Click guarantees the rare Golden Trophy capsule.
 */
export function gachaponReducer(
  state: GachaponState,
  event: GachaponEvent
): GachaponState {
  switch (event.type) {
    case "CRANK": {
      if (state.phase === "cranking" || state.phase === "dropping") {
        return state;
      }

      const nextPull = state.pullCount + 1;
      const nextCharm: GachaponCharm = event.shiftKey
        ? "trophy"
        : GACHAPON_CHARMS[(nextPull - 1) % GACHAPON_CHARMS.length];

      return {
        phase: "cranking",
        charm: nextCharm,
        pullCount: nextPull,
      };
    }

    case "CRANK_COMPLETE": {
      if (state.phase !== "cranking") return state;
      return {
        ...state,
        phase: "dropping",
      };
    }

    case "DROP_COMPLETE": {
      if (state.phase !== "dropping") return state;
      return {
        ...state,
        phase: "revealed",
      };
    }

    default:
      return state;
  }
}
