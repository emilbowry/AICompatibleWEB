import React, { useState } from "react";

interface CubeSliceProps {
	/**
	 * The position of the slice.
	 * Range: -5 to 5 (where -5 is center per your description, though mathematically 0 is usually center)
	 */
	theta: number;
}

export const CubeSlice: React.FC<CubeSliceProps> = ({ theta }) => {
	// 1. Calculate Opacity f(z)
	// Formula: sin(z * 10 * pi / 2)
	// Note: Math.sin returns -1 to 1. CSS Opacity expects 0 to 1.
	// We use Math.abs() to ensure the element doesn't vanish when sine is negative.
	const rawOpacity = Math.sin(theta * (Math.PI / (2 * 10)));
	console.log(theta, rawOpacity);
	// console.log(rawOpacity);

	const opacity = Math.abs(rawOpacity);
	const visibility = theta > 0 && theta <= 10 ? "visible" : "hidden";

	// 2. Define the Style
	const sliceStyle: React.CSSProperties = {
		width: "10vh",
		height: "10vh",
		backgroundColor: "#5dade2",
		filter: `opacity(${opacity})`,
		visibility: visibility,
		// transform: `translate(${
		// 	Math.sin(theta * (Math.PI / (2 * 10))) * 50
		// }px, (${Math.cos(theta * 5 * (Math.PI / (2 * 10)))}vh)`,
		transform: `translate3d(${
			Math.sin(theta * (Math.PI / (2 * 10))) * 10
		}vh, ${Math.cos(theta * (Math.PI / (2 * 10))) * 10}vh, ${theta}vh)`,
		position: "relative",
		display: "flex",
		alignItems: "center",
		justifyContent: "center",
		border: "1px solid rgba(255,255,255,0.5)", // Optional: to see the outline when opacity is 0
		fontSize: "0.8rem",
		color: "white",
		willChange: "opacity, transform", // Performance optimization
	};

	return (
		<div style={sliceStyle}>
			{/* Optional: Display Z value for debugging */}
			{theta.toFixed(1)}
		</div>
	);
};

export const ExperimentScene = () => {
	const [theta, setTheta] = useState<number>(0);

	// Parent Container Style
	const sceneStyle: React.CSSProperties = {
		width: "100vw",
		height: "100vh",
		display: "flex",
		flexDirection: "column",
		alignItems: "center",
		justifyContent: "center",
		backgroundColor: "#222",

		// transformStyle: "preserve-3d",
	};

	return (
		<div
			style={sceneStyle}
			className="no-aos"
		>
			<CubeSlice theta={theta} />

			<div style={{ marginTop: "20vh", color: "white", zIndex: 0 }}>
				<label>Z Value: {theta}</label>
				<br />
				<input
					type="range"
					min="-20"
					max="20"
					step="1"
					value={theta}
					onChange={(e) => setTheta(parseFloat(e.target.value))}
					style={{ width: "300px" }}
				/>
				<p
					style={{
						maxWidth: "300px",
						fontSize: "0.8em",
						color: "#aaa",
					}}
				>
					Slide to move the slice through the "cube". <br />
					Notice how opacity flashes due to the Sine function.
				</p>
			</div>
		</div>
	);
};
