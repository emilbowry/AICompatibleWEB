// client/src/features/outreach-form/PopOver.tsx

import React, {
	createContext,
	useEffect,
	useMemo,
	useRef,
	useState,
} from "react";
import ReactDOM from "react-dom";
import { useHref } from "react-router-dom";
import {
	CloseButtonStyle,
	ModalBackdropStyle,
	ModalContentStyle,
	ModalWrapperStyle,
} from "./PopOver.styles";
import { IToggleablePortalProps } from "./PopOver.types";

// const modalRoot = document.getElementById("modal-root");

const PortalContext = createContext<undefined | { source: string }>(undefined);
const getModalID = () => `modal-root-${Math.random().toString(36).slice(2, 8)}`;

// const useAModalRoot = () => {
// 	const [containerEl] = useState(() => document.createElement("div"));

// 	const modal_root = useMemo(() => {
// 		const m = document.createElement("div");
// 		m.id = getModalID();
// 		document.body.appendChild(m);

// 		return m;
// 	}, []);

// 	useEffect(() => {
// 		modal_root.appendChild(containerEl);
// 		document.body.style.overflow = "hidden";

// 		return () => {
// 			if (containerEl) {
// 				modal_root.removeChild(containerEl);
// 			}
// 			document.body.style.overflow = "unset";
// 		};
// 	}, [containerEl, modal_root]);
// 	// return containerEl;
// 	// const containerEl = useMemo(() => {
// 	// 	const c = document.createElement("div");
// 	// 	const modal_root = document.createElement("div");
// 	// 	modal_root.id = getModalID();
// 	// 	document.body.appendChild(modal_root);
// 	// 	modal_root.appendChild(c);

// 	// }, []);
// 	return containerEl;
// };

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
	// const [containerEl] = useState(() => document.createElement("div"));
	// // const [modalRoot] = useState(() => document.createElement("div"));

	// const modal_root = useMemo(() => {
	// 	const m = document.createElement("div");
	// 	m.id = getModalID();
	// 	document.body.appendChild(m);

	// 	return m;
	// }, []);

	// useEffect(() => {
	// 	modal_root.appendChild(containerEl);
	// 	document.body.style.overflow = "hidden";

	// 	return () => {
	// 		if (containerEl) {
	// 			modal_root.removeChild(containerEl);
	// 		}
	// 		document.body.style.overflow = "unset";
	// 	};
	// }, [containerEl, modal_root]);
	const { containerEl, handleExit } = useModalRoot(closeModal);
	const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
		if (e.target === e.currentTarget) {
			// closeModal();
			handleExit();
		}
	};

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
