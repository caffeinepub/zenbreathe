# Specification

## Summary
**Goal:** Add spoken “4 3 2 1” voice guidance synced to the existing on-circle countdown at the very start of a guided breathing session.

**Planned changes:**
- Trigger text-to-speech of “4”, “3”, “2”, “1” aligned with the breathing circle’s initial visible countdown ticks when the user taps Start.
- Ensure the spoken countdown is part of the existing breathing circle countdown behavior (no separate pre-session screen/flow).
- Route the countdown speech through the existing voice guidance volume control.
- Cancel any in-progress countdown speech when the session is paused or stopped, and prevent it from continuing while paused/stopped.

**User-visible outcome:** When starting a guided breathing session, the app speaks “4 3 2 1” in sync with the breathing circle’s initial countdown, honoring voice volume settings and stopping immediately if paused/stopped.
