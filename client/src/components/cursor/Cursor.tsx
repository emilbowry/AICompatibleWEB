// src/components/cursor/Cursor.tsx

import React, { createContext, useContext, useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { useIsMobile } from "../../hooks/BrowserDependant";
import { useBrowserScale } from "../../hooks/WindowSizeDependent";
import { TRAIL_SPEED } from "./Cursor.consts";
import {
	chevStyle,
	clickInsertStyleA,
	clickInsertStyleB,
	diamondStyle,
	hexStyle,
	largeCursorStyle,
	smallCursorStyle,
} from "./Cursor.styles";
import { IPosition } from "./Cursor.types";

const useMousePosition = (_position?: IPosition): IPosition => {
	const [mouse_position, setMousePosition] = useState(
		_position ?? { x: 0, y: 0 }
	);

	useEffect(() => {
		const updateMousePosition = (e: MouseEvent) => {
			setMousePosition({ x: e.clientX, y: e.clientY });
		};
		window.addEventListener("mousemove", updateMousePosition);
		return () => {
			window.removeEventListener("mousemove", updateMousePosition);
		};
	}, []);
	return mouse_position;
};

const useTrailingPosition = (
	target_position: IPosition,
	trail_speed = TRAIL_SPEED
) => {
	const [trailing_position, setTrailingCursorPosition] =
		useState(target_position);

	useEffect(() => {
		let animationFrameId: number;
		const animateLargerCursor = () => {
			setTrailingCursorPosition((prevPos) => ({
				x: prevPos.x + (target_position.x - prevPos.x) * trail_speed,
				y: prevPos.y + (target_position.y - prevPos.y) * trail_speed,
			}));
			animationFrameId = requestAnimationFrame(animateLargerCursor);
		};
		animationFrameId = requestAnimationFrame(animateLargerCursor);
		return () => {
			cancelAnimationFrame(animationFrameId);
		};
	}, [target_position, trail_speed]);

	return trailing_position;
};

const useHoveringLink = (loc?: any, setLoc?: any) => {
	const [isHoveringLink, setIsHoveringLink] = useState(false);
	const location = useLocation();
	useEffect(() => {
		if (loc && setLoc) {
			if (location !== loc) {
				setIsHoveringLink(false);
				setLoc(loc);
			}
		}
		window.addEventListener("mouseover", () => {});
		window.addEventListener("mouseout", () => {});
		return () => {
			window.removeEventListener("mouseover", () => {});
			window.removeEventListener("mouseout", () => {});
		};
	}, [loc, location]);
	useEffect(() => {
		const handleMouseOver = (e: MouseEvent) => {
			if ((e.target as HTMLElement).tagName === "A") {
				setIsHoveringLink(true);
			}
		};
		const handleMouseOut = (e: MouseEvent) => {
			if ((e.target as HTMLElement).tagName === "A") {
				setIsHoveringLink(false);
			}
		};
		window.addEventListener("mouseover", handleMouseOver);
		window.addEventListener("mouseout", handleMouseOut);
		return () => {
			window.removeEventListener("mouseover", handleMouseOver);
			window.removeEventListener("mouseout", handleMouseOut);
		};
	}, []);
	return isHoveringLink;
};
const useMouseClick = () => {
	const [isClicked, setIsClicked] = useState(false);

	useEffect(() => {
		const handleGlobalMouseDown = () => {
			setIsClicked(true);
		};

		const handleGlobalMouseUp = () => {
			setIsClicked(false);
		};

		window.addEventListener("mousedown", handleGlobalMouseDown);
		window.addEventListener("mouseup", handleGlobalMouseUp);

		return () => {
			window.removeEventListener("mousedown", handleGlobalMouseDown);
			window.removeEventListener("mouseup", handleGlobalMouseUp);
		};
	}, []);

	return isClicked;
};

interface ICustomCursorProps {
	isMouseClicked: boolean;
	mouse_position: IPosition;
	isHoveringLink: boolean;

	trailing_position: IPosition;
	scale_factor?: number;
}
const LogoCursor: React.FC<ICustomCursorProps> = (props) => {
	const { isMouseClicked, mouse_position, trailing_position, scale_factor } =
		props;
	return (
		<>
			{/* <div style={chevStyle(mouse_position)} /> */}
			{!isMouseClicked ? (
				<CutChevron {...props} />
			) : (
				<div style={chevStyle(mouse_position, scale_factor)} />
			)}
			<div style={diamondStyle(trailing_position, scale_factor)} />
			{/* {isMouseClicked && <div style={clickInsertStyle(mouse_position)} />} */}
		</>
	);
};

const CutChevron: React.FC<ICustomCursorProps> = ({
	mouse_position,
	scale_factor,
}) => {
	return (
		<>
			<div style={clickInsertStyleA(mouse_position, scale_factor)} />
			<div style={clickInsertStyleB(mouse_position, scale_factor)} />
		</>
	);
};
const StaticCursor: React.FC<ICustomCursorProps> = (
	props: ICustomCursorProps
) => (
	<LogoCursor
		{...props}
		trailing_position={props.mouse_position}
		isMouseClicked={true}
	/>
);
const FullHexCursor: React.FC<ICustomCursorProps> = ({
	mouse_position,
	scale_factor,
}) => <div style={hexStyle(mouse_position, scale_factor)} />;

const DefaultCursor: React.FC<ICustomCursorProps> = ({ mouse_position }) => (
	<>
		<div style={smallCursorStyle(mouse_position)} />
		<div style={largeCursorStyle(mouse_position)} />
	</>
);

const HexCursor: React.FC<ICustomCursorProps> = (props: ICustomCursorProps) =>
	props.isHoveringLink ? (
		props.isMouseClicked ? (
			<StaticCursor {...props} />
		) : (
			<FullHexCursor {...props} />
		)
	) : (
		<LogoCursor {...props} />
	);

const Custom_Cursor: React.FC<{ useBasic: boolean }> = ({
	useBasic = false,
}) => {
	const {
		hasCustomCursor,
		global_position,
		setGlobalMousePosition,
		loc,
		setLoc,
	} = useContext(CursorContext);
	const mouse_position = useMousePosition(global_position);
	useEffect(() => {
		setGlobalMousePosition?.(mouse_position);
	}, [setGlobalMousePosition, mouse_position]);

	const MouseProps = {
		mouse_position,
		trailing_position: useTrailingPosition(mouse_position),
		isHoveringLink: useHoveringLink(loc, setLoc),
		isMouseClicked: useMouseClick(),
		scale_factor: useBrowserScale(),
	};
	return hasCustomCursor ? (
		<>
			<style>{`* {cursor: none !important;}`}</style>

			{useBasic === true ? (
				<DefaultCursor {...MouseProps} />
			) : (
				<HexCursor {...MouseProps} />
			)}
		</>
	) : (
		<></>
	);
};

const CustomCursor: React.FC<{ useBasic?: boolean }> = ({
	useBasic = false,
}) => {
	const isMobile = useIsMobile();
	return isMobile ? <></> : <Custom_Cursor useBasic={useBasic} />;
};
const CursorContext = createContext<{
	hasCustomCursor: boolean;
	setHasCustomCursor: React.Dispatch<React.SetStateAction<boolean>>;
	global_position?: IPosition;
	setGlobalMousePosition?: React.Dispatch<React.SetStateAction<IPosition>>;
	loc?: any;
	setLoc?: any;
}>({} as any);
export { CursorContext, CustomCursor };
