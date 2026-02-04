# Specification

## Summary
**Goal:** Fix the segmented circumference progress indicator so it fills exactly one segment every 8 seconds of elapsed session time.

**Planned changes:**
- Adjust segmented circumference progress fill logic so the filled segment count increments by 1 at each 8-second boundary (8s, 16s, 24s, …) up to the computed total segment count (totalDurationSeconds/8, rounded up).
- Ensure the filled segment count is monotonic with elapsed time and never exceeds the total number of segments.
- Limit changes strictly to the segmented circumference timing/fill behavior without altering Player layout, breathing circle sizing, colors, typography, or other Player behavior.

**User-visible outcome:** During a session, the segmented circumference indicator fills one additional segment every 8 seconds, accurately reflecting elapsed time without any other visual or behavioral changes to the Player.
