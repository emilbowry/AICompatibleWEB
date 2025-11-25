// src/features/footer/Footer.tsx

import React from "react";
import logo from "../../assets/logo.png";
import { linkedin_svg } from "../../components/callingcard/graphics";
import { partners } from "../../components/partnership-bar/Partner";
import { PartnershipMarquee } from "../../components/partnership-bar/PartnershipMarquee";
import { ToggleablePortal } from "../../components/pop-over/PopOver";
import { linkStyle } from "../../styles";
import { BoxedImage } from "../../utils/reactUtils";
import { OutReachForm } from "../outreach-form/OutReachForm";
import { CenterableStyle } from "./Footer.styles";
import { FooterLayoutHandler } from "./FooterLayoutHandler";
import { GridFooter, GridFooterRows } from "./GridFooter";
import { ScrollVisibilityDependent } from "./ScrollVisibilityDependent";

const Quote1 = (
	<div>
		<div style={{ fontStyle: "italic" }}>
			<p>
				"The future has already arrived. It's just not evenly
				distributed yet."
			</p>
		</div>
		<p> - William Gibson</p>
	</div>
);
const Quote2 = (
	<div>
		<div style={{ fontStyle: "italic" }}>
			<p>
				"That fear of AI has gone, which is what we wanted, so it’s done
				exactly what we needed it to do. The overall feedback from the
				teams is 'Phenomenal'"
			</p>
		</div>
		<div>
			<p>- Olivia Hatton, VodafoneThree</p>
		</div>
	</div>
);

const FooterLayout: React.FC = () => {
	const n = 3;
	const row1 = [
		null,
		<ScrollVisibilityDependent
			element={Quote1}
			StyleOverrides={{ ...CenterableStyle, alignItems: "center" }}
			borders={[1, 2 / 3]}
		/>,
		null,
	];

	const row2 = [null, <FooterPartershipBar />, null];

	const row3 = [
		<FooterBottomLeftSideBar />,
		<ScrollVisibilityDependent
			element={Quote2}
			StyleOverrides={{
				...CenterableStyle,

				justifyContent: "center",

				maxHeight: "50%",
			}}
			borders={[0.8 * (1 / 3), 0.2 * (1 / 3)]}
		/>,
		<FooterBottomRightSideBar />,
	];
	return (
		<GridFooter n_rows={n}>
			<GridFooterRows
				col_ratio={[1, 2, 1]}
				children={row1}
			/>
			<GridFooterRows
				col_ratio={[1, 8, 1]}
				children={row2}
			/>
			<GridFooterRows
				col_ratio={[1, 2, 1]}
				children={row3}
			/>
		</GridFooter>
	);
};

const FooterBottomLeftSideBar: React.FC = () => (
	<div
		style={{
			display: "grid",
			gridTemplateRows: "25% 25% 25% 25%",
			columnGap: "2px",
			height: "100%",
			maxWidth: "100%",
			paddingLeft: "4px",
		}}
	>
		<ScrollVisibilityDependent
			element={
				<a
					href="https://www.linkedin.com/in/joe-fennell-379466170"
					style={{ color: "white" }}
				>
					{linkedin_svg}
				</a>
			}
			StyleOverrides={{
				display: "flex",
				justifyContent: "left",
				marginLeft: 0,
			}}
			borders={[1 / 3, 0.75 * (1 / 3)]}
		/>
		<ScrollVisibilityDependent
			element={
				<a
					href="https://www.linkedin.com/in/joe-fennell-379466170"
					style={{ ...linkStyle(), color: "white" }}
				>
					Joe Fennell
				</a>
			}
			StyleOverrides={CenterableStyle}
			borders={[0.75 * (1 / 3), 0.5 * (1 / 3)]}
		/>
		<ScrollVisibilityDependent
			element={
				<ToggleablePortal
					node={<OutReachForm includeMetaData={true} />}
					styling={{
						...linkStyle(),
						color: "white",
					}}
					text="Inquiries"
				/>
			}
			StyleOverrides={{ ...CenterableStyle }}
			borders={[0.5 * (1 / 3), 0.25 * (1 / 3)]}
		/>

		<ScrollVisibilityDependent
			element={
				<a
					href="https://emilbowry.com"
					style={{
						...linkStyle(),
						color: "white",
						wordBreak: "break-word",
					}}
				>
					aicompatible.com
				</a>
			}
			StyleOverrides={CenterableStyle}
			borders={[0.25 * (1 / 3), 0]}
		/>
	</div>
);

const FooterBottomRightSideBar: React.FC = () => (
	<>
		<div
			style={{
				...CenterableStyle,

				height: "100%",
				minWidth: 0,
				minHeight: 0,
			}}
		>
			<ScrollVisibilityDependent
				element={
					<BoxedImage
						image={logo}
						aspectRatio={`${Math.sqrt(3) / 2}`}
						width={"50%"}
					/>
				}
				StyleOverrides={CenterableStyle}
				percentage={0.5 * (1 / 3)}
				borders={[1 / 3, 0]}
			/>
		</div>
	</>
);

const FooterPartershipBar: React.FC = () => (
	<ScrollVisibilityDependent
		element={
			<PartnershipMarquee
				{...partners}
				index={-1}
			/>
		}
		StyleOverrides={{
			// Inline just for testing
			position: "relative",
			minWidth: 0,
			isolation: "isolate",

			minHeight: 0,
			width: "125%" /* correction factor   */,
			marginLeft: "-12.5%" /* correction factor */,
			display: "flex",
			flexDirection: "column",
			justifyContent: "center",
		}}
		borders={[18 / 30, 12 / 30]}
	/>
);

/** 

* @issues - overflows page width on mobile
*/
const Footer: React.FC<{ overrideBackground?: boolean }> = ({
	overrideBackground = false,
}) => (
	<FooterLayoutHandler
		component={FooterLayout}
		overrideBackground={overrideBackground}
	/>
);

export { Footer };
