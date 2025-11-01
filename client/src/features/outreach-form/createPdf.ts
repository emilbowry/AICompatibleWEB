// client/src/features/outreach-form/createPdf.ts

const MAX_CHARS_PER_LINE = 85;

const wrapText = (text: string, maxLen: number, tab_idx: number): string[] => {
	if (text.length <= maxLen) {
		return [text];
	}

	const words = text.split(/\s+/);
	let lines: string[] = [];
	let currentLine = "";

	for (const word of words) {
		if (currentLine.length + word.length + 1 > maxLen) {
			lines.push(tab.repeat(tab_idx) + currentLine.trim());
			currentLine = word + " ";
		} else {
			currentLine += word + " ";
		}
	}

	// Push the last line
	if (currentLine.trim().length > 0) {
		lines.push(tab.repeat(tab_idx) + currentLine.trim());
	}

	return lines;
};
const escapePdfString = (text: string): string => {
	return text
		.replaceAll("\\", "\\\\")
		.replaceAll("(", "\\(")
		.replaceAll(")", "\\)");
};
const tab = "   ";
type TContent = { [k: string]: string | TContent } | string;
type TData = { title: string; content: TContent };

const titleSize = 24;
const bodySize = 12;

const processBody = (content: TContent, tab_idx = 0, fontSize = bodySize) => {
	let body: string[] = [];

	const _fontSize = fontSize > bodySize ? fontSize : bodySize;
	if (typeof content === "string") {
		body.push(`${_fontSize === bodySize ? `/F1` : `/F2`} ${_fontSize} Tf`);
		body.push(`${_fontSize + 2} TL`);
		const indentedContent = tab.repeat(tab_idx) + content;

		const linesToDraw = wrapText(
			indentedContent,
			MAX_CHARS_PER_LINE - tab_idx * tab.length,
			tab_idx
		);
		for (const line of linesToDraw) {
			body.push(`(${escapePdfString(line)}) Tj`);
			body.push("T*");
		}
	} else {
		for (const [key, value] of Object.entries(content)) {
			body.push(
				...processBody(
					key + ":",
					tab_idx,
					Math.round(
						bodySize + (titleSize - bodySize) / (tab_idx + 1)
					)
				)
			);

			body.push(...processBody(value, tab_idx + 1));
			body.push("T*");
		}
	}

	return body;
};

const generatePdf = (data: TData): string => {
	const titleText = escapePdfString(data.title);
	const bodyTextLines = processBody(data.content);

	const pdfObjects: string[] = [];

	pdfObjects.push("1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj");
	pdfObjects.push(
		"2 0 obj\n<< /Type /Pages /Kids [3 0 R] /Count 1 >>\nendobj"
	);
	// pdfObjects.push(
	// 	"3 0 obj\n<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595 842] /Contents 4 0 R /Resources << /Font << /F1 5 0 R >> >> >>\nendobj"
	// );
	pdfObjects.push(
		"3 0 obj\n<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595 842] /Contents 4 0 R /Resources << /Font << /F1 5 0 R /F2 6 0 R >> >> >>\nendobj"
	);
	const streamLines: string[] = [
		"BT",
		"/F1 24 Tf",
		"28 TL",
		"100 780 Td",
		`(${titleText}) Tj`,
		"T*",
		"/F1 12 Tf",
		"15 TL",
		"0 -15 Td",
	];

	streamLines.push(...bodyTextLines);
	streamLines.push("ET");
	const streamData = streamLines.join("\n");

	pdfObjects.push(
		`4 0 obj\n<< /Length ${streamData.length} >>\nstream\n${streamData}\nendstream\nendobj`
	);
	pdfObjects.push(
		"5 0 obj\n<< /Type /Font /Subtype /Type1 /Name /F1 /BaseFont /Helvetica >>\nendobj"
	);
	pdfObjects.push(
		"6 0 obj\n<< /Type /Font /Subtype /Type1 /Name /F2 /BaseFont /Helvetica-Bold >>\nendobj"
	);
	const offsets: number[] = [];
	const pdfChunks: string[] = [];

	const header = "%PDF-1.4\n";
	pdfChunks.push(header);
	let currentOffset = header.length;

	for (const obj of pdfObjects) {
		offsets.push(currentOffset);
		const objChunk = obj + "\n";
		pdfChunks.push(objChunk);
		currentOffset += objChunk.length;
	}

	const xrefStart = currentOffset;

	let xrefTable = `xref\n0 ${pdfObjects.length + 1}\n`;
	xrefTable += "0000000000 65535 f \n";
	for (const offset of offsets) {
		xrefTable += `${offset.toString().padStart(10, "0")} 00000 n \n`;
	}
	pdfChunks.push(xrefTable);

	const trailer = `trailer\n<< /Size ${
		pdfObjects.length + 1
	} /Root 1 0 R >>\nstartxref\n${xrefStart}\n%%EOF\n`;
	pdfChunks.push(trailer);

	const finalPdfContent = pdfChunks.join("");

	const blob = new Blob([finalPdfContent], { type: "application/pdf" });

	const url = URL.createObjectURL(blob);
	return url;
};

export { generatePdf, TContent, TData };
