"use client";

import { createContext, useCallback, useContext, useSyncExternalStore, type ReactNode } from "react";

/**
 * MOTION CAPABILITY — the one place that decides whether a primitive
 * should do scroll-linked or JS-driven entrance work. No primitive
 * queries matchMedia or a provider on its own; they all read this.
 *
 * This hook is a PERFORMANCE gate (should we bother attaching scroll
 * listeners / observers), not the primary reduced-motion guarantee —
 * every primitive also carries Tailwind `motion-reduce:` classes that
 * apply from a pure CSS media query on first paint, before any JS runs
 * or hydrates. That CSS is the full fallback; this hook is secondary.
 */
export interface MotionCapability {
  /** False under `prefers-reduced-motion: reduce` or the site's own kill switch. */
  enabled: boolean;
  /** True on coarse-pointer/touch devices — primitives may skip expensive scroll-linked work and keep only cheap enter transitions. */
  simplify: boolean;
}

const MotionContext = createContext<{ siteEnabled: boolean }>({ siteEnabled: true });

export interface MotionProviderProps {
  /** Site-level kill switch, independent of the visitor's OS setting. Defaults to on. */
  enabled?: boolean;
  children: ReactNode;
}

/** Wrap the app (or a subtree) to control motion site-wide. Optional — every primitive still respects prefers-reduced-motion without it. */
export function MotionProvider({ enabled = true, children }: MotionProviderProps) {
  return (
    <MotionContext.Provider value={{ siteEnabled: enabled }}>{children}</MotionContext.Provider>
  );
}

function useMediaQuery(query: string): boolean {
  const subscribe = useCallback(
    (callback: () => void) => {
      const mql = window.matchMedia(query);
      mql.addEventListener("change", callback);
      return () => mql.removeEventListener("change", callback);
    },
    [query]
  );
  const getSnapshot = useCallback(() => window.matchMedia(query).matches, [query]);
  const getServerSnapshot = useCallback(() => false, []);
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

export function useMotionCapability(): MotionCapability {
  const { siteEnabled } = useContext(MotionContext);
  const reducedMotion = useMediaQuery("(prefers-reduced-motion: reduce)");
  const coarsePointer = useMediaQuery("(pointer: coarse)");
  return {
    enabled: siteEnabled && !reducedMotion,
    simplify: coarsePointer,
  };
}
