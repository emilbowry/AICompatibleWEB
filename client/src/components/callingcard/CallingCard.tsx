// src/components/callingcard/CallingCard.tsx

import React from "react";
import { useNarrowLayout } from "../../hooks/WindowSizeDependent";
import { getTheme } from "../../styles";
import { formatComponent } from "../../utils/reactUtils";
import {
	containerStyle,
	GridBodyStyle,
	GridItemStyle,
} from "./CallingCard.styles";
import {
	ICallingCardProps,
	ICallOutProps,
	IFooterProps,
	IGridBodyProps,
	IGridItemProps,
	IHeaderProps,
} from "./CallingCard.types";

const CompWrapper: React.FC<ICallOutProps> = ({
	content,
	wrapper_style = { background: "red" },
	noAos,
}) =>
	content ? (
		<div
			className={noAos ? "no-aos" : "aos-ignore"}
			style={wrapper_style}
		>
			{formatComponent(content)}
		</div>
	) : null;

const Header: React.FC<IHeaderProps> = (props) => <CompWrapper {...props} />;
const Footer: React.FC<IFooterProps> = ({ content }) =>
	content && formatComponent(content);

const GridItem = ({
	content,
	item_key,
	noAos,
}: IGridItemProps): React.ReactNode =>
	content ? (
		<CompWrapper
			content={content}
			wrapper_style={{
				...GridItemStyle,
			}}
			key={item_key}
			noAos={noAos}
		/>
	) : (
		<div
			style={{ ...GridItemStyle }}
			key={item_key}
		/>
	);
const GridBody: React.FC<IGridBodyProps> = ({
	components,
	columnOverrides = undefined,
	noAos,
}) => {
	return (
		<div
			className={"aos-ignore"}
			style={{
				...GridBodyStyle,
				...{
					gridTemplateColumns:
						columnOverrides ?? `repeat(${components.length}, 1fr)`,
				},
				// ...styleOverrides,
				// background: "red",
			}}
		>
			{components.map((item, index) => (
				<React.Fragment key={index}>
					<GridItem
						content={item}
						item_key={index}
						noAos={noAos}
						styleOverrides={
							{
								// background: "red",
							}
						}
					/>
				</React.Fragment>
			))}
		</div>
	);
};

const CallingCard: React.FC<
	ICallingCardProps & {
		testEl?: React.ReactNode;
		gridOverriders?: React.CSSProperties;
	}
> = ({
	components,
	index = 0,
	header,
	footer,
	fullSpread = false,
	styleOverrides = {},
	isPageElement = false,
	narrowPageEl = false,
	noAos,
	children,
	gridOverriders = {},
}) => {
	let theme = getTheme(index);
	return (
		<>
			<div
				className={"aos-ignore"}
				style={{
					...containerStyle,
					color: theme.secondaryColor,
					backgroundColor: theme.backgroundColor,
					// padding: !fullSpread ? "2%" : "0",
					borderTopLeftRadius: isPageElement ? "80px 60px" : "",
					...styleOverrides,
				}}
			>
				<div style={{ margin: !fullSpread ? "2%" : "0%" }}>
					<Header
						content={header}
						wrapper_style={{
							color: theme.primaryColor,
							// background: styleOverrides.background,
						}}
					/>

					<GridBody
						components={components}
						columnOverrides={
							isPageElement
								? `${100 / 3}% ${200 / 3}%`
								: undefined
						}
						noAos={noAos}
						styleOverrides={
							isPageElement || narrowPageEl
								? {
										marginTop: "1%",
										paddingTop: "2%",
										borderTop: header ? `4px solid` : "",
										...gridOverriders,
										// background: styleOverrides.background,
								  }
								: {
										// padding: !fullSpread ? "2%" : "0",
										borderRadius: !fullSpread
											? "50px 10px"
											: "",
										...gridOverriders,
										// background: styleOverrides.background,
								  }
						}
					/>
				</div>
				{children}
			</div>
			<Footer content={footer} />
		</>
	);
};

/** 

* @issues - when mobile, instead of being to side, we want to move vertically
- Potential fix, use normal calling card, add another grid body between Header and GridBody for sidebar comp

*/

const SideBarCallingCard: React.FC<
	ICallingCardProps & {
		sideBar?: ICallingCardProps;
		fullSpreadSideBarNarrow?: boolean;
	}
> = (props) => {
	const {
		components,
		isPageElement = true,
		sideBar,
		fullSpreadSideBarNarrow = false,
	} = props;
	const isNarrow = useNarrowLayout();

	const Child = () =>
		sideBar ? (
			<CallingCard
				{...sideBar}
				fullSpread={fullSpreadSideBarNarrow}
				index={props.index}
				noAos={true}
				styleOverrides={{
					// background: props.styleOverrides?.background,
					background: "transparent",
				}}
			/>
		) : (
			<></>
		);

	return isNarrow ? (
		<CallingCard
			{...props}
			components={components}
			narrowPageEl={isPageElement}
		>
			<Child />
		</CallingCard>
	) : (
		<CallingCard
			{...props}
			components={
				sideBar
					? [
							<Child />,
							<GridBody
								components={components}
								// styleOverrides={}
							/>,
					  ]
					: components
			}
			isPageElement={isPageElement}
		/>
	);
};

export { CallingCard, SideBarCallingCard };
