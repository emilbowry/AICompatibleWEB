// src/utils/reactUtils.tsx
import React from "react";
import { get_data_uri, stringifySVG } from "./misc/image-handelling";

export const wrapLink = (
	link: string | undefined,
	el: React.ReactNode
): React.ReactNode => (link ? <a href={link}>{el}</a> : el);

const _get_data_uri = (svgString: string, asCSSUrl = false): string => {
	// A more robust way to encode SVG for data URIs
	const encoded = svgString
		.replace(/"/g, "'") // Use single quotes
		.replace(/%/g, "%25")
		.replace(/#/g, "%23")
		.replace(/{/g, "%7B")
		.replace(/}/g, "%7D")
		.replace(/</g, "%3C")
		.replace(/>/g, "%3E")
		.replace(/\s+/g, " "); // Condense whitespace

	const str_uri = `data:image/svg+xml,${encoded}`;
	return asCSSUrl ? `url("${str_uri}")` : str_uri;
};

export const getImageEl = (
	image: string | undefined | React.SVGElementType,
	styling: React.CSSProperties = {},
	imageProps: any = {}
): React.ReactNode => {
	let _image = image;
	if (React.isValidElement(image)) {
		const _string = stringifySVG(image);
		_image = get_data_uri(_string);
	} else if (typeof image === "string" && image.trim().startsWith("<svg")) {
		_image = _get_data_uri(image);
	}
	return _image ? (
		<img
			src={_image}
			{...imageProps}
			style={styling}
		></img>
	) : (
		<></>
	);
};

export const Map: React.FC<{
	elements: any[];
	formatting_args?: any[];
	formatter?: boolean;
}> = ({ elements, formatting_args = [], formatter }) => (
	<React.Fragment>
		{elements.map(
			(item, _index) =>
				item && (
					<React.Fragment key={_index}>
						{formatter ? (
							<FormatComponent
								{...formatting_args}
								Component={item}
							/>
						) : (
							item
						)}
					</React.Fragment>
				)
		)}
	</React.Fragment>
);
export const SantisedElMap: React.FC<{
	element: ValidComponent[];
	formatting_args?: any[];
}> = ({ element, formatting_args = [] }) => {
	return (
		<React.Fragment>
			{element && (
				<Map
					elements={element}
					formatter={true}
					formatting_args={formatting_args}
				/>
			)}
		</React.Fragment>
	);
};
export const BoxedImage: React.FC<{
	image: string | ValidComponent;

	width?: string;
	aspectRatio: string;
	imageStyling?: React.CSSProperties;
	wrapperStyling?: React.CSSProperties;
}> = ({
	image,
	aspectRatio,
	width = "100%",
	imageStyling = {},
	wrapperStyling = {},
}) => {
	const wrapperStyle: React.CSSProperties = {
		display: "flex",
		width,
		margin: width === "100%" ? "" : "auto",
		aspectRatio,

		justifyContent: "center",
		alignContent: "center",
		alignItems: "center",

		...wrapperStyling,
	};
	const imageEl = getImageEl(image as string, {
		minWidth: 0,
		minHeight: 0,

		...imageStyling,
	});
	return <div style={wrapperStyle}>{imageEl}</div>;
};

type ComponentOrString = React.ReactNode | React.ComponentType | string;
type ComponentOrStringList = ComponentOrString[];
export type ValidComponent =
	| React.ReactElement
	| ComponentOrString
	| ComponentOrStringList
	| null;

const emptyEl = <></>;
export const NoOpFC: React.FC<
	{
		children?: React.ReactNode;
	} & any
> = ({ children }) => <>{children}</>;

const isComp = (Component: ValidComponent): Component is React.ComponentType =>
	typeof Component === "function" ||
	(Component as any).prototype instanceof React.Component;

export const FormatComponent: React.FC<{
	Component: ValidComponent;
	overlay?: boolean;
}> = ({ Component, overlay = false }): React.ReactNode | string => {
	if (Component === null) {
		return emptyEl;
	} else if (Array.isArray(Component)) {
		return Component.map((Comp, index) => (
			<div
				style={overlay ? { position: "absolute" } : {}}
				key={index}
			>
				<FormatComponent Component={Comp} />
			</div>
		));
	} else if (isComp(Component)) {
		return <Component />;
	} else {
		return Component;
	}
};
