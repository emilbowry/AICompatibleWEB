// src/utils/animationTagging.ts

import { useEffect } from "react";
import { useLocation } from "react-router-dom";
/** 
* @improvement - make less monolithic


*/
const isHTMLElement = (el: Element): el is HTMLElement =>
	el instanceof HTMLElement;
const isInSVG = (el: Element) =>
	el.namespaceURI === "http://www.w3.org/2000/svg" || !!el.closest("svg");

const cleanSVGAccidents = () => {
	document.querySelectorAll("svg.aos, svg .aos").forEach((el) => {
		el.classList.remove("aos", "is-visible");
	});
};

const shouldSkip = (el: Element) =>
	!!el.closest(".no-aos") || isInSVG(el) || !isHTMLElement(el);
const setElementProperties = (
	el: Element,
	baseDepth: number,
	siblingIndex: number,
	orderIndex: number
) => {
	if (!el.classList.contains("aos-ignore")) {
		el.classList.add("aos");
		if (el instanceof HTMLElement) {
			el.dataset.baseDepth = String(baseDepth);
			el.dataset.siblingIndex = String(siblingIndex);
			el.dataset.orderIndex = String(orderIndex);
			const displayDepth = baseDepth + siblingIndex + orderIndex;
			el.dataset.depth = String(displayDepth);
			el.style.setProperty("--aos-base-depth", String(baseDepth));
			el.style.setProperty("--aos-sibling-index", String(siblingIndex));
			el.style.setProperty("--aos-order-index", String(orderIndex));
			el.style.setProperty("--aos-depth", String(displayDepth));
		}
	}
};

type TPos = [baseDepth: number, nextChildIndex: number, orderIndex: number];

const tagAllUnderMain = (): void => {
	const main = document.querySelector("main");
	if (!main) return;
	let orderCounter = 0;
	const pos = new WeakMap<Element, TPos>();
	const nextChildIndexByParent = new Map<Element, number>();
	const existing = Array.from(main.querySelectorAll(".aos"));
	const ensureParentSeeded = (parent: Element) => {
		if (pos.has(parent)) return;
		let baseDepth = -1;
		if (parent !== main && parent instanceof HTMLElement) {
			const bd = Number(parent.dataset.baseDepth);
			if (Number.isFinite(bd)) baseDepth = bd;
		}
		pos.set(parent, [
			baseDepth,
			nextChildIndexByParent.get(parent) ?? 0,
			-1,
		]);
	};

	const nearestUnskippedParent = (el: Element): Element => {
		let p = el.parentElement;
		while (p && p !== main && shouldSkip(p)) p = p.parentElement;
		return p ?? main;
	};
	pos.set(main, [-1, 0, -1]);

	for (const el of existing) {
		if (!(el instanceof HTMLElement)) continue;
		const oi = Number(el.dataset.orderIndex);
		if (Number.isFinite(oi) && oi + 1 > orderCounter) orderCounter = oi + 1;
	}

	for (const el of existing) {
		if (shouldSkip(el)) continue;
		const parent = nearestUnskippedParent(el);
		nextChildIndexByParent.set(
			parent,
			(nextChildIndexByParent.get(parent) ?? 0) + 1
		);
	}

	if (nextChildIndexByParent.has(main))
		pos.set(main, [-1, nextChildIndexByParent.get(main)!, -1]);

	main.querySelectorAll("*:not(.aos)").forEach((el) => {
		if (shouldSkip(el)) return;

		const parent = nearestUnskippedParent(el);
		ensureParentSeeded(parent);

		const [parentBase, nextChildIndex] = pos.get(parent)!;

		const baseDepth = parentBase + 1;
		const siblingIndex = nextChildIndex;
		const orderIndex = orderCounter++;

		pos.set(parent, [parentBase, nextChildIndex + 1, pos.get(parent)![2]]);

		pos.set(el, [baseDepth, 0, orderIndex]);
		setElementProperties(el, baseDepth, siblingIndex, orderIndex);
	});
};

const observeAll = (io: IntersectionObserver) => {
	cleanSVGAccidents();
	tagAllUnderMain();
	document.querySelectorAll(".aos").forEach((el) => {
		io.observe(el as HTMLElement);
	});
};

const animationTagging = () => {
	const io = new IntersectionObserver(
		(entries) => {
			for (const entry of entries) {
				if (entry.isIntersecting) {
					entry.target.classList.add("is-visible");
					io.unobserve(entry.target);
				}
			}
		},
		{ threshold: 0.1, root: null, rootMargin: "-1px -1px -1px -1px" }
	);

	observeAll(io);

	const mo = new MutationObserver(() => observeAll(io));
	mo.observe(document.body, { childList: true, subtree: true });

	return () => {
		io.disconnect();
		mo.disconnect();
	};
};

const useAnimationTagging = () => {
	useEffect(animationTagging, [useLocation().pathname]);
};

export { useAnimationTagging };
