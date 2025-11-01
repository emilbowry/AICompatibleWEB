// client/src/components/partnership-bar/Partner.ts

import AS from "../../assets/AS.png";
import AZ from "../../assets/AZ.png";
import bm from "../../assets/BenchMark.png";
import dct from "../../assets/dct.png";
import HM from "../../assets/HewardMills.png";
import tb from "../../assets/TB.png";
import vf from "../../assets/vf.png";
import { IPartner, IPartners, TPartnerSize } from "./PartnershipBar.types";

class Partners implements IPartners {
	readonly partners: readonly IPartner[];
	readonly size: TPartnerSize;

	constructor(partners: IPartners) {
		let partnersObj = partners;
		this.partners = partnersObj.partners;
		this.size = partnersObj.size ?? "Small";
	}
}

const partners = new Partners({
	partners: [
		{ image: HM },
		{ image: AZ },
		{ image: AS },
		{ image: vf },
		{ image: dct },
		{ image: bm },
		{ image: tb },
	],
});
export { partners };
