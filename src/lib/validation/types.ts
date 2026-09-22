export type ValidationSeverity = "error" | "warning";

export interface ValidationIssue {
  severity: ValidationSeverity;
  /** Stable, greppable code — e.g. "asset/unresolved-reference". */
  code: string;
  /** Human-readable, developer-facing explanation, specific enough to act on without reading the validator's source. */
  message: string;
  /** Where in the SiteConfig the issue lives — e.g. "content.cinematic-hero" or "experience.experienceMap[2].variant". */
  path: string;
}

export interface ValidationResult {
  /** True iff there are no "error"-severity issues — warnings don't block validity. */
  valid: boolean;
  issues: ValidationIssue[];
}
