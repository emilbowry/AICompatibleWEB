// src/pages/contactpage/ContactPage.tsx

import React, { useRef } from "react";

import { SideBarCallingCard } from "../../components/callingcard/CallingCard";
import { Page } from "../../features/page/Page";

import { PointedtopHexagonFeatureGrid } from "../../components/hexagons/hexagon-grid/pointed-hexagon-grid/PointedHexagonRow";
import { bgwhite } from "../../utils/defaultColours";

import { ToggleablePortal } from "../../components/pop-over/PopOver";
import { OutReachForm } from "../../features/outreach-form/OutReachForm";
import { useDynamicLink } from "../../hooks/DynamicLink";
import { getTheme, linkStyle, VOLUME_CONSTANT_SIZE } from "../../styles";
import { FormatComponent, ValidComponent } from "../../utils/reactUtils";
import { titleStyle } from "./ContactPage.styles";
const theme = getTheme(0);
const StyledLink: React.FC<{
	href?: string;
	content?: ValidComponent;
	isUnderlined?: boolean;
	ignore_style?: boolean;
}> = ({
	href = "#",
	content = "",
	isUnderlined = true,
	ignore_style = false,
}) => (
	<div
		style={{
			flex: 2,
			display: "flex",
			// justifyContent: "center",
			gap: "15px",
		}}
	>
		<div>
			<a
				href={href}
				style={
					ignore_style
						? {}
						: {
								...linkStyle(isUnderlined),
								...titleStyle,
								color: theme.secondaryColor,
						  }
				}
			>
				{/* {formatComponent(content)} */}
				<FormatComponent Component={content} />
			</a>
		</div>
	</div>
);

const StyledLinkToggle: React.FC<{
	href?: string;
	content?: string;
	form_type?: string;
	StyleOverrides?: React.CSSProperties;
}> = ({ content = "", form_type = "", StyleOverrides = {} }) => {
	return (
		<div
			style={{
				paddingTop: "50%",

				flex: 1,
				display: "flex",
				justifyContent: "center",
				// gap: "15px",
			}}
		>
			<div
				{...useDynamicLink({
					useDefaultDecoration: false,

					style_args: ["2px"],
					StyleOverrides: {
						...titleStyle,
						...StyleOverrides,
					},
				})}
			>
				<ToggleablePortal
					node={<OutReachForm form_type={form_type} />}
					styling={{
						textDecorationColor: "inherit",
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

const sideb = (
	<>
		<ul>
			<li>
				<StyledLink
					href="https://community.mindstone.com/events"
					content="Join the Mindstone online events"
				/>
			</li>
			<li>
				<StyledLink
					href="https://controlai.com/take-action/uk"
					content="Take Action"
				/>
			</li>
			<li>
				<StyledLink
					href="https://www.linkedin.com/in/joe-fennell-379466170"
					content="Hear more from Joe on LinkedIn"
				/>
			</li>
			<li>
				<StyledLink
					href="#"
					content="Podcast COMING SOON"
				/>
			</li>
		</ul>
	</>
);

// const useFullWidthBackground = (
// 	contentRef: React.RefObject<HTMLElement | null>,
// 	isVisible: boolean,
// 	background: string = "red",
// 	backgroundZIndex: number = 1000,
// 	container_id?: string
// ) => {
// 	const sidebarContentEl = (
// 		container_id ? document.getElementById(container_id) : document.body
// 	) as HTMLElement;
// 	// const a =document!.getElementById(container_id)
// 	const [rect, setRect] = useState<DOMRect | null>(null); //

// 	useLayoutEffect(() => {
// 		if (contentRef.current && isVisible) {
// 			const currentRect = contentRef.current.getBoundingClientRect();
// 			setRect(currentRect);
// 		}
// 	}, [contentRef, isVisible]);

// 	if (!isVisible || !rect) return null;

// 	return ReactDOM.createPortal(
// 		<div
// 			style={{
// 				position: "absolute",
// 				top: "0",
// 				// left: 0,
// 				width: "50%",
// 				height: "50%",
// 				// height: rect.height,
// 				// height: "100px",
// 				backgroundSize: "cover",
// 				// backgroundSize: "100%",
// 				background: background,
// 				zIndex: backgroundZIndex,
// 				opacity: 1,
// 			}}
// 		/>,
// 		sidebarContentEl // Portal destination
// 	);
// };
const Sideb2: React.FC = () => {
	const contentRef = useRef<HTMLDivElement>(null);

	// // Use the hook to render the full-width background
	// const backgroundPortal = useFullWidthBackground(
	// 	contentRef,
	// 	true, // isVisible
	// 	// "red" // color
	// 	`url(${bgs})`
	// );

	return (
		<div
			ref={contentRef}
			style={{
				position: "relative",

				// background: `linear-gradient(to right, #79C2D0, #C9E59F)`,

				padding: "0 2% 2%",
			}}
		>
			<h2 style={{ padding: "2%", color: theme.primaryColor }}>
				Find Out More
			</h2>
			{/* {backgroundPortal} */}
			<ul
				style={{
					position: "relative",
					// color:,
				}}
			>
				<li>
					<StyledLink
						href="https://community.mindstone.com/events"
						content="Join the Mindstone online events"
					/>
				</li>
				<li>
					<StyledLink
						href="https://controlai.com/take-action/uk"
						content="Take Action"
					/>
				</li>
				<li>
					<StyledLink
						href="https://www.linkedin.com/in/joe-fennell-379466170"
						content="Hear more from Joe on LinkedIn"
					/>
				</li>
				<li>
					<StyledLink
						href="#"
						content="Podcast COMING SOON"
					/>
				</li>
			</ul>
		</div>
		// </div>
	);
};
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
const LinkStyle: React.CSSProperties = {
	fontSize: `calc(4*${VOLUME_CONSTANT_SIZE})`,
	color: theme.primaryColor,
	textWrap: "nowrap",
};
const FooterPStyle: React.CSSProperties = {
	textAlign: "center",
	color: theme.secondaryColor,
	fontSize: `calc(2*${VOLUME_CONSTANT_SIZE})`,
};
const contactFeatureCallouts = [
	[
		<StyledLinkToggle
			content="Say Hello!"
			form_type="EmailInquiry"
			StyleOverrides={LinkStyle}
		/>,

		<p style={FooterPStyle}>
			Request an email of our services and offering and keep up to date
			with AI Comaptible’s mailing list
		</p>,
	],
	[
		<StyledLinkToggle
			content="Meet Us!"
			form_type="BookCall"
			StyleOverrides={LinkStyle}
		/>,
		<p style={FooterPStyle}>
			Book a free 20 minute chat to find out how we could help you or your
			business
		</p>,
	],
	[
		<StyledLinkToggle
			content="Book Us!"
			form_type="BookService"
			StyleOverrides={LinkStyle}
		/>,
		<p style={FooterPStyle}>Buy 1-1 consultancy and training</p>,
	],
];

const contactPage: React.FC = () => (
	<>
		<SideBarCallingCard
			components={[sidebar_body]}
			header={<h2>Join The Conversation</h2>}
			sideBar={{
				components: [<Sideb2 />],
				// header: <h2 style={{ padding: "2%" }}>Find Out More</h2>,
			}}
			footer={
				<PointedtopHexagonFeatureGrid
					FeatureCallouts={contactFeatureCallouts}
					hexagon_args={{
						colour: theme.backgroundColor,
						// colour: "transparent",
					}}
					_background="linear-gradient(to right bottom, #79C2D0, #C9E59F)"
					// _background={`linear-gradient(to bottom right, black, white)`}
					_background_attached={false}
					_background_size={`100vw 150vh`}
					// useVerticalAlignment={true}
				/>
			}
			fullSpreadSideBarNarrow={true}
			styleOverrides={{
				backgroundColor: bgwhite,
				background: `linear-gradient(to right bottom, #79C2D0, #C9E59F) fixed`,
				// background: `linear-gradient(to bottom right, black, white) fixed`,
				backgroundSize: `100vw 150vh`,
				paddingBottom: "20%",
				marginBottom: "-20%",
				zIndex: 0,
				overflow: "visible",
			}}
		/>
	</>
);

const ContactPage = () => <Page page={contactPage} />;

export default ContactPage;
