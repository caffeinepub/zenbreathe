# Specification

## Summary
**Goal:** Populate and restyle the Exercise Info screen to match the provided reference (close icon header control, populated Benefits/Method sections, and a Begin Exercise CTA).

**Planned changes:**
- Replace the Exercise Info header back arrow with a close “X” icon that exits the screen (go back when history exists; otherwise navigate to Home) and add an accessible label (e.g., “Close”).
- Ensure /exercise-info renders non-empty content when opened via the Home card Info icon by reading the `exerciseId` search param and displaying the mapped `EXERCISE_INFO_CONTENT` (with the existing “not found” fallback for invalid ids).
- Update Exercise Info layout/styling to match the reference: centered title, short intro paragraph, divider lines, and collapsible sections with uppercase headings and a right-side chevron indicating open/closed state.
- Update the dummy content for `exerciseId='equal-breathing'` to include “BENEFITS” and “METHOD”, with step-style instructions in “METHOD”.
- Add a bottom primary CTA labeled “BEGIN EXERCISE” for playable breathing exercises that navigates to `/player` with the correct pattern for the current `exerciseId` and the user’s saved duration; hide/replace the CTA for non-playable entries (e.g., breath-holding-test).

**User-visible outcome:** Tapping an exercise’s Info icon opens a fully populated, reference-styled Exercise Info screen with collapsible Benefits/Method sections, a close “X” to exit, and a “BEGIN EXERCISE” button that starts the selected exercise when applicable.
