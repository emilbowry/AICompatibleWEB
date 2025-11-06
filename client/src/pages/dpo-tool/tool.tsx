// src/pages/dpo-tool/tool.tsx

import type { Element } from "hast";
import React, {
	CSSProperties,
	HTMLAttributes,
	ReactNode,
	useMemo,
	useState,
} from "react";
import type { Components } from "react-markdown";
import ReactMarkdown from "react-markdown";
import { Page } from "../../features/page/Page";
// import { logo_blue, logo_yellow } from "../../utils/defaultColours";
import { generateGradient } from "../../styles";

const rawMarkdown = `
#### 1. Personal Information We Collect

Personal information typically means information that identifies or is reasonably capable of identifying an individual, directly or indirectly, and information that relates to, describes, is reasonably capable of being associated with or could reasonably be linked to an identified or reasonably identifiable individual. For the purposes of this Privacy Policy, only the definition of personal information from the applicable law of your legal residence will apply to you and be deemed your “Personal Information.”

A. Personal Information we collect from you

We may collect the following categories of Personal Information directly from you:

* Identification Information, such as name, email, date of birth, phone number, postal address, and/or government-issued identity documents;
* Commercial Information, such as trading activity, order activity, deposits, withdrawals, account balances;
* Financial Information, such as bank account information, routing number, or other financial account information;
* Correspondence, such as information that you provide to us in correspondence, including account opening and customer support;
* Audio, Electronic, Visual, Thermal, Olfactory, or Similar Information, such as images and video collected for identity verification, audio recordings left on answering machines;
* Biometric Information, such as scans of your face geometry extracted from identity documents; 
<!-- Unique Property: The privacy policy affirms that it collects Biometric Information, such as scans of face geometry extracted from identity documents -->
* Professional or Employment-related Information, such as job title, source of wealth;
* Institutional Information, such as for institutional customers, we may collect additional information, including: institution’s legal name, Employer Identification Number (“EIN”) or any comparable identification number issued by a government, and proof of legal existence (which may include articles of incorporation, certificate of formation, business license, trust instrument, or other comparable legal document); and
* Sensitive Personal Information, such as government-issued identification numbers (which may include Social Security Number or equivalent, driver’s license number, passport number) and financial account information.
* Preferences, such as settings and preferences you select in the Gemini app.
* Communications, such as survey responses, information provided to our Customer Support team, including communications with interfaces such as chatbots.
* Referral information, such as your contacts’ phone or email addresses if you choose to invite those contacts to Gemini.

B. Personal Information we collect automatically

We may collect the following categories of Personal Information automatically through your use of our services:

* Online Identifiers, such as IP address; domain name, geographic location;
<!-- Shared with Policy OpenAI: The privacy policy affirms that Log Data, including a user's IP address, browser type, and the date and time of a request, is automatically collected -->
* Device Information, such as hardware, operating system, browser, screen size; and
* Usage Data, such as system activity, internal and external information related to Gemini pages that you visit, clickstream information, keystrokes, mouse movements, form field entries, recordings of chat sessions or your use of and inputs to other AI-supported tools, and other use and overall engagement with our Services.
<!-- Unique Property: the privacy policy affirm that its automatic collection of Usage Data includes keystrokes, mouse movements, and form field entries -->


Our automatic collection of Personal Information may involve the use of Cookies and other tracking technologies, described in greater detail below.

C. Personal Information we collect from third parties

We may collect and/or verify the following categories of Personal Information about you from Third Parties:

* Identification Information, such as name, email, phone number, postal address;
* Financial Information, such as bank account information, routing number. When you use third party services (for example, when you connect your Gemini account to your bank account) or websites that are linked through our Services, the providers of those services or products may receive information that Gemini, you, or others share with them. Those third party services are not governed by this Privacy Policy, and their own terms and privacy policies will apply to those products and services;
* Transaction Information, such as public blockchain data (bitcoin, ether, and other digital assets are not truly anonymous). We, and any others who can match your public Digital Asset address to other Personal Information about you, may be able to identify you from a blockchain transaction because, in some circumstances, Personal Information published on a blockchain (such as your Digital Asset address and IP address) can be correlated with Personal Information that we and others may have. Furthermore, by using data analysis techniques on a given blockchain, it may be possible to identify other Personal Information about you;
<!-- Shared with Policy OpenAI: The privacy policy affirms that Account Information, including name, contact details, payment information, and transaction history, is collected when a user creates an account -->
* Credit and Fraud Information, such as credit investigation, credit eligibility, identity or account verification, fraud detection, or as may otherwise be required by applicable law;
<!-- Shared with Policy Anthropic: The privacy policy affirms that it receives information from security partners to protect against fraud and abuse -->
* Sensitive Personal Information, such as government identification numbers (which may include Social Security Number or equivalent, driver’s license number, passport number) and financial account information and
* Additional Information, as permitted by law or required to comply with legal obligations, which may include criminal records or alleged criminal activity, or information about any person or corporation with whom you have had, currently have, or may have a financial relationship.

Personal Information you provide during the registration process may be retained, even if your registration is left incomplete or abandoned.<!-- Unique Property: The privacy policy affirms that personal information provided during the registration process may be retained even if the registration is incomplete or abandoned -->


D. Combination of Personal information

Please note that we may combine Personal Information that we receive from various sources. For example, we may combine Personal Information that we receive from third parties with Personal Information we already have about you. We use, disclose, and protect combined Personal Information as described in this Privacy Policy.

Please also note that we may de-identify or aggregate Personal Information so that it will no longer be considered Personal Information and disclose such information to other parties for purposes consistent with those described in this Privacy Policy.
`;

// --- TYPES ---
interface Property {
	id: string;
	text: string;
	type: "unique" | "shared";
	sharedWith?: string;
}
type SharedPropertiesGroup = Record<string, Property[]>;
interface ElementProps extends HTMLAttributes<HTMLElement> {
	node?: Element;
	children?: ReactNode;
}

// --- HELPER FUNCTION TO PARSE THE MARKDOWN ---
const parseMarkdownForProperties = (markdown: string) => {
	const uniqueProperties: Property[] = [];
	const sharedProperties: Property[] = [];
	let uniqueCounter = 0;
	let sharedCounter = 0;
	const lines = markdown.split("\n");
	const processedLines: string[] = [];
	const commentRegex =
		/<!--\s*(Unique Property|Shared with (Policy [^:]+)):\s*(.*?)\s*-->/;

	for (const line of lines) {
		const match = line.match(commentRegex);
		if (match && match[3] !== undefined) {
			const type = match[1];
			const text = match[3].trim();
			let newProperty: Property;

			if (type === "Unique Property") {
				const id = `unique-${uniqueCounter++}`;
				newProperty = { id, text, type: "unique" };
				uniqueProperties.push(newProperty);
			} else {
				const sharedWith = match[2];
				const id = `shared-${sharedCounter++}`;
				newProperty = { id, text, type: "shared", sharedWith };
				sharedProperties.push(newProperty);
			}

			for (let j = processedLines.length - 1; j >= 0; j--) {
				if (processedLines[j]?.trim() !== "") {
					processedLines[j] = processedLines[j]!.replace(
						/** why the strictness necessary here */
						/(\s*[-*]?\s*)(.*)/,
						`$1|||ID:${newProperty.id}|||$2`
					);
					break;
				}
			}
		} else {
			processedLines.push(line);
		}
	}

	const groupedSharedProperties =
		sharedProperties.reduce<SharedPropertiesGroup>((acc, prop) => {
			const key = prop.sharedWith || "Unknown";
			if (!acc[key]) acc[key] = [];
			acc[key].push(prop);
			return acc;
		}, {});

	return {
		uniqueProperties,
		groupedSharedProperties,
		processedMarkdown: processedLines.join("\n"),
	};
};

// --- STYLES OBJECT ---
const styles: Record<string, CSSProperties> = {
	propertiesSection: {
		border: "1px solid #e0e0e0",
		padding: "1rem",
		marginBottom: "2rem",
		borderRadius: "8px",
		backgroundColor: "#f9f9f9",
	},
	header: {
		marginTop: 0,
		color: "#1a1a1a",
	},
	list: {
		listStyleType: "none",
		paddingLeft: 0,
	},
	listItem: {
		padding: "0.75rem",
		borderRadius: "4px",
		transition: "background-color 0.2s ease-in-out",
		border: "1px solid #ddd",
		marginBottom: "0.5rem",
		backgroundColor: "#fff",
	},
	listItemHover: {
		backgroundColor: "#e8f4ff",
	},
	documentSection: {
		border: "1px solid #e0e0e0",
		padding: "1rem 2rem",
		borderRadius: "8px",
		marginBottom: "2rem",
	},
	button: {
		padding: "8px 16px",
		border: "1px solid #007bff",
		backgroundColor: "#007bff",
		color: "white",
		borderRadius: "4px",
		marginBottom: "1rem",
		transition: "background-color 0.2s, border-color 0.2s",
	},
	buttonHover: {
		backgroundColor: "#0056b3",
		borderColor: "#0056b3",
	},
	buttonActive: {
		backgroundColor: "#28a745",
		borderColor: "#28a745",
	},
	baseTextHighlight: {
		borderRadius: "3px",
		transition: "background-color 0.2s ease-in-out",
		scrollMarginTop: "20px",
	},
};

// --- THE MAIN COMPONENT ---
export const PolicyAnalyzer: React.FC = () => {
	const [hoveredId, setHoveredId] = useState<string | null>(null);
	const [clickedId, setClickedId] = useState<string | null>(null);
	const [showAllUnique, setShowAllUnique] = useState(false);
	const [showAllShared, setShowAllShared] = useState(false);
	const [listHoveredId, setListHoveredId] = useState<string | null>(null);
	const [hoveredButton, setHoveredButton] = useState<
		"unique" | "shared" | null
	>(null);

	const { uniqueProperties, groupedSharedProperties, processedMarkdown } =
		useMemo(() => parseMarkdownForProperties(rawMarkdown), []);

	// NEW: Generate a map of property IDs to specific highlight colors
	const colorMap = useMemo(() => {
		const newColorMap = new Map<string, string>();
		const UNIQUE_HIGHLIGHT_COLOR = "#FFF8C4"; // A light, creamy yellow

		// Assign one color to all unique properties
		uniqueProperties.forEach((prop) => {
			newColorMap.set(prop.id, UNIQUE_HIGHLIGHT_COLOR);
		});

		// Generate a gradient of colors for the shared property groups
		const sharedGroupNames = Object.keys(groupedSharedProperties);
		const sharedColors = generateGradient(sharedGroupNames.length); // Light blue to light pink gradient

		// Assign a unique color to each shared group
		sharedGroupNames.forEach((groupName, index) => {
			const groupColor = sharedColors[index] || "#E0E0E0"; // Fallback grey
			groupedSharedProperties[groupName]?.forEach((prop) => {
				newColorMap.set(prop.id, groupColor);
			});
		});

		return newColorMap;
	}, [uniqueProperties, groupedSharedProperties]);

	const customComponents: Components = useMemo(() => {
		const idRegex = /\|\|\|ID:(.*?)\|\|\|(.*)/s;

		const processNode = (
			children: ReactNode
		): { id: string; cleanedChildren: ReactNode } | null => {
			const childArray = React.Children.toArray(children);
			const firstChild = childArray[0];
			if (typeof firstChild === "string") {
				const match = firstChild.match(idRegex);
				if (match && match[1] !== undefined) {
					const id = match[1]!;
					const cleanedText = match[2];
					return {
						id,
						cleanedChildren: [cleanedText, ...childArray.slice(1)],
					};
				}
			}
			return null;
		};

		const createRenderer = (Tag: "p" | "li") => (props: ElementProps) => {
			const { children, ...rest } = props;
			const processed = processNode(children);

			if (processed) {
				const { id, cleanedChildren } = processed;
				const isHighlighted =
					hoveredId === id ||
					clickedId === id ||
					(showAllUnique && id.startsWith("unique")) ||
					(showAllShared && id.startsWith("shared"));

				// NEW: Get the specific highlight color for this ID
				const highlightColor = colorMap.get(id);

				const dynamicHighlightStyle =
					isHighlighted && highlightColor
						? {
								...styles.baseTextHighlight,
								backgroundColor: highlightColor,
						  }
						: undefined;

				return (
					<Tag
						id={id}
						style={dynamicHighlightStyle}
						{...rest}
					>
						{cleanedChildren}
					</Tag>
				);
			}
			return <Tag {...rest}>{children}</Tag>;
		};

		return {
			p: createRenderer("p"),
			li: createRenderer("li"),
		};
	}, [hoveredId, clickedId, showAllUnique, showAllShared, colorMap]); // Added colorMap dependency

	const handleHighlightClick = (id: string) => {
		setClickedId((prevId) => (prevId === id ? null : id));
		setTimeout(() => {
			document
				.getElementById(id)
				?.scrollIntoView({ behavior: "smooth", block: "center" });
		}, 0);
	};

	const uniqueButtonStyle = {
		...styles.button,
		...(hoveredButton === "unique" && styles.buttonHover),
		...(showAllUnique && styles.buttonActive),
	};
	const sharedButtonStyle = {
		...styles.button,
		...(hoveredButton === "shared" && styles.buttonHover),
		...(showAllShared && styles.buttonActive),
	};

	return (
		<div className="no-aos">
			<div className="policy-analyzer-container">
				<h1>Gemini Policy Analysis</h1>
				<div style={styles.propertiesSection}>
					<h3 style={styles.header}>Unique Properties</h3>
					<button
						style={uniqueButtonStyle}
						onMouseEnter={() => setHoveredButton("unique")}
						onMouseLeave={() => setHoveredButton(null)}
						onClick={() => setShowAllUnique(!showAllUnique)}
					>
						{showAllUnique
							? "Clear All Highlights"
							: "Highlight All Unique Lines"}
					</button>
					<ul style={styles.list}>
						{uniqueProperties.map((prop) => {
							const isListItemHovered = listHoveredId === prop.id;
							const listItemStyle = {
								...styles.listItem,
								...(isListItemHovered && styles.listItemHover),
							};
							return (
								<li
									key={prop.id}
									style={listItemStyle}
									onMouseEnter={() => {
										setHoveredId(prop.id);
										setListHoveredId(prop.id);
									}}
									onMouseLeave={() => {
										setHoveredId(null);
										setListHoveredId(null);
									}}
									onClick={() =>
										handleHighlightClick(prop.id)
									}
								>
									{prop.text}
								</li>
							);
						})}
					</ul>
				</div>
				<div style={styles.documentSection}>
					<ReactMarkdown components={customComponents}>
						{processedMarkdown}
					</ReactMarkdown>
				</div>
				<div style={styles.propertiesSection}>
					<h3 style={styles.header}>Shared Properties</h3>
					<button
						style={sharedButtonStyle}
						onMouseEnter={() => setHoveredButton("shared")}
						onMouseLeave={() => setHoveredButton(null)}
						onClick={() => setShowAllShared(!showAllShared)}
					>
						{showAllShared
							? "Clear All Highlights"
							: "Highlight All Shared Lines"}
					</button>
					{Object.entries(groupedSharedProperties).map(
						([policyName, props]) => (
							<div key={policyName}>
								<h4 style={styles.header}>{policyName}</h4>
								<ul style={styles.list}>
									{props.map((prop) => {
										const isListItemHovered =
											listHoveredId === prop.id;
										const listItemStyle = {
											...styles.listItem,
											...(isListItemHovered &&
												styles.listItemHover),
										};
										return (
											<li
												key={prop.id}
												style={listItemStyle}
												onMouseEnter={() => {
													setHoveredId(prop.id);
													setListHoveredId(prop.id);
												}}
												onMouseLeave={() => {
													setHoveredId(null);
													setListHoveredId(null);
												}}
												onClick={() =>
													handleHighlightClick(
														prop.id
													)
												}
											>
												{prop.text}
											</li>
										);
									})}
								</ul>
							</div>
						)
					)}
				</div>
			</div>
		</div>
	);
};
// Assuming the Page component exists for context
const ToolPage = () => (
	<Page
		page={PolicyAnalyzer}
		bg={false}
		useCursor={false}
	/>
);
export default ToolPage;
