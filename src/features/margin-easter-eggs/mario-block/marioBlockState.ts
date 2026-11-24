export type MarioBlockPhase = "ready" | "bumping" | "spent";

export type MarioBlockReward = "coin" | "star";

export interface MarioRewardPop {
  id: number;
  reward: MarioBlockReward;
  fast: boolean;
}

export interface MarioBlockState {
  phase: MarioBlockPhase;
  reward: MarioBlockReward;
  bumpCount: number;
  streakCount: number;
  activePops: MarioRewardPop[];
}

export type MarioBlockEvent =
  | { type: "CLICK"; shiftKey?: boolean; fast?: boolean }
  | { type: "POP_COMPLETE"; id: number };

export const INITIAL_MARIO_BLOCK_STATE: MarioBlockState = {
  phase: "ready",
  reward: "coin",
  bumpCount: 0,
  streakCount: 0,
  activePops: [],
};

export const MARIO_NORMAL_POP_MS = 640;
export const MARIO_FAST_POP_MS = 380;
export const MARIO_MAX_STREAK_COINS = 10;

/**
 * Pure state machine for the NES Super Mario Bros. `?` Question Block.
 * - Single click: bumps upward, launches a spinning NES coin (Shift+Click: Super Star),
 *   and settles into the spent bronze block when the pop completes.
 * - Rapid clicks while popping: immediately re-bumps and stacks faster coins
 *   (up to a classic 10-coin burst) with zero click lockout.
 * - Click while spent: resets back into a fresh `?` Block.
 */
export function marioBlockReducer(
  state: MarioBlockState,
  event: MarioBlockEvent
): MarioBlockState {
  switch (event.type) {
    case "CLICK": {
      if (state.phase === "spent") {
        return {
          ...state,
          phase: "ready",
          reward: "coin",
          streakCount: 0,
          activePops: [],
        };
      }

      // Allow immediate re-bumping during rapid clicks up to the 10-coin cap
      if (
        state.phase === "ready" ||
        (state.phase === "bumping" && state.streakCount < MARIO_MAX_STREAK_COINS)
      ) {
        const nextId = state.bumpCount + 1;
        const reward: MarioBlockReward = event.shiftKey ? "star" : "coin";
        const isFast = Boolean(event.fast) || state.phase === "bumping";
        const nextStreak = state.streakCount + 1;

        return {
          phase: "bumping",
          reward,
          bumpCount: nextId,
          streakCount: nextStreak,
          activePops: [
            ...state.activePops.slice(-7),
            { id: nextId, reward, fast: isFast },
          ],
        };
      }

      return state;
    }

    case "POP_COMPLETE": {
      const remaining = state.activePops.filter((pop) => pop.id !== event.id);
      if (remaining.length > 0) {
        return {
          ...state,
          activePops: remaining,
        };
      }

      if (state.phase === "bumping") {
        return {
          ...state,
          phase: "spent",
          activePops: [],
        };
      }

      return {
        ...state,
        activePops: [],
      };
    }

    default:
      return state;
  }
}
