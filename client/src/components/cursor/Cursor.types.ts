interface IPosition {
	x: number;
	y: number;
}
interface ICustomCursorProps {
	isMouseClicked: boolean;
	mouse_position: IPosition;
	isHoveringLink: boolean;

	trailing_position: IPosition;
	scale_factor?: number;
}
export type { ICustomCursorProps, IPosition };
