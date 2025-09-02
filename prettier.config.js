/** @type {import('prettier').Config} */
export default {
  // Basic formatting
  semi: true,
  singleQuote: false,
  quoteProps: "as-needed",
  trailingComma: "es5",
  tabWidth: 2,
  useTabs: false,
  
  // Line formatting
  printWidth: 80,
  endOfLine: "lf",
  
  // JSX/TSX specific
  jsxSingleQuote: false,
  
  // Bracket spacing
  bracketSpacing: true,
  bracketSameLine: false,
  
  // Arrow function parentheses
  arrowParens: "always",
  
  // Plugin configurations
  plugins: [],
  
  // File-specific overrides
  overrides: [
    {
      files: "*.json",
      options: {
        printWidth: 120,
      },
    },
    {
      files: "*.md",
      options: {
        printWidth: 100,
        proseWrap: "always",
      },
    },
  ],
};
