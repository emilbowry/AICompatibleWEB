// src/pages/the-journey-page/TheJourney.tsx

import React from "react";
import { Hexagon } from "../../components/hexagons/Hexagons";
import { ImageHexagon } from "../../components/hexagons/ImageHexagon";
import { HexagonGrid } from "../../components/hexagons/hexagon-grid/honeycomb/HexagonRow";
import { Page } from "../../features/page/Page";

import bw1 from "../../assets/bw1.jpg";
import bw2 from "../../assets/bw2.jpg";
import bw3 from "../../assets/bw3.jpg";
import { bulb, bullseye, pencil } from "../../components/callingcard/graphics";
import { IS_CHROME } from "../../hooks/BrowserDependant";
import { useNarrowLayout } from "../../hooks/WindowSizeDependent";
import { generateGradient } from "../../styles";
import { bgwhite } from "../../utils/defaultColours";
import { BoxedImage } from "../../utils/reactUtils";
import {
	BlurBackgroundStyle,
	IconHexStyle,
	RowContentStyle,
	RowHeaderStyle,
} from "./TheJourney.styles";

const TimelineData = [
	{
		date: "NOV 2022",
		content:
			"ChatGPT 3.5 is released - The 'ChatGPT' moment. Prompt Engineering goes mainstream ",
		image: bw3,
	},
	{
		date: "MAR 2023",
		content: "ChatGPT 4 is released",
	},
	{
		date: "DEC 2023",
		content:
			"AI Compatible  (AIC) is founded and collates 2023s discoveries in prompt engineering into a methodology, to help people use AI effectively and ethically",
		icon: bulb,
	},
	{
		date: "JAN 2024",
		content:
			"AIC runs its first series of prompt engineering training workshops with live clients, using the new methodology. Initially delivered through AIC first partner, The Growth House who offer leadership and teamship corporate training",
		// icon: bullseye,
	},
	{
		date: "MARCH 2024",
		content:
			"The EU AI act is passed - there's questions around how suitable it is for generative AI. Joe Fennell co-led the 'SafeNet' project for improving online safety and AI literacy among young people in the Balkans, founded by the UNMIK",
	},
	{
		date: "JUL 2024",
		content:
			"NotebookLM is released, everyone loves it, go try it now if you haven't",
		image: bw1,
		icon: bullseye,
	},
	{
		date: "SEP 2024",
		content:
			"Open AI's release of o1 'strawberry', first of the 'reasoning model' generation of generative AI.",
	},
	{
		date: "OCT 2024",
		content:
			"O3 gets 85% accuracy on the ARC 1 benchmark - this is the going to the moon moment for Foundation models, ARC 1 was THE benchmark to beat. The AI Compatible team grows alongside our roster of partners",
	},
	{
		date: "JAN 2025",
		content:
			" Deepseek R1 matches Open AI's o1 Benchmark performance. Working closely with Heward Mills data protection officers we became an advisor and partner. We add Policy assistance and consultancy to the services we offer.",
		icon: pencil,
		image: bw2,
	},
	{
		date: "APRIL 2025",
		content:
			"Open AI O3 high gets 20% on 'Humanity's Last Exam', a compilation of problems that specialised human experts find particularly hard",
	},
];

const getThirdHex = (index: number) => {
	let thirdHexagon = (
		<Hexagon
			args={{
				colour: "transparent",
			}}
		/>
	);

	const _icon = TimelineData[index + 1]?.icon;
	const _image = TimelineData[index]?.image;
	if (_icon) {
		thirdHexagon = (
			<Hexagon
				args={{
					colour: "transparent",
				}}
				opacity={1}
				element={
					<div style={IconHexStyle}>
						<BoxedImage
							image={_icon}
							width="90%"
							aspectRatio="1"
							imageStyling={{ margin: "auto" }}
						/>
					</div>
				}
			/>
		);
	} else if (_image) {
		thirdHexagon = <ImageHexagon img={_image} />;
	}
	return thirdHexagon;
};
const RowHeader: React.FC<{
	children?: React.ReactNode;
	styleoverrides?: React.CSSProperties;
}> = ({ children, styleoverrides }) => (
	<h2 style={{ ...RowHeaderStyle, ...styleoverrides }}>{children}</h2>
);

const RowContent: React.FC<{ children?: React.ReactNode }> = ({ children }) => (
	<p style={RowContentStyle}>{children}</p>
);

const getRows = (isNarrow = false) => {
	const colours = generateGradient(TimelineData.length).reverse();

	return TimelineData.map((item, i) => {
		const img = TimelineData[i]?.image;
		const icon = TimelineData[i + 1]?.icon;

		// TimelineData[i + 1]?.icon || TimelineData[i]?.image || undefined;

		let baseRowElements = [
			img && isNarrow ? (
				<ImageHexagon
					img={img}
					element={[
						<RowHeader styleoverrides={{ color: bgwhite }}>
							{item.date}
						</RowHeader>,
					]}
				/>
			) : icon && isNarrow ? (
				<Hexagon
					args={{ colour: "transparent" }}
					element={[
						<RowHeader styleoverrides={{ color: bgwhite }}>
							{item.date}
						</RowHeader>,
						<div style={IconHexStyle}>
							<BoxedImage
								image={icon}
								width="90%"
								aspectRatio="1"
								imageStyling={{
									margin: "auto",
								}}
							/>
						</div>,
					]}
					opacity={1}
					hex_shape_height_override={IS_CHROME && "50%"}
					hex_shape_width_override={IS_CHROME && "25%"}
					useVerticalAlignment={!isNarrow}
				/>
			) : isNarrow ? (
				<Hexagon
					args={{ colour: bgwhite }}
					element={[<RowHeader>{item.date}</RowHeader>]}
					opacity={1}
					useVerticalAlignment={!isNarrow}
				/>
			) : (
				<Hexagon
					args={{ colour: bgwhite }}
					element={[
						<RowHeader>{item.date}</RowHeader>,
						<RowContent>{item.content}</RowContent>,
					]}
					opacity={1}
					useVerticalAlignment={!isNarrow}
				/>
			),

			<Hexagon args={{ colour: colours[i] }} />,
			isNarrow ? (
				<Hexagon
					args={{ colour: bgwhite }}
					element={[<RowContent>{item.content}</RowContent>]}
					opacity={1}
					useVerticalAlignment={!isNarrow}
				/>
			) : (
				getThirdHex(i)
			),
		];
		baseRowElements = isNarrow
			? [baseRowElements[0], baseRowElements[2]]
			: baseRowElements;
		baseRowElements =
			i % 2 === 0 || isNarrow
				? baseRowElements
				: baseRowElements.reverse();

		return {
			elements: baseRowElements,
		};
	});
};
const theJourneyPage: React.FC = () => {
	const isNarrow = useNarrowLayout();
	const relative_spacing = 10;
	const absolute_spacing = 0;

	return (
		<div
			style={{
				margin: "5% 0",
			}}
		>
			<div style={BlurBackgroundStyle} />
			<HexagonGrid
				rows={getRows(isNarrow) as any}
				relative_spacing={relative_spacing}
				absolute_spacing={absolute_spacing}
				upper_first={isNarrow}
				class_name="aos-ignore"
				// containerStyle={{overflow:"visible"}}
			/>
		</div>
	);
};

const TheJourneyPage = () => <Page page={theJourneyPage} />;

export default TheJourneyPage;
