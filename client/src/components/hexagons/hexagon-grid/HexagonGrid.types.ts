import React from "react";
import { ValidComponent } from "../../../utils/reactUtils";

interface IHexagonRowElements {
	elements: readonly [ValidComponent, ValidComponent, ValidComponent];
	len?: number;
}

type THexRowLayoutProps = IHexagonRowElements & Omit<TScaleParams, "index">;

interface IHexagonGridElements extends Partial<THexRowLayoutProps> {
	rows: IHexagonRowElements[];

	containerStyle?: React.CSSProperties;
	class_name?: string;
}

type TScaleParams = {
	relative_spacing: number;
	absolute_spacing: number;
	n: number;
	index: number;
	upper_first?: boolean;
};

type TScalingFunction = (scale_params: TScaleParams) => number;

type TDualScalingFunction = TScalingFunction extends (
	scale_params: infer U
) => ReturnType<TScalingFunction>
	? (
			scale_params: U,
			...others: any[]
	  ) => [ReturnType<TScalingFunction>, ReturnType<TScalingFunction>]
	: never;

type TWithCalc = <D extends boolean = false>(
	fn: TDualScalingFunction | TScalingFunction,
	dual?: D
) => (
	...args: Parameters<typeof fn>
) => D extends true ? [string, string] : string;

export type {
	IHexagonGridElements,
	IHexagonRowElements,
	TDualScalingFunction,
	THexRowLayoutProps,
	TScaleParams,
	TScalingFunction,
	TWithCalc,
};
