import { useMemo } from 'react'
import { type PlaySoundOptions, useSoundEffects } from './useSoundEffects'

export function useSound() {
  const { isMuted, isSupported, playSound, primeAudio, setVolume, toggleMute, volume } = useSoundEffects()

  return useMemo(
    () => ({
      playCorrect: (options?: PlaySoundOptions) => playSound('correct', options),
      playWrong: (options?: PlaySoundOptions) => playSound('wrong', options),
      playLevelComplete: (options?: PlaySoundOptions) => playSound('levelComplete', options),
      playSpellUnlock: (options?: PlaySoundOptions) => playSound('spellUnlock', options),
      playHover: (options?: PlaySoundOptions) => playSound('hover', options),
      playClick: (options?: PlaySoundOptions) => playSound('click', options),
      toggleMute,
      setVolume,
      primeAudio,
      isMuted,
      volume,
      isSupported,
    }),
    [isMuted, isSupported, playSound, primeAudio, setVolume, toggleMute, volume],
  )
}
