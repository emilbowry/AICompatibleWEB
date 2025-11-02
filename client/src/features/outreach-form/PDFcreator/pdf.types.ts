type TContent = { [k: string]: string | TContent } | string;
type TData = { title: string; content: TContent };

export type { TContent, TData };
