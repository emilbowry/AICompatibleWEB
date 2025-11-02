// client/src/features/outreach-form/PopOver.tsx

import React, { createContext, useEffect, useRef, useState } from "react";
import ReactDOM from "react-dom";
import { useHref } from "react-router-dom";
import {
	CloseButtonStyle,
	ModalBackdropStyle,
	ModalContentStyle,
	ModalWrapperStyle,
} from "./PopOver.styles";
import { IToggleablePortalProps } from "./PopOver.types";

const modalRoot = document.getElementById("modal-root");

const PortalContext = createContext<undefined | { source: string }>(undefined);

const ModalBody: React.FC<{
	closeModal: () => void;
	node?: React.ReactNode;
}> = ({ closeModal, node }) => {
	const elRef = useRef<HTMLDivElement | null>(null);

	if (elRef.current === null) {
		elRef.current = document.createElement("div");
	}

	useEffect(() => {
		if (!modalRoot || !elRef.current) {
			console.error(
				"Modal Root element not found! Ensure index.html has <div id='modal-root'></div>"
			);
			return;
		}

		modalRoot.appendChild(elRef.current);
		document.body.style.overflow = "hidden";

		return () => {
			if (elRef.current) {
				modalRoot.removeChild(elRef.current);
			}
			document.body.style.overflow = "unset";
		};
	}, []);

	const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
		if (e.target === e.currentTarget) {
			closeModal();
		}
	};

	if (!elRef.current) return null;

	return ReactDOM.createPortal(
		<div
			style={ModalBackdropStyle}
			onClick={handleBackdropClick}
			className="no-aos"
		>
			<div style={ModalWrapperStyle}>
				<button
					onClick={closeModal}
					style={CloseButtonStyle}
				>
					&times;
				</button>
				<div style={ModalContentStyle}>{node}</div>
			</div>
		</div>,
		elRef.current
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
