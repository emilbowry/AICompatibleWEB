// client/src/features/outreach-form/CalanderHooks.ts

import { useEffect, useState } from "react";

type IcsDateTime = string;
type IcsUid = string;

interface IcsVEvent {
	uid: IcsUid;
	dtStamp: IcsDateTime;
	summary: string;
	dtStart: IcsDateTime;
	dtEnd: IcsDateTime;
	description?: string;
	location?: string;
	status?: "CONFIRMED" | "TENTATIVE" | "CANCELLED";
	class?: "PUBLIC" | "PRIVATE" | "CONFIDENTIAL";
	tzid?: string;
}

interface IcsConfig {
	title: string;
	description: string;
	location: string;
	durationMinutes: number;
}

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

interface CalendarFormHookResult {
	blobUrl: string; // Stores the generated, revocable Object URL
}
const DEFAULT_EVENT_CONFIG: IcsConfig = {
	title: "N/A EVENT CONFIG",
	description: "N/A",
	location: "N/A",
	durationMinutes: 60,
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
const useCalendarLink = (config: IcsVEvent): CalendarFormHookResult => {
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
export {
	DEFAULT_EVENT_CONFIG,
	getDefaultDateTimeLocal,
	useCalanderEvent,
	useCalendarLink,
};
