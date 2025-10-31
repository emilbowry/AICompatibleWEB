import React from "react";
import { useNarrowLayout } from "../../hooks/WindowSizeDependent";
import { PartnerImage } from "./PartnershipBar";
import { PARTNER_EFFECTIVE_WIDTH } from "./PartnershipBar.consts";
import {
	CompactViewStyle,
	PBWallStyle,
	rowLayoutStyle,
} from "./PartnershipBar.styles";
import {
	IPartner,
	IPartnershipBar,
	IPartnershipBarCompactWallProps,
	IPartnershipBarFullWallProps,
	IRows,
} from "./PartnershipBar.types";

/**  

	Calculates a "bricked" wall tiling, maximum of 3 rows, given n bricks that is strictly not bottom heavy
	@returns as tuple [a,b,c]
	a := top row
	c := bottom row
	b = n - (a+c)

	invariant: exists x in {a, n-(a+c)} s.t c <= x 

*/

const WallLayout = (n: number): [number, number, number] => {
	const top_row =
		Math.sign(n) * ((((n % 3) + 1) % 2) + Math.max(1, Math.floor(n / 3)));
	const bottom_row =
		Math.floor((n + 1) / 3) - (((n + 1) % Math.max(1, Math.min(n, 3))) % 2);
	return [top_row, n - (top_row + bottom_row), bottom_row];
};

const keys = ["top", "mid", "bottom"];

const getRows = (p: readonly IPartner[], sum = 0, r = {} as IRows) => (
	WallLayout(p.length).forEach(
		(val, i, _) => (r[keys[i]] = p.slice(sum, (sum += val)))
	),
	r
);
const getLayoutData = (partners: readonly IPartner[]) => {
	const rows = getRows(partners);
	const max_bricks = Math.max(rows.top.length, rows.mid.length);
	return {
		rows: rows,
		max_bricks: max_bricks + +!(max_bricks % 2 === 0),
	};
};

const PartnerWallRow: React.FC<{
	partners: readonly IPartner[];
	style: React.CSSProperties;
}> = ({ partners, style }) => (
	<div style={style}>
		{partners.map((partner, index) => (
			<PartnerImage
				key={index}
				partner={partner}
			/>
		))}
	</div>
);

const PartnershipBarFullWall: React.FC<IPartnershipBarFullWallProps> = ({
	max_bricks,
	rows,
	StaticStyle,
}) => (
	<div style={{ ...StaticStyle, backgroundColor: "transparent" }}>
		<PartnerWallRow
			partners={rows.top}
			style={rowLayoutStyle(rows.top.length, max_bricks)}
		/>
		<PartnerWallRow
			partners={rows.mid}
			style={rowLayoutStyle(rows.mid.length, max_bricks)}
		/>
		<PartnerWallRow
			partners={rows.bottom}
			style={rowLayoutStyle(rows.bottom.length, max_bricks)}
		/>
	</div>
);

const PartnershipBarCompactWall: React.FC<IPartnershipBarCompactWallProps> = ({
	partners,
	StaticStyle,
}) => (
	<div
		style={{
			...StaticStyle,
			...CompactViewStyle,
		}}
	>
		{partners.map((partner, _index) => (
			<PartnerImage
				key={_index}
				partner={partner}
			/>
		))}
	</div>
);
const PartnershipWall: React.FC<IPartnershipBar> = ({
	partners,
	index = 0,
}) => {
	const StaticStyle = PBWallStyle(index);
	const layout = WallLayout(partners.length);
	const max_bricks = Math.max(layout[0], layout[1]);

	const threshold =
		PARTNER_EFFECTIVE_WIDTH * (max_bricks + +!(max_bricks % 2 === 0));
	const isNarrow = useNarrowLayout(threshold);
	return isNarrow ? (
		<PartnershipBarCompactWall
			partners={partners}
			StaticStyle={StaticStyle}
		/>
	) : (
		<PartnershipBarFullWall
			StaticStyle={StaticStyle}
			{...getLayoutData(partners)}
		/>
	);
};
export { PartnershipWall };
