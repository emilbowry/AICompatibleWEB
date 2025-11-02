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

interface ICalendarFormHookResult {
	blobUrl: string;
}

export { ICalendarFormHookResult, IcsConfig, IcsUid, IcsVEvent };
