// src/components/partnershipbar/PartnershipBar.styles.ts

interface IPartner {
	image: string;
	link?: string;
}

type TPartnerSize = "Small" | "Large" | undefined;

interface IPartners {
	partners: readonly IPartner[];
	size?: TPartnerSize;
}

interface IPartnershipBar {
	partners: readonly IPartner[];
	index?: number;
}

interface IPartnerMarqueeContentProps {
	num_sets: number[];
	partners: readonly IPartner[];
}

interface IPartnershipBarCompactWallProps {
	partners: readonly IPartner[];
	StaticStyle: React.CSSProperties;
}
interface IRows {
	[key: string]: any;
	top: IPartner[];
	mid: IPartner[];
	bottom: IPartner[];
}
interface IPartnershipBarFullWallProps {
	max_bricks: number;
	rows: IRows;
	StaticStyle: React.CSSProperties;
}
export type {
	IPartner,
	IPartnerMarqueeContentProps,
	IPartners,
	IPartnershipBar,
	IPartnershipBarCompactWallProps,
	IPartnershipBarFullWallProps,
	IRows,
	TPartnerSize,
};
