import React from "react";
import { AboutUsCallingCard } from "./parts/about-us/AboutUs";
import { ImpactCC } from "./parts/impact/impact";
import { KeyPartnersCallingCard } from "./parts/key-partners/KeyPartners";
import { OurTeam } from "./parts/ourteam/OurTeam";
// import { DemoContainer } from "../demo/DemoPage";

const HomePage: React.FC = () => {
	return (
		// <DemoContainer />
		<div
			style={{
				display: "grid",
				gridTemplateColumns: "100%",
			}}
		>
			<OurTeam />
			<AboutUsCallingCard />
			<ImpactCC />
			<KeyPartnersCallingCard />
		</div>
	);
};

// const HomePage = () => (
// 	<Page
// 		page={homePage}
// 		// bg={true}
// 	/>
// );

export default HomePage;
