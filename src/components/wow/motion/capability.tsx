"use client";

import {
  createContext,
  useCallback,
  useContext,
  useSyncExternalStore,
  type ReactNode,
} from "react";

/**
 * MOTION CAPABILITY — единственное место, решающее, должен ли примитив
 * выполнять scroll-linked или JS-driven работу при появлении. Ни один
 * примитив не запрашивает matchMedia или провайдер самостоятельно — все
 * читают отсюда.
 *
 * Этот хук — PERFORMANCE-шлюз (стоит ли вообще навешивать scroll
 * listeners/observers), а не основная гарантия reduced-motion — каждый
 * примитив также несёт Tailwind-классы `motion-reduce:`, которые
 * применяются через чистый CSS media query при первой отрисовке, до
 * запуска или гидратации любого JS. Именно этот CSS — полный fallback;
 * этот хук вторичен.
 */
export interface MotionCapability {
  /** False при `prefers-reduced-motion: reduce` или собственном kill switch сайта. */
  enabled: boolean;
  /** True на устройствах с coarse-pointer/touch — примитивы могут пропускать дорогую scroll-linked работу и оставлять только дешёвые enter-переходы. */
  simplify: boolean;
}

const MotionContext = createContext<{ siteEnabled: boolean }>({ siteEnabled: true });

export interface MotionProviderProps {
  /** Kill switch уровня сайта, независимый от настройки ОС посетителя. По умолчанию включён. */
  enabled?: boolean;
  children: ReactNode;
}

/** Оборачивает приложение (или поддерево) для управления motion во всём сайте. Опционально — каждый примитив и без этого соблюдает prefers-reduced-motion. */
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
    [query],
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
