// src/components/hexagons/LogoHexagon.tsx

import { logo_yellow } from "../../utils/defaultColours";
import { LogoLinearGradient } from "../callingcard/graphics";
import { Hexagon } from "./Hexagons";
import {
	LOGO_CHEV_COLOUR_MASK,
	LOGO_CHEV_CUTOUT,
	LOGO_CHEV_DIAMOND,
	LOGO_CHEV_SPLIT,
} from "./Hexagons.consts";

class LogoHexagon extends Hexagon {
	override getDefaultAssignments() {
		return [
			...super.getDefaultAssignments(),
			{ key: "withGap", return_value: false },
		];
	}
	override construct() {
		const components = {
			defs: [LogoLinearGradient, <mask id="hexagon"></mask>],
			paths: [
				<path
					d={LOGO_CHEV_DIAMOND}
					fill={logo_yellow}
					mask="url(#logoCutout)"
				/>,
				<path
					d={LOGO_CHEV_COLOUR_MASK}
					fill="url(#logoGradient)"
					mask="url(#logoCutout)"
				/>,
			],
		};

		if (this.santiseOptionalParameters() == true) {
			components.defs.push(
				<mask id="logoCutout">
					<path
						d={this.hex_path}
						fill="white"
					/>
					<path
						d={LOGO_CHEV_CUTOUT}
						fill="black"
					/>
					<path
						d={LOGO_CHEV_SPLIT}
						fill="black"
					/>
				</mask>
			);
		} else {
			components.defs.push(
				<mask id="logoCutout">
					<path
						d={this.hex_path}
						fill="white"
					/>
					<path
						d={LOGO_CHEV_CUTOUT}
						fill="black"
					/>
				</mask>
			);
		}
		return components;
	}
}

export { LogoHexagon };
