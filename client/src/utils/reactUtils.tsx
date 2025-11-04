// src/utils/reactUtils.tsx
import React from "react";
import { get_data_uri, stringifySVG } from "./misc/image-handelling";

export const wrapLink = (
	link: string | undefined,
	el: React.ReactNode
): React.ReactNode => (link ? <a href={link}>{el}</a> : el);

export const getImageEl = (
	image: string | undefined | React.SVGElementType,
	styling: React.CSSProperties = {},
	imageProps: any = {}
): React.ReactNode => {
	let _image = image;
	if (React.isValidElement(image)) {
		const _string = stringifySVG(image);
		_image = get_data_uri(_string);
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
		// ...GenericSectionStyle,
		display: "flex",
		width,
		margin: width === "100%" ? "" : "auto",
		aspectRatio,
		// height: "10px",
		// padding: 0,

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

// export const formatComponent = (
// 	component: ValidComponent,
// 	overlay = false
// ): React.ReactNode | string => {
// 	if (component === null) {
// 		return emptyEl;
// 	} else if (Array.isArray(component)) {
// 		return component.map((Comp, index) => (
// 			<div
// 				style={overlay ? { position: "absolute" } : {}}
// 				key={index}
// 			>
// 				{formatComponent(Comp)}
// 			</div>
// 		));
// 	} else if (
// 		typeof component === "function" ||
// 		(component as any).prototype instanceof React.Component
// 	) {
// 		const SingleComponent = component as React.ComponentType;
// 		return <SingleComponent />;
// 	} else {
// 		return component;
// 	}
// };

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

// const isAndroid = useMemo(() => /Android/i.test(navigator.userAgent), []);

// export { isAndroid };
