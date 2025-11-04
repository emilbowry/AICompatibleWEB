// src/pages/home-page/parts/ourteam/OurTeam.tsx

import React from "react";
import will from "../../../../assets/dude1.jpg";
import ben from "../../../../assets/dude2.jpg";
import omar from "../../../../assets/dude3.jpg";
import joefennelhs from "../../../../assets/joeheadshot.png";
import miranda from "../../../../assets/miranda.jpg";
import { CallingCard } from "../../../../components/callingcard/CallingCard";
import { ImageHexagon } from "../../../../components/hexagons/ImageHexagon";
import { useDynamicLink } from "../../../../hooks/DynamicLink";
import { useBrowserScale } from "../../../../hooks/WindowSizeDependent";
import { border_gradient, getTheme } from "../../../../styles";
import { bgwhite } from "../../../../utils/defaultColours";
import {
	OurTeamContainerStyle,
	PersonaHeadshotStyle,
	personaTextStyle,
	personaWrapperStyle,
} from "./OurTeam.styles";
import { IPersona } from "./OurTeam.types";

const teamMembers: IPersona[] = [
	{
		image: joefennelhs,
		name: "Joe Fennell",
		title: "Founder",
		email: "joe@aicompatible.co.uk",
		body: "Since 2019, Joe has been grappling with the question of  how to adjust to a world being transformed by AI. He spent 4 years tackling this question at the University of Cambridge, and the last 2 years tackling it with some of the world’s biggest businesses, including Astra Zeneca, Vodafone, Accenture Song and more.",
	},
	{
		image: miranda,
		name: "Miranda Read",
		title: " COO & Business Development Lead",
		email: "miranda@aicompatible.co.uk",
		body: "Miranda has 4 years of experience client-facing roles in Cybersecurity and Tech. Wearing multiple hats under the umbrella of Business Development, she has been instrumental in AI Compatibles product development, marketing strategy, operations and growth vision.",
	},
];
const prompt_engineers: IPersona[] = [
	{
		image: omar,
		name: "Omer Bilgin",
		body: "Omer is an AI ethics, policy, and governance researcher. His unique expertise is grounded in both his academic training in Practical Ethics at the University of Oxford, and his professional roles as Co-founder and Chief Ethics & Research Officer at an AI startup called deliberAIde and as a Technology & Data Ethics Advisor for Suffrago.",
	},
	{
		image: ben,
		name: "Benjamin Raho ",
		body: "Benjamin is an economics graduate and EPM sales specialist, helping UK mid-market businesses optimize financial planning and analytics through Oracle NetSuite’s AI-powered tools. Bridging enterprise software and applied AI, Benjamin brings a practical, forward-thinking approach",
	},
	{
		image: will,
		name: "William Swain ",
		body: "Will has 10 years of experience as a Data and Reporting Analyst for Nintendo, PwC and Everfox. His expertise is in automation so founded Surrey Data Solutions (SDS), a specialist consultancy delivering practical, high- impact solutions in business intelligence, data analytics, process automation, and robotic process automation (RPA).",
	},
];

const MailTo: React.FC<{ email: string; theme: any }> = ({ email, theme }) => (
	<div>
		<a
			href={`mailto:${email}`}
			{...useDynamicLink({
				useDefaultDecoration: true,
				style_args: ["3px"],
				StyleOverrides: {
					color: theme.primaryColor,
				},
			})}
		>
			{email}
		</a>
	</div>
);
const PHeader: React.FC<IPersona & { theme: ReturnType<typeof getTheme> }> = ({
	name,
	title,
	email,
	theme,
}) => (
	<div style={{ color: theme.tertiaryColor }}>
		<h3>
			<span style={{ fontWeight: "bold" }}>{name}</span>
			<span style={{ fontWeight: "normal" }}>
				{title ? ` - ${title}` : null}
			</span>
		</h3>
		{email ? (
			<MailTo
				email={email}
				theme={theme}
			/>
		) : (
			<div />
		)}
	</div>
);

const PBody: React.FC<IPersona & { theme: ReturnType<typeof getTheme> }> = ({
	body,
	theme,
}) => (
	<div style={{ color: theme.secondaryColor }}>
		<p>{body}</p>
	</div>
);

const PText: React.FC<
	IPersona & {
		theme: ReturnType<typeof getTheme>;
		children?: React.ReactNode;
	}
> = (props) => (
	<div style={{}}>
		<PHeader {...props} />
		<PBody {...props} />
	</div>
);

const Persona: React.FC<IPersona> = (props) => {
	const scale = useBrowserScale();
	const {
		image,

		index = 2,
	} = props;

	let theme = getTheme(+!!(index === 0) || +!(index % 2 === 0));

	return (
		<div style={personaWrapperStyle}>
			<div style={PersonaHeadshotStyle}>
				<ImageHexagon img={image} />
			</div>
			<div
				style={{
					backgroundColor: theme.backgroundColor,
					...personaTextStyle(scale),
				}}
			>
				<PText
					{...props}
					theme={theme}
				/>
			</div>
		</div>
	);
};

const OurTeam: React.FC = () => (
	<div style={OurTeamContainerStyle}>
		<div style={{}}>
			<h1 style={{ color: bgwhite, marginLeft: "2vw" }}>Our Team:</h1>
		</div>
		{teamMembers.map((member, arrayIndex) => {
			const personaIndex = member.title ? 1 : 2;

			return (
				<div key={arrayIndex}>
					<CallingCard
						components={[
							<Persona
								index={personaIndex}
								image={member.image}
								name={member.name}
								title={member.title}
								email={member.email}
								body={member.body}
							/>,
						]}
						index={-1}
						fullSpread={true}
					/>
				</div>
			);
		})}
		<div style={{ borderImage: border_gradient, borderTop: `2px solid` }}>
			<h1 style={{ color: bgwhite, marginLeft: "2vw" }}>
				Our Prompt Engineers:
			</h1>
		</div>
		{prompt_engineers.map((member, arrayIndex) => {
			const personaIndex = member.title ? 1 : 2;

			return (
				<div key={arrayIndex}>
					<CallingCard
						components={[
							<Persona
								index={personaIndex}
								image={member.image}
								name={member.name}
								title={member.title}
								email={member.email}
								body={member.body}
							/>,
						]}
						index={-1}
						fullSpread={true}
					/>
				</div>
			);
		})}
	</div>
);

export { OurTeam };
