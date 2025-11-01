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
	serverURL: string;
	stripeSecretKey: string;
}
export type { IAppConfig, IGoogleConfig };
