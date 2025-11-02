// src/pages/home-page/parts/key-partners/KeyPartners.tsx

import React from "react";

import gh from "../../../../assets/growthhouse_no_bg.png";
import hm from "../../../../assets/HewardMills.png";
import ms from "../../../../assets/ms.png";

import { CallingCard } from "../../../../components/callingcard/CallingCard";
import { SideBarTopOverlapStyle } from "../../../../components/callingcard/CallingCard.styles";
import { useDynamicLink } from "../../../../hooks/DynamicLink";
import { VOLUME_CONSTANT_SIZE } from "../../../../styles";
import { bgwhite } from "../../../../utils/defaultColours";
import { BoxedImage } from "../../../../utils/reactUtils";

const F1 = () => (
	<div
		style={{
			maxWidth: "30vw",
			fontSize: `calc(2*${VOLUME_CONSTANT_SIZE})`,
		}}
	>
		<BoxedImage
			image={gh}
			aspectRatio="1"
			width="100%"
		/>
		<div>
			<a
				href="https://thegrowthhouse.com/ai-programme/"
				{...useDynamicLink({
					useDefaultDecoration: true,
					StyleOverrides: {
						color: "inherit",
						fontSize: `calc(3*${VOLUME_CONSTANT_SIZE})`,
						fontWeight: "bold",
					},
				})}
			>
				The Growth House
			</a>
		</div>
		<p>
			The Growth House partners with AI Compatible to deliver prompt
			engineering training to some of the world’s biggest businesses,
			including Vodafone, Astra Zeneca, and Accenture Song. <br />
			<br />
			Click here to see reviews of the TGH AI program.
		</p>
	</div>
);

const F2 = () => (
	<div
		style={{
			maxWidth: "30vw",
			fontSize: `calc(2*${VOLUME_CONSTANT_SIZE})`,
		}}
	>
		<BoxedImage
			image={ms}
			aspectRatio="1"
			width="100%"
		/>
		<div>
			<a
				href="https://community.mindstone.com/events"
				{...useDynamicLink({
					useDefaultDecoration: true,
					StyleOverrides: {
						color: "inherit",
						fontSize: `calc(3*${VOLUME_CONSTANT_SIZE})`,
						fontWeight: "bold",
					},
				})}
			>
				Mindstone
			</a>
		</div>
		<p>
			Mindstone is the largest Practical AI Community for non-technical
			people in the world, with over 25,000 active members. Joe hosts
			their online meetups, co-organises their Cambridge Meetups,
			frequents the london events
		</p>
	</div>
);

const F3 = () => (
	<div
		style={{
			maxWidth: "30vw",
			fontSize: `calc(2*${VOLUME_CONSTANT_SIZE})`,
		}}
	>
		<BoxedImage
			image={hm}
			aspectRatio="1"
			width="100%"
		/>

		<div>
			<a
				href="https://www.hewardmills.com"
				{...useDynamicLink({
					useDefaultDecoration: true,
					StyleOverrides: {
						color: "inherit",
						fontSize: `calc(3*${VOLUME_CONSTANT_SIZE})`,
						fontWeight: "bold",
					},
				})}
			>
				Heward Mills
			</a>
		</div>
		<p>
			Data Protection Officers find themselves on the frontline of
			navigating AI adoption. The first question every org asks when
			adopting an AI tool is, ‘Can I trust it with sensitive information?’
			AI Compatible works with Heward Mills to help businesses navigate
			the challenges of data protection.
		</p>
	</div>
);

const KeyPartnersCallingCard: React.FC = () => {
	return (
		<>
			<CallingCard
				components={[<F1 />, <F2 />, <F3 />]}
				header={<h1>Key Partners</h1>}
				styleOverrides={{
					backgroundColor: bgwhite,
					...SideBarTopOverlapStyle,
					zIndex: 0,
				}}
				footer={
					<div
						className="aos-ignore"
						style={
							{
								width: "100%",
								height: "50px",
								background: bgwhite,
								zIndex: "100",
								["--borderrad"]: `calc(4*${VOLUME_CONSTANT_SIZE})`,

								borderRadius:
									"0 0 var(--borderrad) var(--borderrad)",
							} as React.CSSProperties
						}
					/>
				}
			/>
		</>
	);
};

export { KeyPartnersCallingCard };
