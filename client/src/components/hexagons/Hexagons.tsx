import React, { createContext, useContext } from "react";

import { useLayoutEffect, useRef, useState } from "react";
import { IS_CHROME } from "../../hooks/BrowserDependant";
import {
	formatComponent,
	Map,
	NoOpFC,
	SantisedElMap,
} from "../../utils/reactUtils";
import {
	FLATTOP_HEX_PATH,
	HEX_STARTING_STATE,
	MAX_OSCILLATIONS,
	POINTEDTOP_HEX_PATH,
	USE_POINTED_TOP,
} from "./Hexagons.consts";
import {
	containerStyle,
	ElContainerStyle,
	ElementSectionStyle,
	ElementWrapperStyle,
	ELWrapperStyle,
	HexagonalContentStyle,
	polyCutoutStyle,
	svgStyle,
} from "./Hexagons.styles";
import {
	IHexagonState,
	IHexObjState,
	IOptParamMap,
	TContentObserver,
	THexFC,
	TOscillation,
	TRefNode,
} from "./Hexagons.types";
/**  
* @improvement
The first time the first element is outside hex, trigger exactly 1 window refresh,
same if an element's middle is not centered

 */
const HexSVG: React.FC<{
	styles: any;
	usePointedTop?: boolean;
	children: React.ReactNode;
}> = ({ styles, usePointedTop, children }) => {
	const { usePointedTop: contextPointedTop } = useContext(HexagonContext);
	const isPointedTop = usePointedTop || contextPointedTop || false;

	return (
		<svg
			style={svgStyle(styles)}
			// style={{
			// 	// background: `linear-gradient(to right, #79C2D0, #C9E59F) fixed`,
			// }}
			viewBox={
				isPointedTop
					? `${100 - (200 * Math.sqrt(3)) / 4} -100 ${
							(200 * Math.sqrt(3)) / 2
					  } 200`
					: `0 -${(200 * Math.sqrt(3)) / 4} 200 ${
							(200 * Math.sqrt(3)) / 2
					  }`
			}
			xmlns="http://www.w3.org/2000/svg"
		>
			{children}
		</svg>
	);
};

const HexagonContext = createContext<IHexagonState>({} as any);
const ComposedHexSVG: THexFC = ({ styles }) => {
	const { construct } = useContext(HexagonContext);
	const { defs, paths } = construct();

	return (
		<HexSVG
			styles={{
				...styles,
			}}
		>
			<defs>
				<Map elements={defs} />
			</defs>
			<Map elements={paths} />
		</HexSVG>
	);
};

const ContentWrapper: React.FC<{
	children?: React.ReactNode;
}> = ({ children }) => {
	const { setContentRef } = useContext(HexagonContext);

	return (
		<div
			ref={setContentRef}
			// style={{}}
		>
			<div style={ELWrapperStyle}>{children}</div>
		</div>
	);
};
const ContainedElement: THexFC = ({ element, useVerticalAlignment }) => {
	const HContentWrapper =
		!Array.isArray(element) && !useVerticalAlignment
			? NoOpFC
			: ContentWrapper;
	const Inner: React.ReactNode = !Array.isArray(element) ? (
		formatComponent(element)
	) : (
		<SantisedElMap element={element} />
	);
	const HScallingWrapper = !Array.isArray(element) ? NoOpFC : ScallingWrapper;

	return (
		<HContentWrapper>
			<HScallingWrapper>{Inner}</HScallingWrapper>
		</HContentWrapper>
	);
};
const ScallingWrapper: THexFC = ({ children }) => {
	return (
		<div
			style={{
				...ElContainerStyle,
				fontSize: `calc(max(${
					useContext(HexagonContext).font_size
				}vw,1px))`,
			}}
		>
			{children}
		</div>
	);
};
const BoundingShape: React.FC<{
	hex_shape_height_override: boolean | string | undefined;
	hex_shape_width_override: boolean | string | undefined;
}> = ({ hex_shape_height_override, hex_shape_width_override }) => {
	const { usePointedTop } = useContext(HexagonContext);

	return (
		<>
			<div
				style={polyCutoutStyle(
					usePointedTop,
					true,
					hex_shape_height_override,
					hex_shape_width_override
				)}
			/>
			<div
				style={polyCutoutStyle(
					usePointedTop,
					false,
					hex_shape_height_override,
					hex_shape_width_override
				)}
			/>
		</>
	);
};

const ActualDocHeight = "-70vh"; // i have a footer that extands about this much
const FixedBackgroundClipper: React.FC<{
	background: string;
	backgroundSize?: string;
	backgroundPosition?: string;
	left?: number;
	top?: number;
	isBackgroundFixed?: boolean;
}> = ({
	background,
	backgroundSize = "100vw 100vh",
	left = 0,
	top = 0,
	isBackgroundFixed = true,
}) => {
	const ref = useRef<HTMLDivElement>(null);
	const [bgPosition, setBgPosition] = useState<string>(`0 0`);
	const { usePointedTop } = useContext(HexagonContext);

	useLayoutEffect(() => {
		const updateBackgroundPosition = () => {
			let finalOffsetX: number;
			let finalOffsetY: number;

			if (ref.current) {
				// if (isBackgroundFixed) {
				const rect = ref.current.getBoundingClientRect();

				const baseOffsetX = -rect.left;
				const baseOffsetY = -rect.top;

				finalOffsetX = baseOffsetX + left;
				finalOffsetY = baseOffsetY + top;
				if (!isBackgroundFixed) {
					/* currently broken */
					const docOffsetX = ref.current.offsetLeft;
					// const docOffsetY = ref.current.offsetTop;
					const sy = window.scrollY;
					finalOffsetX = docOffsetX + finalOffsetX;
					finalOffsetY = -sy + -rect.top;
				}

				const newPosition = `${finalOffsetX}px calc(${finalOffsetY}px)`;
				setBgPosition(newPosition);
			}
		};

		updateBackgroundPosition();

		window.addEventListener("scroll", updateBackgroundPosition);
		window.addEventListener("resize", updateBackgroundPosition);

		return () => {
			window.removeEventListener("scroll", updateBackgroundPosition);
			window.removeEventListener("resize", updateBackgroundPosition);
		};
	}, [isBackgroundFixed, left, top]);
	return (
		<div
			ref={ref}
			style={{
				position: "absolute",
				height: "100%",
				clipPath: usePointedTop ? point_path : flat_path,
				background,
				// background: "transparent",
				backgroundSize,
				// backgroundPosition: bgPosition,
				backgroundPosition: bgPosition,

				width: "100%",
			}}
		/>
	);
};
const flat_path =
	"polygon(0% 50%, 25% 0%, 75% 0%, 100% 50%,75% 100%, 25% 100% )";
const point_path =
	"polygon(0% 25%, 50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75% )";

const CenterAlignedElement: THexFC = ({
	element,
	_background,
	useVerticalAlignment,
	hex_shape_height_override,
	hex_shape_width_override,
}) => {
	const { container_height, content_height, setContainerRef } =
		useContext(HexagonContext);
	return (
		element && (
			<div
				style={{
					...HexagonalContentStyle,
				}}
				ref={setContainerRef}
			>
				{_background && (
					<FixedBackgroundClipper background={_background} />
				)}
				<div
					style={{
						...ElementWrapperStyle,
					}}
				>
					<BoundingShape
						hex_shape_height_override={hex_shape_height_override}
						hex_shape_width_override={hex_shape_width_override}
					/>
					<div
						style={{
							...ElementSectionStyle,

							paddingTop: useVerticalAlignment
								? `calc(${
										(container_height - content_height) / 2
								  }px)`
								: 0,
						}}
					>
						<ContainedElement
							element={element}
							useVerticalAlignment={useVerticalAlignment}
						/>
					</div>
				</div>
			</div>
		)
	);
};

class Hexagon
	extends React.Component<any, IHexObjState>
	implements IHexagonState
{
	static usePointedTop = USE_POINTED_TOP;
	static default_hex_path = FLATTOP_HEX_PATH;
	static alt_hex_path = POINTEDTOP_HEX_PATH;
	static starting_state = HEX_STARTING_STATE;
	static max_osc = MAX_OSCILLATIONS;
	private n_updates = 0;

	private container_node: TRefNode<Element> = null;

	private content_node: TRefNode<Element> = null;
	private content_observer: TContentObserver = null;
	private _oscillations: TOscillation = undefined;

	hex_path!: string;
	usePointedTop!: boolean;

	get font_size() {
		return 2.5;
	}

	get container_height() {
		return this.container_node ? this.container_node.clientHeight : 400;
	}

	get content_height() {
		return this.state.content_height ?? 0;
	}

	get oscillations() {
		return this._oscillations ?? 0;
	}
	set oscillations(value: number) {
		this._oscillations = (this._oscillations ?? 0) + value;
	}
	get hex_state(): IHexagonState {
		return {
			setContainerRef: this.setContainerRef,
			setContentRef: this.setContentRef,
			container_height: this.container_height,
			content_height: this.content_height,
			usePointedTop: this.usePointedTop,
			font_size: this.state.font_size,
			construct: this.construct.bind(this),
		};
	}

	setContainerRef = (node: TRefNode<HTMLDivElement>) => {
		this.container_node = node;
	};
	setContentRef = (node: TRefNode<Element>) => {
		this.content_node = node;
	};
	private nudgeHeight = (height: number) => {
		const delta = this.content_height - height;
		const pertubation = 2 * (this.oscillations % 2) - 1;
		return (
			height +
			delta * +!!this.oscillations +
			pertubation * this.oscillations * +!!delta
		);
	};
	constructor(props: any) {
		super(props);
		this.setOrientation();
		this.state = Hexagon.starting_state;
	}
	santiseOptionalParameters() {
		const { args } = this.props;
		const sanitised_args: any = {};
		const getValue = (return_value: any, f_params?: any) =>
			typeof return_value === "function"
				? return_value(args, f_params)
				: return_value;

		for (const assignment of this.getDefaultAssignments()) {
			const { key, alias, return_value, f_params } = assignment;
			const _return_value = getValue(return_value, f_params);
			sanitised_args[alias || key] = args?.[key] || _return_value;
		}

		return sanitised_args;
	}
	getDefaultAssignments(): IOptParamMap[] {
		return [
			{
				key: "borderWidth",
				return_value: (original_args) =>
					original_args?.borderColour && "2px",
			},
			{ key: "colour", alias: "color", return_value: "#003845" },
			{
				key: "borderColour",
				alias: "borderColor",
				return_value: undefined,
			},
		];
	}
	observerCallback: ResizeObserverCallback = (entries) => {
		const entry = entries[0];
		if (entry) {
			const activeHeight = this.nudgeHeight(entry.contentRect.height);

			this.updateGuard(activeHeight);
			this.oscillations += 1;
		}
	};

	override componentWillUnmount() {
		this.content_observer && this.content_observer.disconnect();
	}

	override componentDidMount() {
		this.setState({ container_height: this.container_height });
		if (this.content_node) {
			this.content_observer = new ResizeObserver(this.observerCallback);

			this.content_observer.observe(this.content_node);
		}
	}
	override componentDidUpdate() {
		this.n_updates += 1;
		if (this.n_updates / Hexagon.max_osc < this.oscillations) {
			this._oscillations = undefined;
		}
	}

	construct() {
		const { color, borderColor, borderWidth } =
			this.santiseOptionalParameters();
		const _reformed_color =
			this.props._background === undefined ? color : "transparent";
		return {
			defs: !IS_CHROME
				? [
						<mask id="hexagon">
							<path
								d={this.hex_path}
								fill="white"
							/>
						</mask>,
				  ]
				: [],
			paths: [
				<path
					d={this.hex_path}
					mask={!IS_CHROME ? "url(#hexagon)" : ""}
					fill={_reformed_color}
					stroke={borderColor}
					strokeWidth={borderWidth}
				/>,
			],
		};
	}

	override render() {
		const {
			args,
			element = undefined,
			svgStyle = {},
			useVerticalAlignment = false,
			hex_shape_height_override = undefined,
			hex_shape_width_override = undefined,
			_background = undefined,
			...styleProps
		} = this.props;
		return (
			<HexagonContext value={this.hex_state}>
				<div style={containerStyle(styleProps)}>
					<ComposedHexSVG styles={svgStyle} />

					<CenterAlignedElement
						element={element}
						_background={_background}
						useVerticalAlignment={useVerticalAlignment}
						hex_shape_height_override={hex_shape_height_override}
						hex_shape_width_override={hex_shape_width_override}
					/>
				</div>
			</HexagonContext>
		);
	}

	protected setOrientation() {
		const ctor = this.constructor as typeof Hexagon;
		this.usePointedTop = this.props.usePointedTop ?? ctor.usePointedTop;
		this.hex_path = !this.usePointedTop
			? ctor.default_hex_path
			: ctor.alt_hex_path;
	}

	private updateGuard(height: number) {
		this.setState({ content_height: height });
	}
}

//
// ===== PointedTopHexagon =====
//

class PointedTopHexagon extends Hexagon {
	static override usePointedTop = true;
}

export { Hexagon, PointedTopHexagon };
