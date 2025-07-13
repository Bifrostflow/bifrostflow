// hooks/useHapticSound.ts
import { useRef } from 'react';

export function useHapticSound(path = '', volume = 0.5) {
  const audioRef = useRef<HTMLAudioElement | null>(null);

  if (!audioRef.current) {
    try {
      audioRef.current = new Audio(path);
      audioRef.current.volume = volume; // adjust as needed
    } catch (error) {
      console.log(error);
    }
  }

  const play = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.play().catch(e => {
        console.log(e);
        // ignore autoplay block errors
      });
    }
  };

  return play;
}
