# Domain Language Glossary

Canonical terminology for the portfolio's interactive user interface surfaces, navigation controls, and assistant workflows.

## UI Surfaces & Navigation

**ArtisanCanvas**:
The default spatial portfolio layout featuring the editorial intro column, 3D isometric desk workspace, and single-screen home composition.
_Avoid_: Agent Folio canvas, default shell

**WorkspaceSidebar**:
A collapsible left-edge floating studio card generated on demand from the Hero action bar (`Ctrl/Cmd+B`) that provides grouped portfolio navigation, live workspace status, and drawer shortcuts.
_Avoid_: Left drawer, navigation drawer, sidebar menu

**DockNav**:
The floating bottom capsule dock used for tab switching and theme toggling in Artisan mode while `WorkspaceSidebar` is closed.
_Avoid_: Taskbar, bottom bar, toolbar

**SideDrawer**:
An off-canvas overlay container managed by `SideDrawerProvider` for standalone multi-item panels (`music` and `resources`) with backdrop blur, focus trapping, and scroll locking.
_Avoid_: Sidebar, modal sheet

**NaphBot**:
The interactive portfolio voice and conversational experience launched from the `Chat with NaphBot` control beneath the 3D isometric desk or from `WorkspaceSidebar`.
_Avoid_: Chatbot popup, help bot
