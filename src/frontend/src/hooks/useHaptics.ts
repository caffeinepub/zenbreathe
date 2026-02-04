export function useHaptics() {
  const vibrate = (duration: number = 50) => {
    if ('vibrate' in navigator) {
      navigator.vibrate(duration);
    }
  };

  return { vibrate };
}
