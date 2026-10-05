import type { ImmersiveStageProps } from "@/components/wow/sections";
import { getImageProps } from "next/image";
import { resolveAsset } from "@/lib/assets";
import type { MediaRef } from "@/lib/types";
import type { EcpStageContent, MediaFile, ResolvedMedia } from "./content-types";
import { EcpDeck } from "./EcpDeck";
import "../assets/fonts/fonts.css";
import "./styles/deck.css";
import "./styles/film.css";
import "./styles/turn.css";
import "./styles/cases.css";

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

/**
 * Версии файла от оптимизатора изображений Next (WebP, качество по
 * умолчанию) — через официальный `getImageProps`. Ширины больше оригинала
 * не нужны: оптимизатор не увеличивает, оставляется одна, первая ≥ оригинала.
 */
function optimized(src: string, width: number, height: number) {
  if (!src || !width) return { set: [], srcSet: "" };
  const { props } = getImageProps({ src, width, height, alt: "", sizes: "100vw" });
  const all = (props.srcSet ?? "")
    .split(", ")
    .map((part) => {
      const [url, w] = part.split(" ");
      return { url, w: parseInt(w, 10) };
    })
    .filter((x) => x.url && x.w);
  const firstAbove = all.find((x) => x.w >= width);
  const set = all.filter((x) => x.w < width || x === firstAbove);
  return { set, srcSet: set.map((x) => `${x.url} ${x.w}w`).join(", ") };
}

export type EcpStageProps = ImmersiveStageProps<EcpStageContent>;

export function EcpStage({ stage, assets }: EcpStageProps) {
  const file = (ref: MediaRef): MediaFile => {
    const f = resolveAsset(ref, assets).sources[0];
    const src = f?.url ?? "";
    const width = f?.width ?? 0;
    const height = f?.height ?? 0;
    return { src, width, height, alt: ref.alt ?? "", ...optimized(src, width, height) };
  };
  const media = Object.fromEntries(
    Object.entries(stage.media).map(([key, ref]) => [
      key,
      Array.isArray(ref) ? ref.map(file) : file(ref),
    ]),
  ) as ResolvedMedia;
  return <EcpDeck stage={stage} media={media} />;
}
