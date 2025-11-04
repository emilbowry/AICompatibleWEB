// src/features/footer/GridFooter.tsx

import React from "react";
import { FormatComponent, ValidComponent } from "../../utils/reactUtils";
import { gridFooterStyle } from "./Footer.styles";

const GridFooter: React.FC<{
	n_rows?: number;
	children?: React.ReactNode;
}> = ({ n_rows = 3, children }) => {
	return (
		<div>
			<div style={gridFooterStyle(n_rows)}>{children}</div>
		</div>
	);
};

const Empty = () => <div />;
const GridFooterRows: React.FC<{
	col_ratio?: number[];
	children: ValidComponent[];
}> = ({ col_ratio = [1], children }) => {
	return (
		<div
			style={{
				display: "grid",
				gridTemplateColumns: col_ratio
					.map(
						(number) =>
							(100 * number) /
							col_ratio.reduce(
								(accumulator, currentValue) =>
									accumulator + currentValue,
								0
							)
					)
					.map((number) => number + "%")
					.join(" "),
			}}
		>
			{children.map((item, _index) => (
				<React.Fragment key={_index}>
					{item ? <FormatComponent Component={item} /> : <Empty />}
				</React.Fragment>
			))}
		</div>
	);
};
export { GridFooter, GridFooterRows };
