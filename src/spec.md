# Specification

## Summary
**Goal:** Restore and align in-session guided voice prompts in the Player so phase-based prompts reliably play during active breathing sessions and respond to the voice volume control.

**Planned changes:**
- Investigate and fix the regression preventing in-session phase voice prompts from playing while ambient audio still plays.
- Update voice guidance to match the current Player flow: no pre-session intro; speak short phase prompts at phase transitions (inhale: “Breathe in”, holdTop/holdBottom: “Hold”, exhale: “Breathe out”), and skip prompts for any 0-duration phases.
- Ensure the voice guidance volume slider reliably controls prompt loudness (including changes made mid-session) and supports muting at 0.
- Adjust Player lifecycle handling so prompts are not unintentionally cancelled during normal phase transitions, while still cancelling any ongoing speech on exit and on pause/stop.

**User-visible outcome:** When a breathing session starts, users hear clear spoken phase prompts at each phase transition (with no pre-session intro), the prompts can be muted or adjusted via the voice volume slider during the session, and speech stops appropriately when pausing/stopping or leaving the Player.
