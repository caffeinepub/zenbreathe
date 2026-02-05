let currentVolume = 1.0;

export function setVoiceVolume(volume: number): void {
  // Volume should be between 0 and 1
  currentVolume = Math.max(0, Math.min(1, volume));
}

/**
 * Speak a phase prompt during an active session.
 * Does NOT cancel ongoing speech to avoid suppressing prompts.
 * Ensures synthesis is resumed if needed.
 */
export function speak(text: string): void {
  if ('speechSynthesis' in window) {
    // Resume synthesis if it's paused (some browsers need this)
    if (window.speechSynthesis.paused) {
      window.speechSynthesis.resume();
    }
    
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 1.0;
    utterance.pitch = 1.0;
    utterance.volume = currentVolume;
    
    window.speechSynthesis.speak(utterance);
  }
}

/**
 * Promise-based speak function that resolves when speech completes
 * Useful for sequencing voice prompts in intro flows
 */
export function speakAsync(text: string): Promise<void> {
  return new Promise((resolve) => {
    if (!('speechSynthesis' in window)) {
      resolve();
      return;
    }

    // Resume synthesis if it's paused
    if (window.speechSynthesis.paused) {
      window.speechSynthesis.resume();
    }
    
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 1.0;
    utterance.pitch = 1.0;
    utterance.volume = currentVolume;
    
    utterance.onend = () => resolve();
    utterance.onerror = () => resolve();
    
    window.speechSynthesis.speak(utterance);
  });
}

/**
 * Queued speak function that does NOT cancel ongoing speech
 * Used for countdown numbers that should play in sequence
 */
export function speakQueued(text: string): void {
  if ('speechSynthesis' in window) {
    // Resume synthesis if it's paused
    if (window.speechSynthesis.paused) {
      window.speechSynthesis.resume();
    }
    
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 1.0;
    utterance.pitch = 1.0;
    utterance.volume = currentVolume;
    
    window.speechSynthesis.speak(utterance);
  }
}

/**
 * Cancel any ongoing speech.
 * Use this explicitly for exit/pause/stop flows only.
 */
export function cancelSpeech(): void {
  if ('speechSynthesis' in window) {
    window.speechSynthesis.cancel();
  }
}
