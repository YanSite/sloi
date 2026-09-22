/** Shared prop primitives reused across WOW sections. */
export interface CtaLink {
  label: string;
  href: string;
}

/** References an entry in a business's asset manifest by id — never a raw URL. */
export interface MediaRef {
  assetId: string;
  alt?: string;
}
