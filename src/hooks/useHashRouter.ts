import { useCallback, useEffect, useRef, useSyncExternalStore } from 'react'
import type { Screen } from '../types/game'

export interface HashRouterParams {
  levelId?: number
}

interface HashRoute {
  screen: Screen
  params: HashRouterParams
}

interface NavigateOptions {
  replace?: boolean
}

const isLevelId = (value: number | undefined): value is number =>
  value !== undefined && Number.isInteger(value) && value >= 1

const getDefaultRoute = (hasPlayerName: boolean): HashRoute => ({
  screen: hasPlayerName ? 'map' : 'home',
  params: {},
})

const buildHash = (screen: Screen, params: HashRouterParams = {}) => {
  if (screen === 'practice' && isLevelId(params.levelId)) {
    return `#practice/${params.levelId}`
  }

  if (screen === 'spellbook') {
    return '#spellbook'
  }

  if (screen === 'complete') {
    return '#complete'
  }

  if (screen === 'map') {
    return '#map'
  }

  return '#home'
}

const parseHash = (hash: string, hasPlayerName: boolean): HashRoute => {
  const normalizedHash = hash.replace(/^#/, '').trim()

  if (!normalizedHash) {
    return getDefaultRoute(hasPlayerName)
  }

  const [segment, levelSegment] = normalizedHash.split('/')

  if (segment === 'home') {
    return { screen: 'home', params: {} }
  }

  if (segment === 'map') {
    return { screen: 'map', params: {} }
  }

  if (segment === 'spellbook') {
    return { screen: 'spellbook', params: {} }
  }

  if (segment === 'complete') {
    return { screen: 'complete', params: {} }
  }

  if (segment === 'practice') {
    const levelId = Number(levelSegment)

    if (isLevelId(levelId)) {
      return {
        screen: 'practice',
        params: { levelId },
      }
    }
  }

  return getDefaultRoute(hasPlayerName)
}

const replaceLocationHash = (hash: string) => {
  const { pathname, search } = window.location
  window.history.replaceState(null, '', `${pathname}${search}${hash}`)
}

const emitLocationChange = () => {
  window.dispatchEvent(new HashChangeEvent('hashchange'))
  window.dispatchEvent(new PopStateEvent('popstate'))
}

const subscribeToLocation = (onStoreChange: () => void) => {
  window.addEventListener('hashchange', onStoreChange)
  window.addEventListener('popstate', onStoreChange)

  return () => {
    window.removeEventListener('hashchange', onStoreChange)
    window.removeEventListener('popstate', onStoreChange)
  }
}

// Stable snapshot: only create a new object when the hash actually changes
let cachedHash = ''
let cachedRoute: HashRoute = { screen: 'home', params: {} }

function getStableSnapshot(hasPlayerName: boolean): HashRoute {
  const currentHash = window.location.hash
  if (currentHash !== cachedHash) {
    cachedHash = currentHash
    cachedRoute = parseHash(currentHash, hasPlayerName)
  }
  return cachedRoute
}

export function useHashRouter(hasPlayerName = false) {
  const hasPlayerNameRef = useRef(hasPlayerName)
  hasPlayerNameRef.current = hasPlayerName

  const route = useSyncExternalStore(
    subscribeToLocation,
    () => getStableSnapshot(hasPlayerNameRef.current),
    () => getDefaultRoute(hasPlayerName),
  )

  useEffect(() => {
    const normalizedHash = buildHash(route.screen, { levelId: route.params.levelId })

    if (window.location.hash !== normalizedHash) {
      replaceLocationHash(normalizedHash)
    }
  }, [route.params.levelId, route.screen])

  const navigate = useCallback((screen: Screen, params: HashRouterParams = {}, options?: NavigateOptions) => {
    const nextHash = buildHash(screen, isLevelId(params.levelId) ? { levelId: params.levelId } : {})

    // Invalidate cache so useSyncExternalStore picks up the new route
    cachedHash = ''

    if (options?.replace) {
      if (window.location.hash !== nextHash) {
        replaceLocationHash(nextHash)
        emitLocationChange()
      }
      return
    }

    if (window.location.hash === nextHash) {
      return
    }

    window.location.hash = nextHash
  }, [])

  const goBack = useCallback(() => {
    if (window.history.length > 1) {
      window.history.back()
      return
    }

    const fallbackRoute = getDefaultRoute(hasPlayerName)
    replaceLocationHash(buildHash(fallbackRoute.screen, fallbackRoute.params))
    emitLocationChange()
  }, [hasPlayerName])

  return {
    screen: route.screen,
    params: route.params,
    navigate,
    goBack,
  }
}
