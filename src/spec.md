# Specification

## Summary
**Goal:** Prevent the Player screen BreathingCircle from overlapping the left/right vertical volume sliders by reducing/adjusting its size so it always maintains at least a 5vw gap to each slider.

**Planned changes:**
- Update the Player page layout/sizing rules so the BreathingCircle diameter responsively fits between the two VerticalVolumeControl slider containers with a minimum 5vw margin on both sides.
- Ensure the BreathingCircle stays centered between the two slider controls and remains fully visible within the viewport across supported screen sizes and orientations.

**User-visible outcome:** On the Player page, the breathing circle never overlaps the volume sliders and always has a noticeable minimum horizontal gap (>= 5vw) from each slider while staying centered and fully visible.
