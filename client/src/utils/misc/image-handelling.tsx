// src/utils/misc/image-handelling.tsx

import React from "react";
import ReactDOMServer from "react-dom/server";

const get_data_uri = (svgString: string, asCSSUrl = false): string => {
	const uri = encodeURIComponent(svgString);

	const str_uri = `data:image/svg+xml,${uri}`;
	return asCSSUrl ? `url("${str_uri}")` : str_uri;
};
const stringifySVG = (svg: React.ReactElement): string => {
	return ReactDOMServer.renderToStaticMarkup(svg);
};

export { get_data_uri, stringifySVG };
