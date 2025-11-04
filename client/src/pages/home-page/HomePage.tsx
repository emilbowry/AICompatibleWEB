import React from "react";
import { Page } from "../../features/page/Page";
import { AboutUsCallingCard } from "./parts/about-us/AboutUs";
import { Hero } from "./parts/hero/Hero";
import { ImpactCC } from "./parts/impact/impact";
import { KeyPartnersCallingCard } from "./parts/key-partners/KeyPartners";
import { OurTeam } from "./parts/ourteam/OurTeam";

const homePage: React.FC = () => {
	return (
		<div style={{ display: "grid", gridTemplateColumns: "100%" }}>
			<Hero />
			<OurTeam />
			<AboutUsCallingCard />
			<ImpactCC />
			<KeyPartnersCallingCard />
		</div>
	);
};

const HomePage = () => (
	<Page
		page={homePage}
		bg={true}
	/>
);

export default HomePage;
