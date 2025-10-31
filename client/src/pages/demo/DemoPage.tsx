// src/pages/home-page/demo/DemoPage.tsx
import React from "react";
// import { ContactForm } from "../../features/contact-form/ContactForm";
import { Page } from "../../features/page/Page";
const demoPage: React.FC = () => {
	return <div>{/* <ContactForm /> */}</div>;
};

const DemoPage = () => (
	<Page
		page={demoPage}
		bg={true}
	/>
);

// export { DemoPage };
export default DemoPage;
