"use client";

import { useEffect, useRef, useState, useSyncExternalStore, type ReactNode } from "react";
import * as THREE from "three";
import { useMotionCapability } from "@/components/wow/motion";
import { isWebGLAvailable } from "./support";
import { createGradientTexture } from "./gradient-texture";
import { ImageLayerScene, type ImageLayerConfig } from "./scene";

export interface WebGLImageLayerProps {
  /** Placeholder gradient colors — stand in for a real MediaRef photograph. */
  from: string;
  to: string;
  depth?: number;
  scaleRange?: ImageLayerConfig["scaleRange"];
  className?: string;
  /** Rendered instead of the canvas whenever WebGL isn't used — unsupported, reduced-motion, simplified/mobile, or a runtime failure. This is the CSS/image implementation, not a loading spinner. */
  fallback: ReactNode;
}

/**
 * WebGL as an ENHANCEMENT: first paint, server or client, is always the
 * fallback (`useWebGL` can only become true after `hasMounted` flips
 * post-hydration), so a slow or absent WebGL layer never blocks or
 * delays real content. A canvas only mounts, and Three.js only
 * initializes, in the effect below, once every gate already holds —
 * lazy by construction, not by a separate flag.
 *
 * Allowed only for Cinematic Hero and Product Reveal per
 * /docs/visual-dna.md — Final CTA does not use this component.
 */
export function WebGLImageLayer({
  from,
  to,
  depth = 0.2,
  scaleRange,
  className = "",
  fallback,
}: WebGLImageLayerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { enabled, simplify } = useMotionCapability();

  // "Mounted" as a subscription with a snapshot that only ever differs
  // between server (false) and client (true) — the idiomatic way to gate
  // client-only feature detection without a hydration mismatch, and
  // without deriving state via setState-in-effect.
  const hasMounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  );

  // Every gate (mounted, site/OS motion enabled, not a simplified/coarse-
  // pointer device, a real WebGL context is obtainable) has to hold
  // before a canvas ever renders. Computed during render, not via effect
  // + setState — isWebGLAvailable() itself is SSR-safe (returns false
  // without `window`), so this is safe to call unconditionally once
  // `hasMounted` confirms we're past hydration.
  const [webGLFailed, setWebGLFailed] = useState(false);
  const useWebGL = hasMounted && enabled && !simplify && !webGLFailed && isWebGLAvailable();

  useEffect(() => {
    if (!useWebGL) return;
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    let scene: ImageLayerScene | null = null;
    let renderer: THREE.WebGLRenderer | null = null;
    try {
      renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      const texture = createGradientTexture(from, to);
      scene = new ImageLayerScene(renderer, texture, { depth, scaleRange });
      scene.resize(container.clientWidth, container.clientHeight);
    } catch {
      // Context creation or setup failed for some environment-specific
      // reason (driver issue, exhausted contexts, ...) — drop to the CSS
      // fallback instead of leaving a broken canvas on screen. Dispose
      // the renderer if it got far enough to exist before the failure.
      renderer?.dispose();
      // eslint-disable-next-line react-hooks/set-state-in-effect -- reacting to a synchronous failure from an imperative third-party call (`new THREE.WebGLRenderer`), only knowable here via try/catch; not deriving state from props.
      setWebGLFailed(true);
      return;
    }

    const resizeObserver = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect;
      scene?.resize(width, height);
    });
    resizeObserver.observe(container);

    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        ticking = false;
        const rect = container.getBoundingClientRect();
        const progress = 1 - Math.min(1, Math.max(0, rect.top / window.innerHeight));
        scene?.update(progress);
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });

    const onContextLost = (event: Event) => {
      event.preventDefault();
      setWebGLFailed(true); // GPU context lost mid-session — fall back rather than render nothing.
    };
    canvas.addEventListener("webglcontextlost", onContextLost);

    return () => {
      window.removeEventListener("scroll", onScroll);
      canvas.removeEventListener("webglcontextlost", onContextLost);
      resizeObserver.disconnect();
      scene?.dispose();
    };
  }, [useWebGL, from, to, depth, scaleRange]);

  return (
    <div ref={containerRef} className={className}>
      {useWebGL ? <canvas ref={canvasRef} className="h-full w-full" /> : fallback}
    </div>
  );
}
