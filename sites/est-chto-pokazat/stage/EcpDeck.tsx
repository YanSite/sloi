"use client";

import { useEffect, useRef } from "react";
import { useMotionCapability } from "@/components/wow/motion";
import type { EcpStageContent, ResolvedMedia } from "./content-types";
import { DeckController } from "./deck";
import { Foot, Header, Menu } from "./chrome";
import { Screens } from "./screens";

/**
 * Колода «Есть что показать» (клиентская часть). Разметка приходит с
 * сервера в состоянии «01 активен», анимации первого экрана — чистый
 * CSS: первая половина видна до гидратации. Контроллер колоды
 * подключается после неё. Медиа приходят уже разрешёнными (`media`) —
 * манифест ассетов в клиент не попадает.
 */

export type EcpDeckProps = { stage: EcpStageContent; media: ResolvedMedia };

/** Без JS — обычная страница: экраны друг под другом. */
const NO_JS_CSS = `.ecp .deck{position:relative;inset:auto;overflow:visible;touch-action:auto}
.ecp .screen{position:relative;min-height:100vh;visibility:visible;pointer-events:auto}`;

export function EcpDeck({ stage }: EcpDeckProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const deckRef = useRef<DeckController | null>(null);
  const { enabled } = useMotionCapability();
  const reducedRef = useRef(!enabled);
  useEffect(() => {
    reducedRef.current = !enabled;
  });

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const deck = new DeckController(root, stage.foot, { reduced: reducedRef.current });
    deckRef.current = deck;
    const detach = deck.attach();
    return () => {
      detach();
      deckRef.current = null;
    };
  }, [stage]);

  useEffect(() => {
    deckRef.current?.setReduced(!enabled);
  }, [enabled]);

  return (
    <div ref={rootRef} className="ecp hint-on" data-film="hand">
      <noscript>
        <style>{NO_JS_CSS}</style>
      </noscript>
      <Header c={stage} />
      <Menu c={stage} />
      <main className="deck" data-dir="next">
        <Screens c={stage} />
      </main>
      <Foot c={stage} />
    </div>
  );
}
