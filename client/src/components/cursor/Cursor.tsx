// src/components/cursor/Cursor.tsx

import React, {
	createContext,
	useContext,
	useEffect,
	useLayoutEffect,
	useMemo,
	useRef,
	useState,
} from "react";
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
import { ICustomCursorProps, IPosition } from "./Cursor.types";

const useMousePosition = (_position?: IPosition): IPosition => {
	const [mouse_position, setMousePosition] = useState(
		() => _position ?? { x: 0, y: 0 }
	);

	useLayoutEffect(() => {
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

/* 
// IDK IF NECESSARY I CANT SEE A DIFFERENCE
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
 */
const useOptimizedTrailingPosition = (
	target_position: IPosition,
	trail_speed = TRAIL_SPEED
) => {
	const [trailing_position, setTrailingCursorPosition] = useState(
		() => target_position
	);

	const targetRef = useRef(target_position);

	useLayoutEffect(() => {
		targetRef.current = target_position;
	}, [target_position]);

	useEffect(() => {
		let animationFrameId: number;

		const animate = () => {
			const currentTarget = targetRef.current;

			setTrailingCursorPosition((prevPos) => ({
				x: prevPos.x + (currentTarget.x - prevPos.x) * trail_speed,
				y: prevPos.y + (currentTarget.y - prevPos.y) * trail_speed,
			}));

			animationFrameId = requestAnimationFrame(animate);
		};

		animationFrameId = requestAnimationFrame(animate);

		return () => {
			cancelAnimationFrame(animationFrameId);
		};
	}, [trail_speed]);

	return trailing_position;
};
const useHoveringLink = (loc?: any, setLoc?: any) => {
	const [isHoveringLink, setIsHoveringLink] = useState(false);
	const location = useLocation();
	if (loc && setLoc) {
		if (location !== loc) {
			setIsHoveringLink(false);
			setLoc(loc);
		}
	}
	useEffect(() => {
		window.addEventListener("mouseover", () => {});
		window.addEventListener("mouseout", () => {});
		return () => {
			window.removeEventListener("mouseover", () => {});
			window.removeEventListener("mouseout", () => {});
		};
	}, []);
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

const CutChevron: React.FC<ICustomCursorProps> = ({
	mouse_position,
	scale_factor,
}) => {
	const [StyleA, StyleB] = useMemo(
		() => [
			clickInsertStyleA(mouse_position, scale_factor),
			clickInsertStyleB(mouse_position, scale_factor),
		],
		[mouse_position, scale_factor]
	);
	return (
		<>
			<div style={StyleA} />
			<div style={StyleB} />
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

const FullHexCursor: React.FC<ICustomCursorProps> = React.memo(
	(props) => {
		const { mouse_position, scale_factor } = props;

		const HexStyle = useMemo(
			() => hexStyle(mouse_position, scale_factor),
			[mouse_position, scale_factor]
		);
		return <div style={HexStyle} />;
	},
	(oldProps: ICustomCursorProps, newProps: ICustomCursorProps) =>
		oldProps.mouse_position === newProps.mouse_position &&
		oldProps.scale_factor === newProps.scale_factor
);

const LogoCursor: React.FC<ICustomCursorProps> = React.memo(
	(props) => {
		return (
			<>
				<Chev {...props} />
				<DiamondCutout {...props} />
			</>
		);
	},
	(oldProps: ICustomCursorProps, newProps: ICustomCursorProps) =>
		oldProps.isMouseClicked === newProps.isMouseClicked &&
		oldProps.mouse_position === newProps.mouse_position &&
		oldProps.trailing_position === newProps.trailing_position &&
		oldProps.scale_factor === newProps.scale_factor
);
const DiamondCutout: React.FC<ICustomCursorProps> = React.memo(
	(props) => {
		const { trailing_position, scale_factor } = props;
		const DiamondStyle = useMemo(
			() => diamondStyle(trailing_position, scale_factor),
			[trailing_position, scale_factor]
		);
		return <div style={DiamondStyle} />;
	},
	(oldProps: ICustomCursorProps, newProps: ICustomCursorProps) =>
		oldProps.trailing_position === newProps.trailing_position &&
		oldProps.scale_factor === newProps.scale_factor
);

const FullChev: React.FC<ICustomCursorProps> = React.memo(
	(props) => {
		const { mouse_position, scale_factor } = props;
		const ChevStyle = useMemo(
			() => chevStyle(mouse_position, scale_factor),
			[mouse_position, scale_factor]
		);
		return <div style={ChevStyle} />;
	},
	(oldProps: ICustomCursorProps, newProps: ICustomCursorProps) =>
		oldProps.mouse_position === newProps.mouse_position &&
		oldProps.scale_factor === newProps.scale_factor
);
const Chev: React.FC<ICustomCursorProps> = React.memo(
	(props) => {
		const { isMouseClicked } = props;
		return !isMouseClicked ? (
			<CutChevron {...props} />
		) : (
			<FullChev {...props} />
		);
	},
	(oldProps: ICustomCursorProps, newProps: ICustomCursorProps) =>
		oldProps.isMouseClicked === newProps.isMouseClicked &&
		oldProps.mouse_position === newProps.mouse_position &&
		oldProps.scale_factor === newProps.scale_factor
);
const HexCursor: React.FC<ICustomCursorProps> = React.memo(
	(props: ICustomCursorProps) =>
		props.isHoveringLink ? (
			<MCCursor {...props} />
		) : (
			<LogoCursor {...props} />
		),
	(oldProps: ICustomCursorProps, newProps: ICustomCursorProps) =>
		oldProps.mouse_position === newProps.mouse_position &&
		oldProps.isMouseClicked === newProps.isMouseClicked &&
		oldProps.trailing_position === newProps.trailing_position &&
		oldProps.isHoveringLink === newProps.isHoveringLink &&
		oldProps.scale_factor === newProps.scale_factor
);
const MCCursor: React.FC<ICustomCursorProps> = React.memo(
	(props: ICustomCursorProps) =>
		props.isMouseClicked ? (
			<StaticCursor {...props} />
		) : (
			<FullHexCursor {...props} />
		),
	(oldProps: ICustomCursorProps, newProps: ICustomCursorProps) =>
		oldProps.mouse_position === newProps.mouse_position &&
		oldProps.isMouseClicked === newProps.isMouseClicked &&
		oldProps.trailing_position === newProps.trailing_position &&
		oldProps.scale_factor === newProps.scale_factor
);

const DefaultCursor: React.FC<ICustomCursorProps> = ({ mouse_position }) => {
	const [CurserA, CurserB] = useMemo(
		() => [
			smallCursorStyle(mouse_position),
			largeCursorStyle(mouse_position),
		],
		[mouse_position]
	);
	return (
		<>
			<div style={CurserA} />
			<div style={CurserB} />
		</>
	);
};
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
		trailing_position: useOptimizedTrailingPosition(mouse_position),
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
