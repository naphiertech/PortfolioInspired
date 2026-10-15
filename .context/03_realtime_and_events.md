# 03 Realtime & Events Architecture

## 1. Subsystem & Client Architecture
* **Realtime Provider**: Ably Realtime (`ably` v2.24.0).
* **Client Helper**: [`src/lib/ablyClient.ts`](../src/lib/ablyClient.ts).
* **Auth Endpoint**: `/api/ably/token`.

---

## 2. Channels & Event Matrix

| Channel Name | Purpose | Message Types |
| :--- | :--- | :--- |
| `portfolio:presence` | Live visitor presence counter | `enter`, `leave`, `heartbeat` |
| `portfolio:cursors` | Ephemeral multiplayer cursor broadcast | `{ x, y, userColor, userId }` |
| `portfolio:reactions` | Floating emoji / spark micro-reactions | `{ emoji, timestamp, originX, originY }` |

---

## 3. Invariants & Lifecycle Rules
* **Client-Side Lazy Connect**: Ably client only connects when presence or multiplayer features are active on screen, preventing connection quota exhaustion.
* **Throttle / Debounce Cursor Broadcast**: Mouse movement events are throttled to a maximum frequency of 50ms (20fps) before publishing to `portfolio:cursors`.
* **Clean Disconnect On Unmount**: Components subscribing to Ably channels must unsubscribe and detach presence listeners in their `useEffect` cleanup return block.
* **Offline Resiliency**: If Ably connection drops or user is offline, presence widgets degrade gracefully to local offline mode without throwing fatal UI errors.
