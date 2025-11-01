// server/src/config/index.types.ts

interface IGoogleConfig {
	clientId: string;
	clientSecret: string;
	redirectUri: string;
}

interface IAppConfig {
	port: number;
	isProduction: boolean;
	clientURL: string;
	google: IGoogleConfig;
}
export type { IAppConfig, IGoogleConfig };
