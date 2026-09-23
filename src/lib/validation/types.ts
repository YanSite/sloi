export type ValidationSeverity = "error" | "warning";

export interface ValidationIssue {
  severity: ValidationSeverity;
  /** Стабильный, легко грепаемый код — например "asset/unresolved-reference". */
  code: string;
  /** Понятное разработчику объяснение — достаточно конкретное, чтобы действовать без чтения исходников валидатора. */
  message: string;
  /** Где в SiteConfig находится проблема — например "content.cinematic-hero" или "experience.experienceMap[2].variant". */
  path: string;
}

export interface ValidationResult {
  /** True, если нет issue со severity "error" — warning не блокирует валидность. */
  valid: boolean;
  issues: ValidationIssue[];
}
