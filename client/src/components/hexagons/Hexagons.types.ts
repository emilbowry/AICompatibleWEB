// src/components/hexagons/Hexagons.types.ts

import React from "react";
import { ValidComponent } from "../../utils/reactUtils";

interface IComponentDefinitions {
	defs: React.ReactNode[];
	paths: Required<React.ReactNode[]>;
}

interface IHexagonStyleParams {
	size?: number;
	scale?: number;
	opacity?: number;
	filter?: string;
}
type TSanitationFunction = (
	args: TOptionalParameters,
	optional_f_params: any
) => any;
type TValidInput =
	| object
	| TSanitationFunction
	| string
	| number
	| boolean
	| bigint
	| symbol
	| null
	| undefined;

type TOptionalParameters = any;

interface IOptParamMap {
	key: string;
	alias?: string;
	return_value: TValidInput;

	f_params?: any;
}

type TRefNode<T extends Element> = T | null;
type TContentObserver = ResizeObserver | null;
type TOscillation = undefined | number;
type THexFC = React.FC<Partial<THexFCProps & any>>;

type THexFCProps = {
	element: ValidComponent[] | ValidComponent;
	useVerticalAlignment: boolean;
	children?: React.ReactNode;
	styles?: any;
	_background?: string;
};

interface IHexObjState {
	content_height: number | undefined;
	container_height: number;
	font_size: number;
}
interface IHexagonState extends IHexObjState {
	setContainerRef: (node: TRefNode<HTMLDivElement>) => void;
	setContentRef: (node: TRefNode<Element>) => void;
	content_height: number;
	container_height: number;
	usePointedTop: boolean;
	font_size: number;
	construct: (args?: any) => IComponentDefinitions;
}

export type {
	IHexagonState,
	IHexagonStyleParams,
	IHexObjState,
	IOptParamMap,
	TContentObserver,
	THexFC,
	TOscillation,
	TRefNode,
};
