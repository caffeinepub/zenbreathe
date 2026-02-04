# Specification

## Summary
**Goal:** Prevent the Player breathing circle from touching or overlapping the outer border at maximum inhale expansion by enforcing a 5% max-diameter margin.

**Planned changes:**
- Update the Player breathing circle max-size calculation so its maximum diameter is ~90.909% (1/1.1) of its square container size, creating a 5% margin relative to the circle’s maximum diameter.
- Ensure the inhale (expand) animation respects this max diameter across common mobile viewport sizes so the circle never covers/touches the external border.

**User-visible outcome:** During inhale expansion, the breathing circle consistently stays inside the outer boundary with a visible gap, never touching or overlapping the border.
