import fs from "fs";
import { fileURLToPath } from "url";
import path from "path";

const bulb = `<svg
		xmlns="http://www.w3.org/2000/svg"
		viewBox="0 0 24 24"
		fill="none"
		stroke="url(#logoGradient)"
		stroke-width="1px"
		stroke-linecap="round"
	>
<defs>	<linearGradient
		id="logoGradient"
		x1="10%"
		y1="50%"
		x2="100%"
		y2="50%"
	>
		<stop
			offset="0%"
			stop-color="#FFDE59"
		/>
		<stop
			offset="100%"
			stop-color="#0CC0DF"
		/>
	</linearGradient></defs>
		<path
			d="
M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5
A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5 M9 18h6 M10 22h4"
		/>
	</svg>`;

const bullseye = `<svg
		xmlns="http://www.w3.org/2000/svg"
		fill="none"
		stroke="url(#logoGradient)"
		stroke-width="1.4px"
		stroke-linecap="round"
		viewBox="0 0 34 34"
	>
<defs>	<linearGradient
		id="logoGradient"
		x1="10%"
		y1="50%"
		x2="100%"
		y2="50%"
	>
		<stop
			offset="0%"
			stop-color="#FFDE59"
		/>
		<stop
			offset="100%"
			stop-color="#0CC0DF"
		/>
	</linearGradient></defs>
		<path
			d="
	M 22.13 2.905 
	A 15 15 0 0 0 17 2 
	A 15 15 0 0 0 2 17 
	A 15 15 0 0 0 17 32 
	A 15 15 0 0 0 32 17 
	A 15 15 0 0 0 31.095 11.867 
	M 22 8.34 
	A 10 10 0 0 0 17 7 
	A 10 10 0 0 0 7 17 
	A 10 10 0 0 0 17 27 
	A 10 10 0 0 0 27 17 
	A 10 10 0 0 0 25.66 12 
	M 17 17 L 31 3 
	M 24.0715 9.929 h 5 
	M 24.0715 9.929 v -5 
	M 27.606 6.393 h 5 
	M 27.606 6.393 v -5

  "
		/>
	</svg>`;

const pencil = `<svg
		xmlns="http://www.w3.org/2000/svg"
		viewBox="0 0 24 24"
		fill="none"
		stroke="url(#logoGradient)"
		stroke-width="1px"
		stroke-linecap="round"
	>
<defs>
<linearGradient
		id="logoGradient"
		x1="10%"
		y1="50%"
		x2="100%"
		y2="50%"
	>
		<stop
			offset="0%"
			stop-color="#FFDE59"
		/>
		<stop
			offset="100%"
			stop-color="#0CC0DF"
		/>
	</linearGradient></defs>

		<path
			d="M 21.174 6.812 a 1 1 0 0 0 -3.986 -3.987 L 3.842 16.174 a 2 2 0 0 0 -0.5 0.83 l -1.321 4.352 a 0.5 0.5 0 
		0 0 0.623 0.622 l 4.353 -1.32 a 2 2 0 0 0 0.83 -0.497 z  
M 15 5 L 19 9 
M 4 16 L 8 20
M 6 18 L 17 7
M 17 3 L 21 7
M 3 21 L 2.25 21.75"
		/>
	</svg>`;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const getDataUrl = (p: string) => {
	const fp = path.join(__dirname, p);
	const fd = fs.readFileSync(fp);
	const b = fd.toString("base64");
	const u = `data:image/jpeg;base64,${b}`;

	return u;
};
const TimelineData = [
	{
		date: "NOV 2022",
		content:
			"ChatGPT 3.5 is released - The 'ChatGPT' moment. Prompt Engineering goes mainstream ",
		image: getDataUrl("/assets/bw3.jpg"),
		sortKey: 1,
	},
	{
		date: "MAR 2023",
		content: "ChatGPT 4 is released",
		sortKey: 2,
	},
	{
		date: "DEC 2023",
		content:
			"AI Compatible  (AIC) is founded and collates 2023s discoveries in prompt engineering into a methodology, to help people use AI effectively and ethically",
		icon: bulb,
		sortKey: 3,
	},
	{
		date: "JAN 2024",
		content:
			"AIC runs its first series of prompt engineering training workshops with live clients, using the new methodology. Initially delivered through AIC first partner, The Growth House who offer leadership and teamship corporate training",
		sortKey: 4,
	},
	{
		date: "MARCH 2024",
		content:
			"The EU AI act is passed - there's questions around how suitable it is for generative AI. Joe Fennell co-led the 'SafeNet' project for improving online safety and AI literacy among young people in the Balkans, founded by the UNMIK",
		sortKey: 5,
	},
	{
		date: "JUL 2024",
		content:
			"NotebookLM is released, everyone loves it, go try it now if you haven't",
		icon: bullseye,
		image: getDataUrl("/assets/bw1.jpg"),
		sortKey: 6,
	},
	{
		date: "SEP 2024",
		content:
			"Open AI's release of o1 'strawberry', first of the 'reasoning model' generation of generative AI.",
		sortKey: 7,
	},
	{
		date: "OCT 2024",
		content:
			"O3 gets 85% accuracy on the ARC 1 benchmark - this is the going to the moon moment for Foundation models, ARC 1 was THE benchmark to beat. The AI Compatible team grows alongside our roster of partners",
		icon: pencil,
		image: getDataUrl("/assets/bw2.jpg"),
		sortKey: 8,
	},
	{
		date: "JAN 2025",
		content:
			" Deepseek R1 matches Open AI's o1 Benchmark performance. Working closely with Heward Mills data protection officers we became an advisor and partner. We add Policy assistance and consultancy to the services we offer.",
		sortKey: 9,
	},
	{
		date: "APRIL 2025",
		content:
			"Open AI O3 high gets 20% on 'Humanity's Last Exam', a compilation of problems that specialised human experts find particularly hard",
		sortKey: 10,
	},
];

export { TimelineData };
