# Specification

## Summary
**Goal:** Hide the selected Player bottom control button during any active breathing session and automatically show it again when the session ends.

**Planned changes:**
- Update only the selected Player bottom control button so it is not rendered (removed from the DOM) while a session is active, including when paused.
- Ensure the button automatically reappears immediately when the session transitions to a non-running state, including auto-stop when the configured duration is reached.

**User-visible outcome:** When a breathing session is running or paused, the selected Player control button disappears completely; it reappears automatically as soon as the session ends.
