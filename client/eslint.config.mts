import js from "@eslint/js";
import pluginReactHooks from "eslint-plugin-react-hooks";
import { defineConfig } from "eslint/config";
import globals from "globals";
import tseslint from "typescript-eslint";

export default defineConfig([
	{
		files: ["**/*.{js,mjs,cjs,ts,mts,cts,jsx,tsx}"],
		plugins: { js },
		extends: ["js/recommended"],

		languageOptions: {
			globals: globals.browser,
		},

		rules: {
			"no-undef": "off",
			"no-unused-vars": "off",
		},
	},

	{
		files: ["**/*.{ts,mts,cts,jsx,tsx}"],
		languageOptions: {
			parser: tseslint.parser,
			parserOptions: {
				sourceType: "module",
				ecmaFeatures: {
					jsx: true,
				},
				project: "./tsconfig.json",
			},
		},
	},

	{
		files: ["**/*.{js,mjs,cjs,ts,mts,cts,jsx,tsx}"],
		...pluginReactHooks.configs.flat.recommended,
	},
]);
