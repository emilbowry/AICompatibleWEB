import React from "react";
import { PartnerRow } from "./PartnershipBar";
import { NUM_SETS } from "./PartnershipBar.consts";
import {
	Keyframes,
	MarqueeContentStyle,
	MarqueeFrameStyle,
	MarqueeWindowStyle,
	PartnerWrapperStyle,
} from "./PartnershipBar.styles";
import {
	IPartnerMarqueeContentProps,
	IPartnershipBar,
} from "./PartnershipBar.types";

import { styleObjectToString } from "../../styles";

const PartnershipMarquee: React.FC<IPartnershipBar> = ({ partners }) => {
	return (
		<div className="no-aos">
			<style>{styleObjectToString(Keyframes)}</style>
			<div style={MarqueeFrameStyle}>
				<div style={MarqueeWindowStyle}>
					<PartnerMarqueeContent
						num_sets={NUM_SETS}
						partners={partners}
					/>
				</div>
			</div>
		</div>
	);
};

const PartnerMarqueeContent: React.FC<IPartnerMarqueeContentProps> = ({
	num_sets,
	partners,
}) => {
	return (
		<>
			<div style={MarqueeContentStyle}>
				{num_sets.map((setIndex) => (
					<React.Fragment key={`set-${setIndex}`}>
						<PartnerRow
							partners={partners}
							style={PartnerWrapperStyle}
						/>
					</React.Fragment>
				))}
			</div>
		</>
	);
};

export { PartnershipMarquee };
