/**
 * Player duration safety utilities to prevent invalid duration inputs
 * or unit mismatches from causing immediate session termination.
 */

const SAFE_FALLBACK_DURATION_SECONDS = 300; // 5 minutes
const MIN_DURATION_SECONDS = 30; // 30 seconds minimum
const MAX_DURATION_SECONDS = 3600; // 1 hour maximum

/**
 * Validates and coerces a duration value to a safe range.
 * Returns the validated duration in seconds and logs a warning if invalid.
 */
export function validateDuration(duration: number | undefined | null): number {
  if (duration === undefined || duration === null || isNaN(duration)) {
    console.warn(
      `[Player] Invalid duration value: ${duration}. Using fallback: ${SAFE_FALLBACK_DURATION_SECONDS}s`
    );
    return SAFE_FALLBACK_DURATION_SECONDS;
  }

  if (duration < MIN_DURATION_SECONDS) {
    console.warn(
      `[Player] Duration ${duration}s is below minimum ${MIN_DURATION_SECONDS}s. Using fallback: ${SAFE_FALLBACK_DURATION_SECONDS}s`
    );
    return SAFE_FALLBACK_DURATION_SECONDS;
  }

  if (duration > MAX_DURATION_SECONDS) {
    console.warn(
      `[Player] Duration ${duration}s exceeds maximum ${MAX_DURATION_SECONDS}s. Using fallback: ${SAFE_FALLBACK_DURATION_SECONDS}s`
    );
    return SAFE_FALLBACK_DURATION_SECONDS;
  }

  return duration;
}

/**
 * Guards against premature auto-stop by ensuring a minimum elapsed time
 * before allowing auto-stop for multi-minute sessions.
 */
export function shouldAllowAutoStop(
  elapsedSeconds: number,
  targetDurationSeconds: number
): boolean {
  // For sessions longer than 1 minute, require at least 5 seconds elapsed
  // to prevent unit mismatch bugs from causing instant termination
  const MIN_ELAPSED_THRESHOLD_SECONDS = 5;
  
  if (targetDurationSeconds > 60 && elapsedSeconds < MIN_ELAPSED_THRESHOLD_SECONDS) {
    return false;
  }

  return elapsedSeconds >= targetDurationSeconds;
}
