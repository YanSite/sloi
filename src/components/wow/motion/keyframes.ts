import type { StageKeyframe, StageOpacityTrack, StageTransform } from "@/lib/types";
import { smoothstep } from "./timeline";

/**
 * KEYFRAME MATH — сэмплинг хореографии, заданной ключами по прогрессу.
 * Чистые функции без DOM: одинаково считают слой сцены на любом
 * прогрессе, в том числе для отладочного scrub.
 */

/** Полностью заданный ключ: все поля StageTransform присутствуют. */
export type ResolvedTransform = Required<StageTransform>;
export type ResolvedKeyframe = [p: number, value: ResolvedTransform];

const ORIGIN: ResolvedTransform = { x: 0, y: 0, s: 1, o: 1, b: 0, h: 0 };
const FIELDS = ["x", "y", "s", "o", "b", "h"] as const;

/** Carry-forward: незаданные поля ключа наследуются от предыдущего, первый — от {x0 y0 s1 o1 b0 h0}. */
export function prepareKeyframes(keyframes: StageKeyframe[]): ResolvedKeyframe[] {
  let prev = ORIGIN;
  return keyframes.map(([p, value]) => {
    prev = { ...prev, ...value };
    return [p, prev];
  });
}

/** Значение на прогрессе `p`: за краями — крайний ключ, внутри сегмента — smoothstep. */
export function sampleKeyframes(keyframes: ResolvedKeyframe[], p: number): ResolvedTransform {
  const last = keyframes.length - 1;
  if (p <= keyframes[0][0]) return { ...keyframes[0][1] };
  if (p >= keyframes[last][0]) return { ...keyframes[last][1] };
  let i = 0;
  while (p > keyframes[i + 1][0]) i++;
  const [p0, a] = keyframes[i];
  const [p1, b] = keyframes[i + 1];
  const t = smoothstep(p0, p1, p);
  const out = { ...a };
  for (const k of FIELDS) out[k] = a[k] + (b[k] - a[k]) * t;
  return out;
}

/** Opacity-трек на прогрессе `p`, та же интерполяция. */
export function sampleTrack(track: StageOpacityTrack, p: number): number {
  const last = track.length - 1;
  if (p <= track[0][0]) return track[0][1];
  if (p >= track[last][0]) return track[last][1];
  let i = 0;
  while (p > track[i + 1][0]) i++;
  const [p0, a] = track[i];
  const [p1, b] = track[i + 1];
  return a + (b - a) * smoothstep(p0, p1, p);
}
