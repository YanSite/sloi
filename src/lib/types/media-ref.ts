/**
 * ASSET REFERENCE.
 * Ссылается на запись в AssetManifest бизнеса по id — проп WOW-секции
 * никогда не принимает сырой URL, только эту ссылку. Реэкспортируется из
 * `@/components/wow/sections` для удобства импорта; канонически
 * определён здесь.
 */
export interface MediaRef {
  assetId: string;
  alt?: string;
}
