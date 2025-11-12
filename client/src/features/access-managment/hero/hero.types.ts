type TOptions = "full" | "partial" | "fixed";

interface IUserRotation {
	mode?: TOptions;
	startingAngle?: number;
	rotationRange?: number;
	isPositiveDirection?: boolean;
	scrollFraction?: number;
}

export type { IUserRotation, TOptions };
