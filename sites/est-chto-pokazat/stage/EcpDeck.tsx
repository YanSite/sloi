"use client";

import { useEffect, useRef } from "react";
import { useDeviceTier, useMotionCapability } from "@/components/wow/motion";
import type { EcpStageContent, ResolvedMedia } from "./content-types";
import { DeckController } from "./deck";
import { Foot, Header, Menu } from "./chrome";
import { Screens } from "./screens";
import { Film, filmVars } from "./Film";
import { Turn } from "./turn/Turn";
import { TurnScene } from "./turn/turn-scene";
import { Acts, Macro } from "./cases/Acts";
import { HeavyMedia } from "./cases/heavy";
import { pickUrl } from "./media";
import { Sheet } from "./form/Sheet";

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

export function EcpDeck({ stage, media }: EcpDeckProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const deckRef = useRef<DeckController | null>(null);
  const turnRef = useRef<TurnScene | null>(null);
  const { enabled } = useMotionCapability();
  const { lite } = useDeviceTier();
  const initial = useRef({ reduced: !enabled, lite });
  useEffect(() => {
    initial.current = { reduced: !enabled, lite };
  });

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const { reduced, lite } = initial.current;
    root.classList.toggle("lite", lite);
    const turn = new TurnScene(root, { lite });
    const heavy = new HeavyMedia(root, media);
    const deck = new DeckController(root, stage.foot, {
      reduced,
      lite,
      film: turn,
      cases: {
        macroUrl: (key) => {
          const m = media[key as keyof typeof media];
          return m && !Array.isArray(m) ? pickUrl(m, window.innerWidth) : "";
        },
        ensureMedia: () => heavy.ensure(),
      },
    });
    heavy.schedule();
    turnRef.current = turn;
    deckRef.current = deck;
    const detach = deck.attach();
    return () => {
      detach();
      turn.dispose();
      heavy.dispose();
      deckRef.current = null;
      turnRef.current = null;
    };
  }, [stage, media]);

  useEffect(() => {
    deckRef.current?.setReduced(!enabled);
  }, [enabled]);

  useEffect(() => {
    rootRef.current?.classList.toggle("lite", lite);
    turnRef.current?.setLite(lite);
    deckRef.current?.setLite(lite);
  }, [lite]);

  return (
    <div ref={rootRef} className="ecp hint-on" data-film="hand" style={filmVars(media)}>
      <noscript>
        <style>{NO_JS_CSS}</style>
      </noscript>
      <Film media={media} />
      <Acts />
      <Turn street={media.street} demo={stage.s04.demo} />
      <Header c={stage} />
      <Menu c={stage} />
      <main className="deck" data-dir="next">
        <Screens c={stage} />
      </main>
      <Macro skip={stage.cases.skip} />
      <Foot c={stage} />
      <Sheet f={stage.form} privacyHref={stage.s07.privacy.href} />
    </div>
  );
}
