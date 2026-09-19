import * as Ably from "ably";

let clientInstance: Ably.Realtime | null = null;
let currentClientId: string | null = null;

/**
 * Returns a singleton browser-side Ably Realtime client.
 * Reuses the existing client instance across component rerenders and React Strict Mode remounts.
 * Uses authUrl: "/api/ably/token" and supplies the anonymous clientId in authParams.
 */
export function getAblyRealtimeClient(clientId: string): Ably.Realtime | null {
  if (typeof window === "undefined") {
    return null;
  }

  // Reuse existing Realtime client if already created for this clientId
  if (clientInstance && currentClientId === clientId) {
    return clientInstance;
  }

  // If clientId changed or a previous client needs teardown
  if (clientInstance) {
    try {
      clientInstance.close();
    } catch {
      // ignore
    }
    clientInstance = null;
  }

  currentClientId = clientId;
  clientInstance = new Ably.Realtime({
    authUrl: "/api/ably/token",
    authParams: { clientId },
    autoConnect: true,
  });

  return clientInstance;
}
