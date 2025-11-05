// server/src/controllers/data/journeydata.ts

import type { Request, Response } from "express";

const TimelineData = [
	{
		date: "NOV 2022",
		content:
			"ChatGPT 3.5 is released - The 'ChatGPT' moment. Prompt Engineering goes mainstream ",
	},
	{
		date: "MAR 2023",
		content: "ChatGPT 4 is released",
	},
	{
		date: "DEC 2023",
		content:
			"AI Compatible  (AIC) is founded and collates 2023s discoveries in prompt engineering into a methodology, to help people use AI effectively and ethically",
	},
	{
		date: "JAN 2024",
		content:
			"AIC runs its first series of prompt engineering training workshops with live clients, using the new methodology. Initially delivered through AIC first partner, The Growth House who offer leadership and teamship corporate training",
	},
	{
		date: "MARCH 2024",
		content:
			"The EU AI act is passed - there's questions around how suitable it is for generative AI. Joe Fennell co-led the 'SafeNet' project for improving online safety and AI literacy among young people in the Balkans, founded by the UNMIK",
	},
	{
		date: "JUL 2024",
		content:
			"NotebookLM is released, everyone loves it, go try it now if you haven't",
	},
	{
		date: "SEP 2024",
		content:
			"Open AI's release of o1 'strawberry', first of the 'reasoning model' generation of generative AI.",
	},
	{
		date: "OCT 2024",
		content:
			"O3 gets 85% accuracy on the ARC 1 benchmark - this is the going to the moon moment for Foundation models, ARC 1 was THE benchmark to beat. The AI Compatible team grows alongside our roster of partners",
	},
	{
		date: "JAN 2025",
		content:
			" Deepseek R1 matches Open AI's o1 Benchmark performance. Working closely with Heward Mills data protection officers we became an advisor and partner. We add Policy assistance and consultancy to the services we offer.",
	},
	{
		date: "APRIL 2025",
		content:
			"Open AI O3 high gets 20% on 'Humanity's Last Exam', a compilation of problems that specialised human experts find particularly hard",
	},
];

const getJourneyData = (_req: Request, res: Response) => {
	res.json({ TimelineData });
};

export { getJourneyData };
