// src/pages/our-services-page/OurServices.tsx

import React from "react";
import { SideBarCallingCard } from "../../components/callingcard/CallingCard";
import { bulb, bullseye, pencil } from "../../components/callingcard/graphics";
import { PointedtopHexagonFeatureGrid } from "../../components/hexagons/hexagon-grid/pointed-hexagon-grid/PointedHexagonRow";
import { Page } from "../../features/page/Page";
import { bgwhite } from "../../utils/defaultColours";
import { BoxedImage } from "../../utils/reactUtils";
import {
	hStyle,
	imageStyling,
	titleStyle,
} from "../home-page/parts/about-us/AboutUs.styles";

const Services: React.FC<{ title: string; services: string[] }> = ({
	title,
	services,
}) => {
	return (
		<div style={ServicesContainerStyle}>
			<h3 style={ServicesTitleStyle}>{title}</h3>
			<div>
				<ol>
					{services.map((service, index) => (
						<li
							key={index}
							style={ServiceStyle}
						>
							{service}
						</li>
					))}
				</ol>
			</div>
		</div>
	);
};

const cserv = {
	title: "Our Consultancy Services:",
	services: [
		"For helping you find your business’ place in the transforming world of work - Consultancy – 1-to-1 - £200/hour",
		"To make the AI Hype real for you – Tasks-to-tools – matching client tasks with real out-the-box AI tools",
		"To find the insights that your business strategy hinges on - Research Project. E.g, estimating climate impact of AI Adoption in our sector.",
		"To facilitate critical conversations – moderating debates and unconferences" /** @ask what is uncomferences */,
		"To align ethics into a codified policy – AI policy drafting and review ",
	],
};
const tserv = {
	title: "Our Training Services:",
	services: [
		"To stimulate your teams into habits of lifelong learning in AI – Practical AI Ethics Workshops ",
		"To empower your people with competence and confidence – Interactive prompt engineering workshops ",
		"To educate your people on the ‘whether’ and the ‘why’ of AI adoption – Practical AI Ethics Talk ",
		"Inspire the art of the possible through – Practical AI Talks and Live demos" /** @ask what is uncomferences */,
	],
};

const ourServicesFeatureCallouts = [
	[
		<BoxedImage
			image={bulb}
			width="30%"
			aspectRatio="1"
			imageStyling={imageStyling}
		/>,
		<div style={titleStyle}>Our Work</div>,
	],
	[
		<BoxedImage
			image={bullseye}
			width="30%"
			aspectRatio="1"
			imageStyling={imageStyling}
		/>,
		<div style={titleStyle}>Our Vision</div>,
	],

	[
		<BoxedImage
			image={pencil}
			width="30%"
			aspectRatio="1"
			imageStyling={imageStyling}
		/>,
		<div style={titleStyle}>Our Work</div>,
	],
];

import { SideBarBottomOverlapStyle } from "../../components/callingcard/CallingCard.styles";
// import { IS_CHROME } from "../../hooks/BrowserDependant";
import { IS_CHROME } from "../../hooks/BrowserDependant";
import {
	ServicesContainerStyle,
	ServicesSideBarStyle,
	ServicesTitleStyle,
	ServiceStyle,
} from "./OurServices.styles";
import { PiChart } from "./pi_chart";
const ServicesSideBar: React.FC = () => {
	return (
		<div>
			<div style={ServicesSideBarStyle}>
				<span style={{ color: "red", fontWeight: "bolder" }}>
					Probably needs an introduction <br />
				</span>
				Source: BCG Build for the Future 2024 Global Study (merged with
				DAI)
			</div>
			<div>
				<PiChart />
			</div>
		</div>
	);
};

const ourServices: React.FC = () => (
	<>
		<SideBarCallingCard
			components={[<Services {...cserv} />, <Services {...tserv} />]}
			sideBar={{
				header: <h2>Our Services</h2>,
				components: [<ServicesSideBar />],
			}}
			footer={
				<PointedtopHexagonFeatureGrid
					FeatureCallouts={ourServicesFeatureCallouts}
					hexagon_args={hStyle}
					useVerticalAlignment={true}
					hex_shape_height_override={IS_CHROME && "10%"}
				/>
			}
			styleOverrides={{
				backgroundColor: bgwhite,
				...SideBarBottomOverlapStyle,
				zIndex: -5,
			}}
		/>
	</>
);

const OurServices = () => (
	<Page
		page={ourServices}
		bg={true}
	/>
);
export default OurServices;
