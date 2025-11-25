import React from "react";
import ReactMarkdown, { Components } from "react-markdown";
import { visit } from "unist-util-visit";
import remarkGfm from "remark-gfm";
import { IHighlightNode, IFlatSegment, ITextNode } from "../CSSMarkdown.types";

const toCssClass = (id: string) => {
	return `hl-${id.replace(/[^a-zA-Z0-9]/g, "_")}`;
};
const remarkHighlightPlugin = (options: { segments: IFlatSegment[] }) => {
	return (tree: any) => {
		const { segments } = options;
		if (!segments.length) return;

		visit(tree, "text", (node: any, index, parent) => {
			if (!parent || index === undefined) return;
			if (!node.position) return;

			const textNode = node as ITextNode;
			const nodeStart = node.position.start.offset;
			const nodeEnd = node.position.end.offset;

			const relevantSegments = segments.filter(
				(s) => s.start < nodeEnd && s.end > nodeStart
			);

			if (relevantSegments.length === 0) return;

			const newChildren: (ITextNode | IHighlightNode)[] = [];
			let cursor = nodeStart;

			relevantSegments.sort((a, b) => a.start - b.start);

			for (const seg of relevantSegments) {
				if (cursor < seg.start) {
					newChildren.push({
						type: "text",
						value: textNode.value.slice(
							cursor - nodeStart,
							seg.start - nodeStart
						),
					});
					cursor = seg.start;
				}

				const hStart = Math.max(cursor, seg.start);
				const hEnd = Math.min(nodeEnd, seg.end);

				if (hStart < hEnd) {
					const textContent = textNode.value.slice(
						hStart - nodeStart,
						hEnd - nodeStart
					);

					// Safe CSS Class Generation
					const classNames = seg.ids
						.map((id) => toCssClass(id))
						.join(" ");

					newChildren.push({
						type: "highlight",
						data: {
							hName: "span",
							hProperties: { className: classNames },
						},
						children: [{ type: "text", value: textContent }],
					});

					cursor = hEnd;
				}
			}

			if (cursor < nodeEnd) {
				newChildren.push({
					type: "text",
					value: textNode.value.slice(cursor - nodeStart),
				});
			}

			parent.children.splice(index, 1, ...newChildren);
			return index + newChildren.length;
		});
	};
};
const MarkdownViewer = React.memo(
	({ content, segments }: { content: string; segments: IFlatSegment[] }) => {
		return (
			<ReactMarkdown
				remarkPlugins={[
					[remarkHighlightPlugin, { segments }],
					remarkGfm,
				]}
				components={
					{
						highlight: ({ node, ...props }: any) => (
							<span {...props} />
						),
					} as Components
				}
			>
				{content}
			</ReactMarkdown>
		);
	}
);

export { MarkdownViewer, toCssClass };
