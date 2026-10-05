"use client";

import {
  createContext,
  useCallback,
  useContext,
  useRef,
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

/**
 * DEVICE TIER — нужна ли облегчённая версия тяжёлых сцен: слабое
 * устройство или медленная сеть. Смысл сцены сохраняется, уходят только
 * дорогие эффекты; что именно облегчить — решает сайт.
 *
 * Сигналы (все — подсказки браузера, где они есть; Safari их не отдаёт,
 * и там `lite` остаётся false): режим экономии трафика, сеть 2g/3g,
 * `deviceMemory` и `hardwareConcurrency` не выше порогов.
 */
export interface DeviceTier {
  lite: boolean;
  /** Какие сигналы сработали — для отладки и QA. */
  reasons: string[];
}

export interface DeviceTierThresholds {
  /** Память устройства, ГБ, при которой и ниже — облегчённая версия. */
  maxMemoryGb?: number;
  /** Число логических ядер, при котором и ниже — облегчённая версия. */
  maxCores?: number;
  /** `effectiveType` сети, считающиеся медленными. */
  slowNetworks?: string[];
}

const DEFAULT_TIER: Required<DeviceTierThresholds> = {
  maxMemoryGb: 2,
  maxCores: 2,
  slowNetworks: ["slow-2g", "2g", "3g"],
};

interface NetworkInformationLike extends EventTarget {
  saveData?: boolean;
  effectiveType?: string;
}

function connection(): NetworkInformationLike | undefined {
  return (navigator as Navigator & { connection?: NetworkInformationLike }).connection;
}

/** Уровень устройства прямо сейчас (только в браузере). */
export function getDeviceTier(thresholds: DeviceTierThresholds = {}): DeviceTier {
  const t = { ...DEFAULT_TIER, ...thresholds };
  const reasons: string[] = [];
  const net = connection();
  if (net?.saveData) reasons.push("save-data");
  if (net?.effectiveType && t.slowNetworks.includes(net.effectiveType))
    reasons.push(`network-${net.effectiveType}`);
  const memory = (navigator as Navigator & { deviceMemory?: number }).deviceMemory;
  if (memory !== undefined && memory <= t.maxMemoryGb) reasons.push(`memory-${memory}`);
  const cores = navigator.hardwareConcurrency;
  if (cores && cores <= t.maxCores) reasons.push(`cores-${cores}`);
  return { lite: reasons.length > 0, reasons };
}

const SERVER_TIER: DeviceTier = { lite: false, reasons: [] };

/**
 * Хук над `getDeviceTier`: на сервере и до гидратации — не облегчённая
 * версия; при смене сети (`connection.change`) пересчитывается.
 */
export function useDeviceTier(thresholds?: DeviceTierThresholds): DeviceTier {
  const key = JSON.stringify(thresholds ?? {});
  const cache = useRef<{ key: string; value: DeviceTier } | null>(null);
  const subscribe = useCallback((callback: () => void) => {
    const net = connection();
    net?.addEventListener("change", callback);
    return () => net?.removeEventListener("change", callback);
  }, []);
  const getSnapshot = useCallback(() => {
    const next = getDeviceTier(JSON.parse(key) as DeviceTierThresholds);
    const prev = cache.current;
    if (prev && prev.key === key && prev.value.reasons.join() === next.reasons.join())
      return prev.value;
    cache.current = { key, value: next };
    return next;
  }, [key]);
  return useSyncExternalStore(subscribe, getSnapshot, () => SERVER_TIER);
}
