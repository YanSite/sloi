import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";
import prettierConfig from "eslint-config-prettier";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  {
    rules: {
      // Настоящая ошибка, а не стилистика: неиспользуемый импорт/переменная
      // — мёртвый код. Именованные через "_" параметры/переменные считаются
      // намеренно неиспользуемыми (например, `_props` в section-заглушках)
      // и не флагуются — конвенция, уже принятая в проекте.
      "@typescript-eslint/no-unused-vars": [
        "error",
        {
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
          caughtErrorsIgnorePattern: "^_",
        },
      ],
      // `any` выключает проверку типов именно там, где она нужнее всего.
      // В кодовой базе сейчас нет ни одного `any` — правило ничего не ломает
      // сегодня и защищает от случайного появления в будущем.
      "@typescript-eslint/no-explicit-any": "error",
      // Non-null assertion (`!`) может быть уместен, но легко маскирует
      // реальный null/undefined баг — предупреждение, а не ошибка, оставляет
      // право использовать его осознанно.
      "@typescript-eslint/no-non-null-assertion": "warn",
      // Type-only импорт без `import type` — уже сложившийся в проекте
      // стиль; правило лишь делает его обязательным и автоисправляемым.
      "@typescript-eslint/consistent-type-imports": ["error", { prefer: "type-imports" }],
    },
  },
  // Должен идти последним среди конфигов с правилами: выключает все
  // stylistic-правила ESLint, которые могут конфликтовать с Prettier —
  // форматирование теперь целиком за Prettier, ESLint только про
  // correctness.
  prettierConfig,
  // Переопределяет ignores по умолчанию из eslint-config-next.
  globalIgnores([
    // Ignores по умолчанию из eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
]);

export default eslintConfig;
