// src/pages/homepage/parts/AboutUS.tsx

import React from "react";

import aicompwork from "../../../../assets/aicwork.jpg";
import {
	bulb,
	bullseye,
	pencil,
} from "../../../../components/callingcard/graphics";

import { SideBarCallingCard } from "../../../../components/callingcard/CallingCard";
import { SideBarBottomOverlapStyle } from "../../../../components/callingcard/CallingCard.styles";
import { PointedtopHexagonFeatureGrid } from "../../../../components/hexagons/hexagon-grid/pointed-hexagon-grid/PointedHexagonRow";
import { partners } from "../../../../components/partnership-bar/Partner";
import { PartnershipWall } from "../../../../components/partnership-bar/PartnershipWall";
import { IS_CHROME } from "../../../../hooks/BrowserDependant";
import { VOLUME_CONSTANT_SIZE } from "../../../../styles";
import { bgwhite, white } from "../../../../utils/defaultColours";
import { BoxedImage, getImageEl } from "../../../../utils/reactUtils";
import {
	footerStyle,
	hStyle,
	imageStyling,
	titleStyle,
} from "./AboutUs.styles";
const head = (
	<h2
		className="aos-ignore"
		style={{ fontSize: `calc(3*${VOLUME_CONSTANT_SIZE})` }}
	>
		About Us
	</h2>
);

const Foot = () => (
	<p style={{ fontSize: `calc(2*${VOLUME_CONSTANT_SIZE})` }}>
		At AI Compatible, we believe not everyone needs to be an AI expert but
		everyone should be AI compatible. That means being alert to the
		opportunities and the risks: we help businesses navigate both, with
		tailored sessions giving you the right tools, skills, and literacy.
		<br />
		<br />
		We strive for a world where AI goes right, and people are ready for it.
	</p>
);

const large_partners = {
	...partners,
	size: "Large",
};

const wGif = (
	<div style={{ display: "flex", maxWidth: "100%" }}>
		{getImageEl(aicompwork, {
			width: "100%",
			borderRadius: "18px",
		})}
	</div>
);
const aboutUsFeatureCallouts = [
	[
		<BoxedImage
			image={bulb}
			width="25%"
			aspectRatio="1"
			imageStyling={{
				...imageStyling,
			}}
		/>,
		<div style={titleStyle}>Consultancy</div>,
		<div style={footerStyle}>
			Scoping <br /> Matching Tasks to Tools
		</div>,
	],
	[
		<BoxedImage
			image={bullseye}
			width="25%"
			aspectRatio="1"
			imageStyling={{
				...imageStyling,
			}}
		/>,
		<div style={titleStyle}>Training</div>,
		<div style={footerStyle}>
			Prompt Engineering
			<br />
			AI Ethics Literacy
		</div>,
	],
	[
		<BoxedImage
			image={pencil}
			width="25%"
			aspectRatio="1"
			imageStyling={{
				...imageStyling,
			}}
			wrapperStyling={{
				position: "relative",
				top: 0,
				display: "block",
			}}
		/>,
		<div style={titleStyle}>Policy</div>,
		<div style={footerStyle}>
			Drafting AI
			<br />
			Policy Reviewing AI Policy
		</div>,
	],
];

const bg2 = `linear-gradient(to right, rgb(12 192 223 / 10%), rgb(255 222 89 / 10%)),
		 ${white} fixed`;
const AboutUsCallingCard: React.FC = () => {
	return (
		<>
			<SideBarCallingCard
				components={[wGif]}
				header={
					<div
						style={{
							width: "100%",
							minHeight: "30vh",
							display: "flex",
							flexDirection: "column",
							justifyContent: "center",
							padding: "2%",
						}}
					>
						<PartnershipWall
							{...(large_partners as any)}
							index={-1}
						/>
					</div>
				}
				sideBar={{ components: [<Foot />], header: head }}
				footer={
					<PointedtopHexagonFeatureGrid
						FeatureCallouts={aboutUsFeatureCallouts}
						useVerticalAlignment={true}
						hexagon_args={hStyle}
						theme={-1}
						hex_shape_height_override={IS_CHROME && "10%"}
						_background={bg2}
					/>
				}
				styleOverrides={{
					backgroundColor: bgwhite,
					...SideBarBottomOverlapStyle,
					background: bg2,
				}}
			/>
		</>
	);
};

export { AboutUsCallingCard };
