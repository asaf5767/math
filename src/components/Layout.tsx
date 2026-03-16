import { motion } from 'framer-motion'
import type { PropsWithChildren } from 'react'
import FloatingCandles from './FloatingCandles'
import { useSound } from '../hooks/useSound'

export interface LayoutBreadcrumbItem {
  label: string
  onClick?: () => void
}

interface LayoutProps extends PropsWithChildren {
  breadcrumbs?: LayoutBreadcrumbItem[]
}

function Layout({ children, breadcrumbs = [] }: LayoutProps) {
  const { isMuted, toggleMute, playHover } = useSound()
  const hasBreadcrumbs = breadcrumbs.length > 0

  return (
    <div className="relative min-h-dvh overflow-hidden font-body text-hp-parchment">
      <div className="hogwarts-bg" />
      <FloatingCandles />

      <div className="pointer-events-none absolute inset-0 z-0 bg-[radial-gradient(circle_at_top,rgba(245,197,66,0.14),transparent_34%),radial-gradient(circle_at_18%_28%,rgba(126,184,255,0.12),transparent_24%),radial-gradient(circle_at_82%_22%,rgba(245,197,66,0.08),transparent_18%)]" />

      <motion.button
        type="button"
        onClick={toggleMute}
        onMouseEnter={() => playHover()}
        whileHover={{ scale: 1.06, y: -2 }}
        whileTap={{ scale: 0.94 }}
        className="fixed left-4 top-4 z-30 flex min-h-12 items-center gap-2 rounded-full border border-hp-gold/45 bg-hp-shadow/70 px-4 py-2 text-sm font-bold text-hp-parchment shadow-[0_10px_30px_rgba(10,6,18,0.45)] backdrop-blur-md transition md:left-6 md:top-6"
        aria-label={isMuted ? 'הפעילי צלילים' : 'השתיקי צלילים'}
      >
        <span className="text-lg">{isMuted ? '🔇' : '🔊'}</span>
        <span>{isMuted ? 'שקט קסום' : 'צלילים קסומים'}</span>
      </motion.button>

      <div className="relative z-10 mx-auto flex min-h-dvh w-full max-w-[840px] flex-col justify-center gap-5 px-4 py-10 md:px-6 md:py-14">
        {hasBreadcrumbs && (
          <motion.nav
            initial={{ opacity: 0, y: -14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            aria-label="ניווט בין המסכים"
            className="self-stretch rounded-[24px] border border-hp-gold/25 bg-[linear-gradient(135deg,rgba(12,6,24,0.84)_0%,rgba(34,17,56,0.78)_100%)] px-4 py-3 shadow-[0_14px_40px_rgba(10,6,18,0.28)] backdrop-blur-md"
          >
            <ol className="flex flex-wrap items-center gap-2 text-[0.72rem] font-black text-hp-gold/90 md:text-sm">
              {breadcrumbs.map((breadcrumb, index) => {
                const isCurrent = index === breadcrumbs.length - 1

                return (
                  <li key={`${breadcrumb.label}-${index}`} className="flex items-center gap-2">
                    {breadcrumb.onClick && !isCurrent ? (
                      <button
                        type="button"
                        onClick={breadcrumb.onClick}
                        onMouseEnter={() => playHover()}
                        className="rounded-full px-2 py-1 text-hp-parchment/75 transition hover:bg-hp-gold/10 hover:text-hp-gold"
                      >
                        {breadcrumb.label}
                      </button>
                    ) : (
                      <span className={isCurrent ? 'rounded-full bg-hp-gold/10 px-2 py-1 text-hp-gold' : 'px-2 py-1 text-hp-parchment/75'}>
                        {breadcrumb.label}
                      </span>
                    )}
                    {!isCurrent && <span className="text-hp-gold/45">›</span>}
                  </li>
                )
              })}
            </ol>
          </motion.nav>
        )}

        <div className="w-full">{children}</div>
      </div>
    </div>
  )
}

export default Layout
