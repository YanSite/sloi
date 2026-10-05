import type { ImmersiveStageProps } from "@/components/wow/sections";
import { resolveAsset } from "@/lib/assets";
import type { EcpStageContent, ResolvedMedia } from "./content-types";
import { EcpDeck } from "./EcpDeck";
import "../assets/fonts/fonts.css";
import "./styles/deck.css";

/**
 * Immersive-stage «Есть что показать» — реализация варианта
 * "est-chto-pokazat" секции `immersive-stage`, зарегистрированная через
 * `SiteConfig.sectionVariants`.
 *
 * Серверный компонент: разрешает медиа через `resolveAsset` и отдаёт
 * клиентской колоде только URL, размеры и alt. Сам манифест (источники,
 * назначения, промпты) в HTML и клиентский payload не попадает —
 * технология невидима и в исходном коде страницы.
 */

export type EcpStageProps = ImmersiveStageProps<EcpStageContent>;

export function EcpStage({ stage, assets }: EcpStageProps) {
  const media = Object.fromEntries(
    Object.entries(stage.media).map(([key, ref]) => {
      const a = resolveAsset(ref, assets);
      const f = a.sources[0];
      return [
        key,
        { src: f?.url ?? "", width: f?.width ?? 0, height: f?.height ?? 0, alt: ref.alt ?? "" },
      ];
    }),
  ) as ResolvedMedia;
  return <EcpDeck stage={stage} media={media} />;
}
