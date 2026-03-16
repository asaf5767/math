import { useCallback, useEffect, useMemo, useState } from 'react'

const SOUND_STORAGE_KEY = 'harry-potter-math-muted'
const SOUND_VOLUME_KEY = 'harry-potter-math-volume'
const SOUND_EVENT = 'harry-potter-sound-state'
const DEFAULT_VOLUME = 0.85

export type SynthSoundKey =
  | 'correct'
  | 'wrong'
  | 'levelComplete'
  | 'spellUnlock'
  | 'hover'
  | 'click'

export interface PlaySoundOptions {
  volume?: number
}

type WindowWithWebkitAudioContext = Window &
  typeof globalThis & {
    webkitAudioContext?: typeof AudioContext
  }

interface AudioEngineState {
  context: AudioContext | null
  masterGain: GainNode | null
  isMuted: boolean
  volume: number
  hasSupport: boolean | null
}

interface ToneLayer {
  ratio: number
  gain: number
  type: OscillatorType
  detune?: number
}

interface RichToneOptions {
  frequency: number
  startTime: number
  duration: number
  volume: number
  attack?: number
  layers?: ToneLayer[]
  sweepTo?: number
  filter?: {
    type: BiquadFilterType
    frequency: number
    q?: number
  }
}

const engine: AudioEngineState = {
  context: null,
  masterGain: null,
  isMuted: false,
  volume: DEFAULT_VOLUME,
  hasSupport: null,
}

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value))

const loadMutedState = () => {
  if (typeof window === 'undefined') {
    return false
  }

  return window.localStorage.getItem(SOUND_STORAGE_KEY) === 'true'
}

const loadVolumeState = () => {
  if (typeof window === 'undefined') {
    return DEFAULT_VOLUME
  }

  const storedVolume = Number(window.localStorage.getItem(SOUND_VOLUME_KEY))

  if (Number.isFinite(storedVolume)) {
    return clamp(storedVolume, 0, 1)
  }

  return DEFAULT_VOLUME
}

const getAudioContextConstructor = () => {
  if (typeof window === 'undefined') {
    return null
  }

  const audioWindow = window as WindowWithWebkitAudioContext

  return audioWindow.AudioContext ?? audioWindow.webkitAudioContext ?? null
}

const updateMasterGain = (context = engine.context) => {
  if (!context || !engine.masterGain) {
    return
  }

  const targetVolume = engine.isMuted ? 0 : engine.volume

  engine.masterGain.gain.cancelScheduledValues(context.currentTime)
  engine.masterGain.gain.setTargetAtTime(targetVolume, context.currentTime, 0.015)
}

const DEFAULT_BELL_LAYERS: ToneLayer[] = [
  { ratio: 1, gain: 1, type: 'sine' },
  { ratio: 2, gain: 0.22, type: 'triangle' },
  { ratio: 3, gain: 0.1, type: 'sine', detune: 6 },
]

const scheduleRichTone = (context: AudioContext, options: RichToneOptions) => {
  const masterGain = engine.masterGain

  if (!masterGain) {
    return
  }

  const {
    frequency,
    startTime,
    duration,
    volume,
    attack = 0.01,
    layers = DEFAULT_BELL_LAYERS,
    sweepTo,
    filter,
  } = options

  layers.forEach((layer) => {
    const oscillator = context.createOscillator()
    const envelope = context.createGain()

    oscillator.type = layer.type
    oscillator.frequency.setValueAtTime(Math.max(1, frequency * layer.ratio), startTime)

    if (typeof layer.detune === 'number') {
      oscillator.detune.setValueAtTime(layer.detune, startTime)
    }

    if (sweepTo) {
      oscillator.frequency.exponentialRampToValueAtTime(Math.max(1, sweepTo * layer.ratio), startTime + duration)
    }

    envelope.gain.setValueAtTime(0.0001, startTime)
    envelope.gain.linearRampToValueAtTime(Math.max(0.0001, volume * layer.gain), startTime + Math.max(attack, 0.001))
    envelope.gain.exponentialRampToValueAtTime(0.0001, startTime + duration)

    if (filter) {
      const biquad = context.createBiquadFilter()
      biquad.type = filter.type
      biquad.frequency.setValueAtTime(filter.frequency, startTime)

      if (typeof filter.q === 'number') {
        biquad.Q.setValueAtTime(filter.q, startTime)
      }

      oscillator.connect(biquad)
      biquad.connect(envelope)
    } else {
      oscillator.connect(envelope)
    }

    envelope.connect(masterGain)
    oscillator.start(startTime)
    oscillator.stop(startTime + duration + 0.08)
  })
}

const scheduleShimmer = (context: AudioContext, startTime: number, volume: number) => {
  const sparkleFrequencies = [1318.51, 1567.98, 1760, 2093]

  sparkleFrequencies.forEach((frequency, index) => {
    scheduleRichTone(context, {
      frequency,
      startTime: startTime + index * 0.045,
      duration: 0.12 + index * 0.02,
      volume: volume * (0.8 - index * 0.12),
      attack: 0.004,
      layers: [
        { ratio: 1, gain: 1, type: 'sine' },
        { ratio: 2, gain: 0.16, type: 'triangle' },
      ],
      filter: { type: 'highpass', frequency: 1000, q: 0.8 },
    })
  })
}

const soundRecipes: Record<SynthSoundKey, (context: AudioContext, startTime: number, volume: number) => void> = {
  correct: (context, startTime, volume) => {
    ;[523.25, 659.25, 783.99].forEach((frequency, index) => {
      const noteStart = startTime + index * 0.1

      scheduleRichTone(context, {
        frequency,
        startTime: noteStart,
        duration: 0.2 + index * 0.04,
        volume: volume * (0.18 + index * 0.03),
        attack: 0.008,
      })

      scheduleRichTone(context, {
        frequency: frequency * 2,
        startTime: noteStart + 0.055,
        duration: 0.18,
        volume: volume * 0.045,
        attack: 0.006,
        layers: [{ ratio: 1, gain: 1, type: 'sine' }],
        filter: { type: 'highpass', frequency: 900, q: 0.6 },
      })
    })

    scheduleShimmer(context, startTime + 0.22, volume * 0.2)
  },
  wrong: (context, startTime, volume) => {
    scheduleRichTone(context, {
      frequency: 130.81,
      startTime,
      duration: 0.3,
      volume: volume * 0.22,
      attack: 0.012,
      sweepTo: 98,
      layers: [
        { ratio: 1, gain: 1, type: 'triangle' },
        { ratio: 0.5, gain: 0.42, type: 'sine' },
      ],
      filter: { type: 'lowpass', frequency: 680, q: 0.9 },
    })
  },
  levelComplete: (context, startTime, volume) => {
    ;[261.63, 329.63, 392, 523.25].forEach((frequency, index) => {
      scheduleRichTone(context, {
        frequency,
        startTime: startTime + index * 0.18,
        duration: 0.48,
        volume: volume * (0.16 + index * 0.035),
        attack: 0.008,
        layers: [
          { ratio: 1, gain: 1, type: 'sine' },
          { ratio: 2, gain: 0.24, type: 'triangle' },
          { ratio: 3, gain: 0.12, type: 'sine', detune: 4 },
          { ratio: 4, gain: 0.06, type: 'square' },
        ],
      })
    })

    scheduleShimmer(context, startTime + 0.82, volume * 0.32)
  },
  spellUnlock: (context, startTime, volume) => {
    scheduleRichTone(context, {
      frequency: 174.61,
      startTime,
      duration: 0.62,
      volume: volume * 0.18,
      attack: 0.02,
      sweepTo: 932.33,
      layers: [
        { ratio: 1, gain: 1, type: 'sine' },
        { ratio: 2, gain: 0.18, type: 'triangle' },
      ],
      filter: { type: 'bandpass', frequency: 820, q: 1.4 },
    })

    scheduleRichTone(context, {
      frequency: 1046.5,
      startTime: startTime + 0.6,
      duration: 0.24,
      volume: volume * 0.24,
      attack: 0.006,
    })

    scheduleShimmer(context, startTime + 0.68, volume * 0.22)
  },
  hover: (context, startTime, volume) => {
    scheduleRichTone(context, {
      frequency: 1480,
      startTime,
      duration: 0.1,
      volume: volume * 0.06,
      attack: 0.004,
      sweepTo: 1660,
      layers: [
        { ratio: 1, gain: 1, type: 'sine' },
        { ratio: 2, gain: 0.12, type: 'triangle' },
      ],
      filter: { type: 'highpass', frequency: 1200, q: 0.7 },
    })
  },
  click: (context, startTime, volume) => {
    scheduleRichTone(context, {
      frequency: 740,
      startTime,
      duration: 0.06,
      volume: volume * 0.14,
      attack: 0.003,
      sweepTo: 560,
      layers: [
        { ratio: 1, gain: 1, type: 'sine' },
        { ratio: 2, gain: 0.14, type: 'triangle' },
      ],
      filter: { type: 'lowpass', frequency: 1800, q: 0.3 },
    })
  },
}

const ensureAudioContext = async () => {
  const AudioContextConstructor = getAudioContextConstructor()

  if (!AudioContextConstructor) {
    engine.hasSupport = false
    return null
  }

  engine.hasSupport = true

  let context = engine.context

  if (!context) {
    context = new AudioContextConstructor()
    const masterGain = context.createGain()

    masterGain.connect(context.destination)
    engine.context = context
    engine.masterGain = masterGain
    updateMasterGain(context)
  }

  if (context.state === 'suspended') {
    try {
      await context.resume()
    } catch {
      // Ignore autoplay restrictions until another user interaction happens.
    }
  }

  updateMasterGain(context)

  return context
}

export function useSoundEffects() {
  const [isMuted, setIsMuted] = useState(loadMutedState)
  const [volume, setVolumeState] = useState(loadVolumeState)

  useEffect(() => {
    engine.isMuted = isMuted

    if (typeof window !== 'undefined') {
      window.localStorage.setItem(SOUND_STORAGE_KEY, String(isMuted))
    }

    updateMasterGain()
  }, [isMuted])

  useEffect(() => {
    engine.volume = volume

    if (typeof window !== 'undefined') {
      window.localStorage.setItem(SOUND_VOLUME_KEY, String(volume))
    }

    updateMasterGain()
  }, [volume])

  useEffect(() => {
    if (typeof window === 'undefined') {
      return
    }

    const syncSoundState = () => {
      setIsMuted(loadMutedState())
      setVolumeState(loadVolumeState())
    }

    window.addEventListener('storage', syncSoundState)
    window.addEventListener(SOUND_EVENT, syncSoundState as EventListener)

    return () => {
      window.removeEventListener('storage', syncSoundState)
      window.removeEventListener(SOUND_EVENT, syncSoundState as EventListener)
    }
  }, [])

  useEffect(() => {
    if (typeof window === 'undefined') {
      return
    }

    const unlockAudio = () => {
      void ensureAudioContext()
    }

    window.addEventListener('pointerdown', unlockAudio, { passive: true, once: true })
    window.addEventListener('keydown', unlockAudio, { once: true })

    return () => {
      window.removeEventListener('pointerdown', unlockAudio)
      window.removeEventListener('keydown', unlockAudio)
    }
  }, [])

  const primeAudio = useCallback(() => {
    void ensureAudioContext()
  }, [])

  const playSound = useCallback((soundKey: SynthSoundKey, options?: PlaySoundOptions) => {
    if (engine.isMuted) {
      return
    }

    void (async () => {
      try {
        const context = await ensureAudioContext()

        if (!context) {
          return
        }

        const soundVolume = clamp(options?.volume ?? 1, 0, 1)
        soundRecipes[soundKey](context, context.currentTime + 0.012, soundVolume)
      } catch {
        // Ignore playback errors so the UI never blocks on audio.
      }
    })()
  }, [])

  const toggleMute = useCallback(() => {
    setIsMuted((currentValue) => {
      const nextValue = !currentValue
      engine.isMuted = nextValue
      updateMasterGain()

      if (typeof window !== 'undefined') {
        window.localStorage.setItem(SOUND_STORAGE_KEY, String(nextValue))
        window.dispatchEvent(new Event(SOUND_EVENT))
      }

      return nextValue
    })
  }, [])

  const setVolume = useCallback((nextVolume: number) => {
    const normalizedVolume = clamp(nextVolume, 0, 1)
    engine.volume = normalizedVolume
    updateMasterGain()
    setVolumeState(normalizedVolume)

    if (typeof window !== 'undefined') {
      window.localStorage.setItem(SOUND_VOLUME_KEY, String(normalizedVolume))
      window.dispatchEvent(new Event(SOUND_EVENT))
    }
  }, [])

  return useMemo(
    () => ({
      playSound,
      toggleMute,
      setVolume,
      primeAudio,
      isMuted,
      volume,
      isSupported: engine.hasSupport !== false,
    }),
    [isMuted, playSound, primeAudio, setVolume, toggleMute, volume],
  )
}
