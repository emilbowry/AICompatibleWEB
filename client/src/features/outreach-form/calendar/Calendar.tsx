// client/src/features/outreach-form/CalanderHooks.ts

import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useDynamicLink } from "../../../hooks/DynamicLink";
import { RootState } from "../../../store";
import { dark_midnight_green } from "../../../utils/defaultColours";
import { ButtonStyle } from "../OutReachForm.styles";
import { IOutreachFormFields } from "../OutReachForm.types";
import { DEFAULT_EVENT_CONFIG } from "./Calendar.consts";
import {
	ICalendarFormHookResult,
	IcsConfig,
	IcsVEvent,
} from "./Calendar.types";

const pad = (num: number): string => num.toString().padStart(2, "0");
const escapeIcsText = (text: string): string =>
	text
		.replace(/\\/g, "\\\\")
		.replace(/,/g, "\\,")
		.replace(/;/g, "\\;")
		.replace(/\n/g, "\\n");

const formatLocalIcsDate = (date: Date): string => {
	return `${date.getFullYear()}${pad(date.getMonth() + 1)}${pad(
		date.getDate()
	)}T${pad(date.getHours())}${pad(date.getMinutes())}${pad(
		date.getSeconds()
	)}`;
};

const formatIcsStampDate = (date: Date): string => {
	return `${date.getUTCFullYear()}${pad(date.getUTCMonth() + 1)}${pad(
		date.getUTCDate()
	)}T${pad(date.getUTCHours())}${pad(date.getUTCMinutes())}${pad(
		date.getUTCSeconds()
	)}Z`;
};

const serializeIcsToString = (event: IcsVEvent): string => {
	const lines: string[] = [
		"BEGIN:VCALENDAR",
		"VERSION:2.0",
		"PRODID:-//Minimal React ICS Generator//EN",
		"CALSCALE:GREGORIAN",
		"METHOD:PUBLISH",
		"BEGIN:VEVENT",
		`UID:${event.uid}`,
		`DTSTAMP:${event.dtStamp}`,
		`SUMMARY:${escapeIcsText(event.summary)}`,
		`DTSTART:${event.dtStart}`,
		`DTEND:${event.dtEnd}`,
		event.description && `DESCRIPTION:${escapeIcsText(event.description)}`,
		event.location && `LOCATION:${escapeIcsText(event.location)}`,
		event.status && `STATUS:${event.status}`,
		event.class && `CLASS:${event.class}`,
		"END:VEVENT",
		"END:VCALENDAR",
	].filter(Boolean) as string[];
	return lines.join("\n");
};

const getDefaultDateTimeLocal = (): string => {
	const now = new Date();
	const datePart = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(
		now.getDate()
	)}`;
	const timePart = `${pad(now.getHours())}:${pad(now.getMinutes())}`;
	return `${datePart}T${timePart}`;
};

const useCalanderEvent = ({
	date_string,
	config = DEFAULT_EVENT_CONFIG,
}: {
	date_string: string;
	config: IcsConfig;
}) => {
	const generateContent = ({
		date_string,
		config,
	}: {
		date_string: string;
		config: IcsConfig;
	}) => {
		const startTime = new Date(date_string);

		const endTime = new Date(
			startTime.getTime() + config.durationMinutes * 60000
		);

		const eventData: IcsVEvent = {
			uid: `${Date.now()}-${Math.random()
				.toString(36)
				.substring(2, 9)}@minimal-app.com`,
			dtStamp: formatIcsStampDate(new Date()),
			dtStart: formatLocalIcsDate(startTime),
			dtEnd: formatLocalIcsDate(endTime),
			summary: config.title,
			description: config.description,
			location: config.location,
			status: "CONFIRMED",
			class: "PUBLIC",
		};

		return eventData;
	};

	return generateContent({ date_string, config });
};
const useCalendarLink = (config: IcsVEvent): ICalendarFormHookResult => {
	const [blobUrl, setBlobUrl] = useState<string>("#");

	useEffect(() => {
		const icsBlob = new Blob([serializeIcsToString(config)], {
			type: "text/calendar;charset=utf-8",
		});

		const newUrl = icsBlob ? URL.createObjectURL(icsBlob) : "#";

		setBlobUrl(newUrl);

		return () => {};
	}, [
		config.dtStart,
		config.dtEnd,
		config.summary,
		config.description,
		config.location,
	]);

	return {
		blobUrl,
	};
};

const _AddToCalender: React.FC<{ date_key: keyof IOutreachFormFields }> = ({
	date_key,
}) => {
	const date = useSelector(
		(state: RootState) => state.outreachForm.fields[date_key]
	);
	const icsContent = useCalanderEvent({
		date_string: date,
		config: DEFAULT_EVENT_CONFIG,
	});
	const { blobUrl } = useCalendarLink(icsContent);
	const link_props = useDynamicLink({
		style_args: ["2px"],
		StyleOverrides: {
			color: dark_midnight_green,

			paddingBottom: "1px",
		},
	});
	return (
		<>
			{date && (
				<button style={ButtonStyle}>
					<a
						href={blobUrl}
						style={{
							color: "none",

							textDecorationColor: "none",
							textDecorationLine: "none",
						}}
					>
						<div {...link_props}>Add booked slot to calender</div>
					</a>
				</button>
			)}
		</>
	);
};
export { _AddToCalender, getDefaultDateTimeLocal };
