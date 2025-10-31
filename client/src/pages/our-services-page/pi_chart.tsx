// src/pages/our-services-page/pi_chart.tsx

import React, { useState } from "react";
import { TINT_OPACITY } from "./OurServices.consts";

interface PieSliceData {
	name: string;
	d: string;
	fill: string;
	hoverFill: string;
	text: {
		value: string;
		x: number;
		y: number;
		fontSize: number;
		fontWeight?: string;
	}[];
}

interface PiChartProps {
	sliceData?: PieSliceData[];
	onSliceHover?: (sliceName: string | null) => void;
	onSliceClick?: (sliceName: string) => void;
}

const slicesData: PieSliceData[] = [
	{
		name: "Operations",
		d: "M0 -288 A288 288 0 0 1 268.8711628311941 -103.20996946904644 L134.43558141559706 -51.60498473452322 A144 144 0 0 0 0 -144 Z",
		fill: "#0caba8",
		hoverFill: "#0fabab",
		text: [
			{
				value: "Operations",
				x: 202.19624085013794,
				y: -301.57135966139884,
				fontSize: 26.01,
			},
			{
				value: "19.2%",
				x: 202.19624085013794,
				y: -268.76085233975897,
				fontSize: 26.01,
			},
		],
	},

	{
		name: "Sales and Marketing",
		d: "M268.8711628311941 -103.20996946904644 A288 288 0 0 1 223.8180368996076 181.24427262235324 L111.9090184498038 90.62213631117662 A144 144 0 0 0 134.43558141559706 -51.60498473452322 Z",
		fill: "#ffcc00",
		hoverFill: "#ffdd33",
		text: [
			{
				value: "Sales and Marketing",
				x: 418.5808225070489,
				y: 58.78206064254306,
				fontSize: 26.01,
			},
			{
				value: "16.7%",
				x: 418.5808225070489,
				y: 91.87381796418299,
				fontSize: 26.01,
			},
		],
	},

	{
		name: "R&D",
		d: "M223.8180368996076 181.24427262235324 A288 288 0 0 1 59.87856695551456 281.70650901133604 L29.93928347775728 140.85325450566802 A144 144 0 0 0 111.9090184498038 90.62213631117662 Z",
		fill: "#7dcea1",
		hoverFill: "#8ddfb1",
		text: [
			{
				value: "R&D",
				x: 176.8067994587414,
				y: 283.023470331769,
				fontSize: 26.01,
			},
			{
				value: "10.8%",
				x: 176.80679945874138,
				y: 311.31835265340885,
				fontSize: 26.01,
			},
		],
	},

	{
		name: "Support functions",
		d: "M59.87856695551456 281.70650901133604 A288 288 0 0 1 -281.706509011336 -59.87856695551472 L-140.853254505668 -29.93928347775736 A144 144 0 0 0 29.93928347775728 140.85325450566802 Z",
		fill: "#bdd67e",
		hoverFill: "#cde78e",
		text: [
			{
				value: "Support functions",
				x: -274.74650943367516,
				y: 267.38813077285516,
				fontSize: 26.01,
			},
			{
				value: "31.7%",
				x: -274.7465094336751,
				y: 300.1673880944951,
				fontSize: 26.01,
			},
		],
	},

	{
		name: "Customer Service",
		d: "M-281.706509011336 -59.87856695551472 A288 288 0 0 1 -192.70961463135114 -214.02570973748956 L-96.35480731567557 -107.01285486874478 A144 144 0 0 0 -140.853254505668 -29.93928347775736 Z",
		fill: "#5e3967",
		hoverFill: "#6e4977",
		text: [
			{
				value: "Customer Service",
				x: -347.76254484759073,
				y: -205.896990042646,
				fontSize: 26.01,
			},
			{
				value: "10%",
				x: -347.76254484759073,
				y: -177.60210772100618,
				fontSize: 26.01,
			},
		],
	},

	{
		name: "IT",
		d: "M-192.70961463135114 -214.02570973748956 A288 288 0 0 1 -103.20996946904638 -268.8711628311941 L-51.60498473452319 -134.43558141559706 A144 144 0 0 0 -96.35480731567557 -107.01285486874478 Z",
		fill: "#753c59",
		hoverFill: "#854c69",
		text: [
			{
				value: "IT",
				x: -175.36951837316587,
				y: -291.65261058903417,
				fontSize: 26.01,
			},
			{
				value: "5.8%",
				x: -175.36951837316593,
				y: -263.6546032673942,
				fontSize: 26.01,
			},
		],
	},

	{
		name: "Procurement",
		d: "M-103.20996946904638 -268.8711628311941 A288 288 0 0 1 -0.028799999952003417 -287.99999856 L-0.014399999976001708 -143.99999928 A144 144 0 0 0 -51.60498473452319 -134.43558141559706 Z",
		fill: "#955861",
		hoverFill: "#a56871",
		text: [
			{
				value: "Procurement",
				x: -60.102709852173334,
				y: -329.9092068913421,
				fontSize: 26.01,
			},
			{
				value: "5.8%",
				x: -60.102709852173234,
				y: -301.61432456970215,
				fontSize: 26.01,
			},
		],
	},
];
const PiChart: React.FC<PiChartProps> = ({
	sliceData = slicesData,
	onSliceClick,
}) => {
	const [hoveredSlice, setHoveredSlice] = useState<string | null>(null);

	const handleMouseEnter = (sliceName: string) => setHoveredSlice(sliceName);
	const handleMouseLeave = () => setHoveredSlice(null);
	const handleClick = (sliceName: string) => onSliceClick?.(sliceName);

	return (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			viewBox="0 0 999.7168461936368 667.5952961081327"
			style={{
				width: "100%",
				height: "auto",
				overflow: "visible",
			}}
		>
			<g style={{ transform: "scale(1) translate(0px)" }}>
				<rect
					width="999.7168461936368"
					height="667.5952961081327"
					fill="none"
				/>
				<g transform="translate(455.797747300237, 351.154553386957)">
					{sliceData.map((slice) => {
						const isHovered = hoveredSlice === slice.name;

						return (
							<g
								key={slice.name}
								onMouseEnter={() =>
									handleMouseEnter(slice.name)
								}
								onMouseLeave={handleMouseLeave}
								onClick={() => handleClick(slice.name)}
								style={{
									transform: isHovered
										? "scale(1.03)"
										: "scale(1)",
									transition:
										"transform 0.15s ease-out, opacity 0.15s ease-out",
									opacity:
										hoveredSlice !== null && !isHovered
											? TINT_OPACITY
											: 1,
								}}
							>
								<path
									d={slice.d}
									fill={
										isHovered ? slice.hoverFill : slice.fill
									}
								></path>

								{slice.text.map((textItem, index) => (
									<text
										key={`${slice.name}-text-${index}`}
										textAnchor="middle"
										dominantBaseline="alphabetic"
										fill="#0caba8"
										textRendering="geometricPrecision"
										fontWeight={isHovered ? "800" : "700"}
										fontSize={textItem.fontSize}
										fontStyle="normal"
										x={textItem.x}
										y={textItem.y}
										style={{
											transition:
												"font-weight 0.15s ease-out",
										}}
									>
										{textItem.value}
									</text>
								))}
							</g>
						);
					})}
				</g>
			</g>
		</svg>
	);
};

export { PiChart };
