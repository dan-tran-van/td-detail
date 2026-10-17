import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    // Protect third-party React Bits animations per AGENTS.md rule 4.2
    "components/Antigravity.tsx",
    "components/Aurora.tsx",
    "components/ShinyText.tsx",
    "components/SplitText.tsx",
    "components/TiltedCard.tsx",
    "components/Waves.tsx",
  ]),
  {
    rules: {
      "@typescript-eslint/no-explicit-any": "warn",
      "react-hooks/set-state-in-effect": "warn",
      "react-hooks/refs": "warn",
      "react-hooks/immutability": "warn",
      "@next/next/no-img-element": "off",
    },
  },
]);

export default eslintConfig;
