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
	wrapper_style = {},
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
			wrapper_style={GridItemStyle}
			key={item_key}
			noAos={noAos}
		/>
	) : (
		<div
			style={GridItemStyle}
			key={item_key}
		/>
	);
const GridBody: React.FC<IGridBodyProps> = ({
	components,
	styleOverrides = {},
	columnOverrides = undefined,
	noAos,
}) => (
	<div
		className={"aos-ignore"}
		style={{
			...GridBodyStyle,
			...{
				gridTemplateColumns:
					columnOverrides ?? `repeat(${components.length}, 1fr)`,
			},
			...styleOverrides,
		}}
	>
		{components.map((item, index) => (
			<React.Fragment key={index}>
				<GridItem
					content={item}
					item_key={index}
					noAos={noAos}
				/>
			</React.Fragment>
		))}
	</div>
);

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
					padding: !fullSpread ? "2%" : "0",
					borderTopLeftRadius: isPageElement ? "80px 60px" : "",
					...styleOverrides,
				}}
			>
				<Header
					content={header}
					wrapper_style={{ color: theme.primaryColor }}
				/>

				<GridBody
					components={components}
					columnOverrides={
						isPageElement ? `${100 / 3}% ${200 / 3}%` : undefined
					}
					noAos={noAos}
					styleOverrides={
						isPageElement || narrowPageEl
							? {
									marginTop: "1%",
									paddingTop: "2%",
									borderTop: header ? `4px solid` : "",
									...gridOverriders,
							  }
							: {
									padding: !fullSpread ? "2%" : "0",
									borderRadius: !fullSpread
										? "50px 10px"
										: "",
									...gridOverriders,
							  }
					}
				/>
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
	ICallingCardProps & { sideBar?: ICallingCardProps }
> = (props) => {
	const { components, isPageElement = true, sideBar } = props;
	const isNarrow = useNarrowLayout();

	const Child = () =>
		sideBar ? (
			<CallingCard
				{...sideBar}
				index={props.index}
				noAos={true}
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
					? [<Child />, <GridBody components={components} />]
					: components
			}
			isPageElement={isPageElement}
		/>
	);
};

export { CallingCard, SideBarCallingCard };
