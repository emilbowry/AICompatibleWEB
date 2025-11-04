// ===== CutHexagon =====
import React from "react";

import { midnight_green } from "../../utils/defaultColours";
import { LogoLinearGradient } from "../callingcard/graphics";
import { Hexagon } from "./Hexagons";

// @ts-ignore
class CutHexagon extends Hexagon {
	override getDefaultAssignments() {
		return [
			...super.getDefaultAssignments(),
			{ key: "isLeftHanded", return_value: true },
			{ key: "colour", return_value: midnight_green },
		];
	}
	override construct() {
		const { isLeftHanded, color } = this.santiseOptionalParameters();

		const flip = isLeftHanded ? -1 : 100;
		const cut_path = `M ${flip} 0 l 50 -86.6025 h1 l 50 86.6025  l -50 86.6025  h -1 z`;

		return {
			defs: [
				<mask id="cutoutMask">
					<path
						d={this.hex_path}
						fill="white"
					/>
					<path
						d={cut_path}
						fill="black"
					/>
				</mask>,
				LogoLinearGradient,
			],
			paths: [
				<path
					d={this.hex_path}
					mask="url(#cutoutMask)"
					fill={color}
				/>,
			],
		};
	}
}

export { CutHexagon };
