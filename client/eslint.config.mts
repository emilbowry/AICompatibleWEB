import js from "@eslint/js";
import globals from "globals";
import tseslint from "typescript-eslint";
import pluginReactHooks from "eslint-plugin-react-hooks";
import { defineConfig } from "eslint/config";

export default defineConfig([
	// 1. Base config for all files (JS/TS/JSX/TSX)
	{
		files: ["**/*.{js,mjs,cjs,ts,mts,cts,jsx,tsx}"],
		// Use the built-in ESLint rules
		plugins: { js },
		// Extend with recommended JS rules (we will disable some later)
		extends: ["js/recommended"],

		// Define browser globals like 'window', 'document', etc.
		languageOptions: {
			globals: globals.browser,
		},

		// Disable rules that cause noise, but are not related to hooks.
		rules: {
			// Disable 'no-undef' which flags 'React' as undefined
			// when not using the React plugin's settings.
			"no-undef": "off",
			// Disable 'no-unused-vars' if you find it too strict or
			// want to rely on the TypeScript compiler instead.
			"no-unused-vars": "off",
		},
	},

	// 2. Add parser support for TypeScript and JSX files (needed for them to even parse)
	{
		files: ["**/*.{ts,mts,cts,jsx,tsx}"],
		languageOptions: {
			// Use the TypeScript parser to understand TS and JSX syntax
			parser: tseslint.parser,
			parserOptions: {
				sourceType: "module",
				ecmaFeatures: {
					jsx: true,
				},
				// If you are using TS, you probably need this:
				project: "./tsconfig.json",
			},
		},
	},

	// 3. The React Hooks rules that you ONLY want
	{
		files: ["**/*.{js,mjs,cjs,ts,mts,cts,jsx,tsx}"],
		// Merge the rules from 'recommended-latest'
		...pluginReactHooks.configs.flat["recommended-latest"],
	},
]);
