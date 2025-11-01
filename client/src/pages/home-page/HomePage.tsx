import React from "react";
import { Page } from "../../features/page/Page";
// import TheJourneyPage from "../the-journey-page/TheJourney";
// import { AboutUsCallingCard } from "./parts/about-us/AboutUs";
import { Hero } from "./parts/hero/Hero";
// import { ImpactCC } from "./parts/impact/impact";
// import { KeyPartnersCallingCard } from "./parts/key-partners/KeyPartners";
// import { OurTeam } from "./parts/ourteam/OurTeam";
// import { ToggleablePortal } from "../../features/outreach-form/a";
// import { ContactForm2 } from "../../features/outreach-form/OutReachForm";
const homePage: React.FC = () => {
	return (
		<div style={{ display: "grid", gridTemplateColumns: "100%" }}>
			<Hero />
			{/* <OurTeam />
			<AboutUsCallingCard />
			<ImpactCC />
			<KeyPartnersCallingCard /> */}
			{/* <MinimalCalendarForm /> */}
		</div>
	);
};

const HomePage = () => (
	<Page
		page={homePage}
		bg={true}
	/>
);
// export default TheJourneyPage;

// import ContactPage from "../contact-page/ContactPage";

// export default ContactPage;
export default HomePage;
