// src/components/hexagons/ImageHexagon.tsx

import React from "react";
import { Hexagon } from "./Hexagons";

//
// ===== ImageHexagon =====
//
const generateUniqueId = () => {
	try {
		const generator = window.crypto || crypto;

		if (generator && typeof generator.randomUUID === "function") {
			const uuid = generator.randomUUID.call(generator);
			return "img-id-" + uuid;
		}
	} catch (e) {
		console.warn("UUID generation failed, using fallback:", e);
	}
	return "img-id-" + Math.random().toString(36).substring(2, 11);
};

class ImageHexagon extends Hexagon {
	uniqueId = generateUniqueId();

	override construct() {
		let components = super.construct();
		components.defs.push(
			<pattern
				id={this.uniqueId}
				patternContentUnits="objectBoundingBox"
				width="1"
				height="1"
			>
				<image
					href={this.props.img}
					width="1"
					height={`${2 / Math.sqrt(3)}`}
					preserveAspectRatio="xMidYMid slice"
				/>
			</pattern>
		);
		components.paths[0] = React.cloneElement(components.paths[0], {
			fill: `url(#${this.uniqueId})`,
		});
		return components;
	}
}

export { ImageHexagon };
