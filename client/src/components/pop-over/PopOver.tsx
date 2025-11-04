// client/src/features/outreach-form/PopOver.tsx

import React, { createContext, useMemo, useState } from "react";
import ReactDOM from "react-dom";
import { useHref } from "react-router-dom";
import {
	CloseButtonStyle,
	ModalBackdropStyle,
	ModalContentStyle,
	ModalWrapperStyle,
} from "./PopOver.styles";
import { IToggleablePortalProps } from "./PopOver.types";

const PortalContext = createContext<undefined | { source: string }>(undefined);
const getModalID = () => `modal-root-${Math.random().toString(36).slice(2, 8)}`;

const useModalRoot = (closeModal?: () => void) => {
	const containerEl = useMemo(() => {
		const c = document.createElement("div");
		const modal_root = document.createElement("div");
		modal_root.id = getModalID();
		document.body.appendChild(modal_root);
		modal_root.appendChild(c);
		return c;
	}, []);

	const handleExit = () => {
		closeModal?.();
		containerEl.parentElement?.remove();
	};
	return { containerEl, handleExit };
};
const ModalBody: React.FC<{
	closeModal: () => void;
	node?: React.ReactNode;
}> = ({ closeModal, node }) => {
	const { containerEl, handleExit } = useModalRoot(closeModal);

	return ReactDOM.createPortal(
		<div
			style={ModalBackdropStyle}
			onClick={handleExit}
			className="no-aos"
		>
			<div style={ModalWrapperStyle}>
				<button
					onClick={handleExit}
					style={CloseButtonStyle}
				>
					&times;
				</button>
				<div style={ModalContentStyle}>{node}</div>
			</div>
		</div>,
		containerEl
	);
};

const ToggleablePortal: React.FC<IToggleablePortalProps> = ({
	node,
	text = "open",
	styling = {},
	default_open = false,
}) => {
	const [isOpen, setIsOpen] = useState(default_open);
	const source = useHref("");
	const openModal = () => setIsOpen(true);
	const closeModal = () => setIsOpen(false);

	return (
		<>
			<PortalContext value={{ source }}>
				<a
					onClick={openModal}
					style={styling}
				>
					{text}
				</a>

				{isOpen && (
					<ModalBody
						closeModal={closeModal}
						node={node}
					/>
				)}
			</PortalContext>
		</>
	);
};

export { ModalBody, PortalContext, ToggleablePortal };
