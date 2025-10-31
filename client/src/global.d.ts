// src/global.d.ts

declare module "*.svg" {
	const content: string;
	export default content;
}
declare module "*.png?inline" {
	const value: string;
	export default value;
}
declare module "*.module.css" {
	const classes: { [key: string]: string };
	export default classes;
}

declare module "*.png" {
	const value: string;
	export default value;
}
declare module "*.ics" {
	const value: string;
	export default value;
}
declare module "*.jpg" {
	const value: string;
	export default value;
}

declare module "*.jpeg" {
	const value: string;
	export default value;
}

declare module "*.gif" {
	const value: string;
	export default value;
}

declare module "*.webp" {
	const value: string;
	export default value;
}

/* 

└── TestLink
│   └── test.tsx
│   └── text.some_ext
 */
