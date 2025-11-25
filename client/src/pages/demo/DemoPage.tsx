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
const CONFIG = {
	itemHeight: 10,
	itemWidth: 20,
	radius: 100,
	containerHeightRatio: 1,
};

const DEMO_STRINGS = [
	"T",
	"T",
	"T",
	"T",
	"T",
	"T",
	"T",
	"T",
	"T",
	"T",
	"T",
	// "T",
	// "T",
	// "T",
	// "T",
	// "T",
	// "T",
	// "T",
	// "T",
	// "T",
	// "T",
	// "T",
];

const getContainerStyle = (): React.CSSProperties => ({
	position: "fixed",
	width: "100%",
	height: "100%",

	// overflow: "hidden",
});

const container_style: React.CSSProperties = {
	// width: "100vw * 1vh/1vw",
	height: `calc(${100}%)`,
	// marginBottom: `${2 * CONFIG.itemHeight}%`,
	aspectRatio: "1",
	// marginLeft: "50vh",
};
const getItemStyle = (
	marginTop: number,
	marginLeft: number,
	isActive: boolean,
	opacity = 1
): React.CSSProperties => ({
	position: "absolute",

	height: `${CONFIG.itemHeight}%`,
	width: `${CONFIG.itemWidth}%`,
	display: "flex",
	marginTop: `${marginTop - CONFIG.itemHeight / 2}%`,
	// transform: `translateY(${marginTop - CONFIG.itemHeight / 2}%)`, // doesnt work since its now wrt to item height
	// marginBottom: `${-CONFIG.itemHeight / 2}%`,
	marginLeft: `calc(${marginLeft - CONFIG.itemWidth / 2}%)`,

	textAlign: "center",
	justifyContent: "center",
	alignItems: "center",
	// backgroundColor: `rgb(${color_index % 255},0,0)`,
	backgroundColor: "red",
	opacity: opacity,
	color: "#ffffff",
});

const getHelperLineStyle = (): React.CSSProperties => ({
	position: "absolute",
	left: 0,
	width: "100%",
	height: "1px",
	// background: "red",
	opacity: 0.3,
	pointerEvents: "none",
});

interface WheelItemProps {
	text: string;
	index: number;
}

interface ScrollWheelProps {
	items: string[];
}

const WheelItem: React.FC<WheelItemProps> = ({ text, index }) => {
	const [isActive, setIsActive] = useState(false);
	const { rotation } = useContext(ScrollWheelContext);
	const theta =
		2 *
		Math.asin(
			Math.sqrt(CONFIG.itemHeight ** 2 + CONFIG.itemWidth ** 2) /
				CONFIG.radius
		);
	// testing minimal distance
	const items_per_half_turn = Math.PI / theta;
	const total_items = 31;
	const total_turns = Math.floor(total_items / (items_per_half_turn * 2)) + 1;
	// const theta = Math.PI / items_per_half_turn;

	const current_angle = theta * -index + rotation;
	const z_score = current_angle % (2 * Math.PI * total_turns);
	const opacity_score =
		Math.floor(z_score / (2 * Math.PI)) === 0 ? Math.sin(z_score) ** 2 : 0;
	const factor = CONFIG.radius / 2;
	const marginLeft = 1 * Math.sin(current_angle) * factor; // ASSUME SQUARE FOR NOW
	const marginTop = (1 - 1 * Math.cos(current_angle)) * factor;
	const style = getItemStyle(marginTop, marginLeft, isActive, opacity_score);

	return (
		<div
			style={style}
			onClick={() => setIsActive(!isActive)}
		>
			{text}
		</div>
	);
};
const ScrollWheelContext = createContext({
	rotation: 0,
	total_items: 0,
});

const useScrollController = () => {
	const [rotation, setRotation] = useState(() => 0);
	const ref = useRef<HTMLDivElement>(null);

	useEffect(() => {
		const element = ref.current;
		if (!element) return;

		const handleWheel = (e: WheelEvent) => {
			// 1. Prevent the browser from scrolling the page
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
const ArcScrollWheel: React.FC<ScrollWheelProps> = ({ items }) => {
	const containerStyle = getContainerStyle();
	const helperLineStyle = getHelperLineStyle();
	const total_items = items.length;
	const { rotation, ref } = useScrollController();

	return (
		<ScrollWheelContext
			value={{
				rotation,
				total_items,
			}}
		>
			<div
				style={container_style}
				className="no-aos"
			>
				<div
					style={containerStyle}
					ref={ref}
				>
					{items.map((text, i) => {
						return (
							<WheelItem
								key={i}
								text={text}
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
const DemoWheelScroll = () => <ArcScrollWheel items={DEMO_STRINGS} />;
export { ArcScrollWheel, DemoWheelScroll };
const DemoContainer = () => {
	return (
		<div style={{ height: "800px", width: "100vh" }}>
			<ArcScrollWheel items={DEMO_STRINGS} />
		</div>
	);
};
export default DemoContainer;
