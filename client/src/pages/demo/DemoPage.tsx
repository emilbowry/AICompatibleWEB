// src/pages/home-page/demo/DemoPage.tsx
import React from "react";
import { Page } from "../../features/page/Page";
const demoPage: React.FC = () => {
	return <div></div>;
};

const DemoPage = () => (
	<Page
		page={demoPage}
		bg={true}
	/>
);

export default DemoPage;
