// src/pages/contactpage/ContactPage.tsx

import React from "react";

import { SideBarCallingCard } from "../../components/callingcard/CallingCard";
import { Page } from "../../features/page/Page";

import { PointedtopHexagonFeatureGrid } from "../../components/hexagons/hexagon-grid/pointed-hexagon-grid/PointedHexagonRow";
import { bgwhite } from "../../utils/defaultColours";

import { ToggleablePortal } from "../../components/pop-over/PopOver";
import { OutReachForm } from "../../features/outreach-form/OutReachForm";
import { getTheme, linkStyle } from "../../styles";
import { formatComponent, ValidComponent } from "../../utils/reactUtils";
import { titleStyle } from "./ContactPage.styles";

const StyledLink: React.FC<{
	href?: string;
	content?: ValidComponent;
	isUnderlined?: boolean;
}> = ({ href = "#", content = "", isUnderlined = true }) => (
	<div
		style={{
			flex: 2,
			display: "flex",
			justifyContent: "center",
			gap: "15px",
		}}
	>
		<div>
			<a
				href={href}
				style={{ ...linkStyle(isUnderlined), ...titleStyle }}
			>
				{formatComponent(content)}
			</a>
		</div>
	</div>
);

const StyledLinkToggle: React.FC<{
	href?: string;
	content?: string;
	form_type?: string;
}> = ({ content = "", form_type = "" }) => {
	return (
		<div
			style={{
				flex: 2,
				display: "flex",
				justifyContent: "center",
				gap: "15px",
			}}
		>
			<div>
				<ToggleablePortal
					node={<OutReachForm form_type={form_type} />}
					styling={{
						...linkStyle(),
						...titleStyle,
					}}
					text={content}
				/>
			</div>
		</div>
	);
};

const sidebar_body = (
	<p>
		Do you find the world of AI vast and confusing? It’s been made to feel
		that way
		<br />
		<br />
		At AI compatible, we empower businesses with their own knowledge,
		systems and habit change to be empowered and independent. You don’t need
		to be AI-first. AI is a tool that is only useful to you when you need
		it. We strive for a world where AI goes right, and people are ready for
		it.
	</p>
);

const CUBody = (
	<div>
		<StyledLink
			href="https://community.mindstone.com/events"
			content="Join the Mindstone online events"
		/>
		<StyledLink
			href="https://controlai.com/take-action/uk"
			content="Take Action"
		/>
		<StyledLink
			href="https://www.linkedin.com/in/joe-fennell-379466170"
			content="Hear more from Joe on LinkedIn"
		/>
		<StyledLink
			href="#"
			content="Podcast COMING SOON"
		/>
	</div>
);

const contactFeatureCallouts = [
	[
		<StyledLinkToggle
			content={`Book a free 20 minute chat to find out how we could
							help you or your business`}
			form_type="BookCall"
		/>,
	],
	[
		<StyledLinkToggle
			content={`
							Request an email of our services and offering and
							keep up to date with AI Comaptible’s mailing list
						`}
			form_type="EmailInquiry"
		/>,
	],
	[
		<StyledLinkToggle
			content={`Buy 1-1 consultancy and training`}
			form_type="BookService"
		/>,
	],
];

const contactPage: React.FC = () => (
	<>
		<SideBarCallingCard
			components={[CUBody]}
			sideBar={{
				components: [sidebar_body],
				header: <h2>Join The Conversation</h2>,
			}}
			footer={
				<PointedtopHexagonFeatureGrid
					FeatureCallouts={contactFeatureCallouts}
					hexagon_args={{
						colour: getTheme(0).backgroundColor,
					}}
					useVerticalAlignment={true}
				/>
			}
			styleOverrides={{
				backgroundColor: bgwhite,
				paddingBottom: "20%",
				marginBottom: "-20%",
				zIndex: 0,
			}}
		/>
	</>
);

const ContactPage = () => <Page page={contactPage} />;

export default ContactPage;
