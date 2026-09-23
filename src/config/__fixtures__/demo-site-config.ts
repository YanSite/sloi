import type { SiteConfig } from "@/lib/types";
import { assertValidSiteConfig } from "@/lib/validation";
import {
  floristBusinessProfile,
  floristVisualDNA,
  floristAssetManifest,
  floristThemeTokens,
} from "@/config/verticals/florist";
import { floristTemplate } from "@/templates/florist.template";
import { demoContent } from "./demo-content";

/**
 * Proof-of-concept фикстура рендерера из Stage 2, сохранена для
 * регрессионного покрытия теперь, когда у `floristSiteConfig`
 * (src/config/verticals/florist) тоже есть реальный placeholder-контент
 * (Stage 8) — эти два конфига теперь во многом пересекаются; этот
 * закреплён за своим собственным `demoContent`, а не слит с вертикалью,
 * поэтому будущая правка реального контента florist не сможет незаметно
 * сломать изначальное доказательство «все 10 секций собираются по
 * порядку». Валидируется один раз при загрузке модуля через
 * `assertValidSiteConfig`.
 */
export const demoSiteConfig: SiteConfig = assertValidSiteConfig({
  business: floristBusinessProfile,
  visualDNA: floristVisualDNA,
  experience: floristTemplate,
  content: demoContent,
  assets: floristAssetManifest,
  theme: floristThemeTokens,
  motion: { preset: "fade-up", duration: 0.6 },
});
