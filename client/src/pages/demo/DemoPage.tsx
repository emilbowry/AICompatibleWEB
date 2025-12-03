// client/src/pages/demo/DemoPage.tsx

// client/src/pages/demo/DemoPage.tsx

import React, {
	createContext,
	useContext,
	useEffect,
	useRef,
	useState,
} from "react";
// import { DocumentAnalysisViewer } from "../dpo-tool/css_dual";
import { DocumentAnalysisViewer } from "../dpo-tool/CSS_Markdown/CSSMarkdown";
import { ExperimentScene } from "./DemoCube";

// import { DocumentAnalysisViewer } from "../dpo-tool/dual";
export const CONFIG = {
	itemHeight: 10,
	itemWidth: 15,
	radius: 70,
	containerHeightRatio: 1,
};

const TestFC = () => <>T</>;
const DemoComponents = [
	<TestFC />,
	<TestFC />,
	<TestFC />,
	<TestFC />,
	<TestFC />,
	<TestFC />,
	<TestFC />,
	<TestFC />,
];

const getContainerStyle = (): React.CSSProperties => ({
	position: "fixed",
	width: "100%",
	overflow: "visible",

	height: "100%",
});

const container_style: React.CSSProperties = {
	height: `calc(${100}%)`,
	aspectRatio: "1",
	overflow: "visible",
};
const getItemStyle = (
	marginTop: number,
	marginLeft: number,
	z_score: number,

	opacity_function: (z_score: number) => number
): React.CSSProperties => ({
	position: "absolute",

	height: `${CONFIG.itemHeight}vh`,
	width: `${CONFIG.itemWidth}vh`,
	display: "flex",
	marginTop: `${marginTop}vh`,
	// transform: `translateY(${marginTop - CONFIG.itemHeight / 2}%)`, // doesnt work since its now wrt to item height
	marginLeft: `calc(${marginLeft - CONFIG.itemWidth / 2}vh)`,

	textAlign: "center",
	justifyContent: "center",
	alignItems: "center",

	opacity: opacity_function(z_score),
	visibility: opacity_function(z_score) > 0 ? "visible" : "hidden",
	// background: "red",
	color: "#ffffff",
	zIndex: 200 + z_score,
	overflow: "visible",
});

const getHelperLineStyle = (): React.CSSProperties => ({
	position: "absolute",
	left: 0,
	width: "100%",
	height: "1px",
	// background: "red",
	opacity: 0.3,
});

interface WheelItemProps {
	Component: React.ReactNode;
	index: number;
}

interface ScrollWheelProps {
	items: React.ReactNode[];
}
export const opacityFunc = (z_score: number) =>
	Math.floor(z_score / (2 * Math.PI)) === 0 ? Math.sin(z_score) : 0;
const WheelItem: React.FC<WheelItemProps> = ({ Component, index }) => {
	const { rotation, opacity_function, total_items } =
		useContext(ScrollWheelContext);
	const theta =
		2 *
		Math.asin(
			Math.sqrt(CONFIG.itemHeight ** 2 + CONFIG.itemWidth ** 2) /
				CONFIG.radius
		);
	// testing minimal distance
	const items_per_half_turn = Math.PI / theta;
	// const total_items = 31;
	const total_turns = Math.floor(total_items / (items_per_half_turn * 2)) + 1;
	// const theta = Math.PI / items_per_half_turn;

	const current_angle = theta * -index + rotation;
	const z_score = current_angle % (2 * Math.PI * total_turns);
	// const opacity_score =
	// 	Math.floor(z_score / (2 * Math.PI)) === 0 ? Math.sin(z_score) : 0;
	const factor = CONFIG.radius / 2;
	const marginLeft = 1 * Math.sin(current_angle) * factor; // ASSUME SQUARE FOR NOW
	const marginTop = (1 - 1 * Math.cos(current_angle)) * factor;
	const style = getItemStyle(
		marginTop,
		marginLeft,
		z_score,
		opacity_function
	);

	return (
		<div
			style={style}
			// onClick={() => setIsActive(!isActive)}
		>
			<div
				style={{ height: "unset", width: "unset", overflow: "visible" }}
			>
				{Component}
			</div>
		</div>
	);
};
const ScrollWheelContext = createContext({
	rotation: 0,
	total_items: 0,
	opacity_function: opacityFunc,
});

const useScrollController = (initial_rotation = 0) => {
	const [rotation, setRotation] = useState(
		() => (initial_rotation * Math.PI) / 180
	);
	const ref = useRef<HTMLDivElement>(null);

	useEffect(() => {
		const element = ref.current;
		if (!element) return;

		const handleWheel = (e: WheelEvent) => {
			e.preventDefault();
			const innerHeight = window.innerHeight;
			const delta_y = e.deltaY;
			const tangent_distance = innerHeight / 2 / 2;

			const delta_theta = Math.atan(delta_y / tangent_distance);

			setRotation((prev) => prev + delta_theta);
		};

		element.addEventListener("wheel", handleWheel, { passive: false });

		return () => {
			element.removeEventListener("wheel", handleWheel);
		};
	}, []);

	return { rotation, ref };
};

interface ScrollWheelProps {
	items: React.ReactNode[];
	initial_rotation?: number;
	opacity_function?: (z_score: number) => number;
}
const ArcScrollWheel: React.FC<ScrollWheelProps> = ({
	items,
	initial_rotation = 0,
	opacity_function = opacityFunc,
}) => {
	const containerStyle = getContainerStyle();
	const helperLineStyle = getHelperLineStyle();
	const total_items = items.length;
	const { rotation, ref } = useScrollController(initial_rotation);

	return (
		<ScrollWheelContext
			value={{
				rotation,
				total_items,
				opacity_function,
			}}
		>
			<div
				style={container_style}
				className="no-aos"
				onMouseLeave={() => console.log("left")}
			>
				<div
					style={containerStyle}
					ref={ref}
				>
					{items.map((Comp, i) => {
						return (
							<WheelItem
								key={i}
								Component={Comp}
								index={i}
							/>
						);
					})}

					<div style={helperLineStyle} />
				</div>
			</div>
		</ScrollWheelContext>
	);
};
const DemoWheelScroll = () => <ArcScrollWheel items={DemoComponents} />;
export { ArcScrollWheel, DemoWheelScroll };
const DemoContainer = () => {
	return (
		<div
			style={{
				height: `calc(${CONFIG.radius + CONFIG.itemHeight}vh)`,
				width: `calc(${CONFIG.radius / 2 + CONFIG.itemWidth / 2}vh)`,
			}}
		>
			<ArcScrollWheel items={DemoComponents} />
		</div>
	);
};
export default DemoContainer;
