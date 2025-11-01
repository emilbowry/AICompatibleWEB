// server/src/config/index.types.ts

interface AppConfig {
	port: number;
	isProduction: boolean;
	clientURL: string;
}

export type { AppConfig };
