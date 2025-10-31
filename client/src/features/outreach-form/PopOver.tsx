import React, {
	createContext,
	ReactNode,
	useEffect,
	useRef,
	useState,
} from "react";
import ReactDOM from "react-dom";
import { useHref } from "react-router-dom";

const modalRoot = document.getElementById("modal-root");

const modalBackdropStyle: React.CSSProperties = {
	position: "fixed",
	top: 0,
	left: 0,
	right: 0,
	bottom: 0,
	// backgroundColor: "transparent",
	background: "transparent",
	// maxHeight: "90vh",
	maxHeight: "100vh",

	display: "flex",
	justifyContent: "center",
	alignItems: "center",
	zIndex: 1000,
};

const modalWrapperStyle: React.CSSProperties = {
	position: "relative",
	display: "inline-block",
};

const modalContentStyle: React.CSSProperties = {
	background: "transparent",
	backdropFilter: "blur(16px)",

	boxShadow: "0 4px 12px rgba(0, 0, 0, 0.2)",
	overflowY: "scroll",
};

const closeButtonStyle: React.CSSProperties = {
	position: "absolute",
	top: "0",
	right: "0",
	marginTop: "-24px",
	marginRight: "-24px",
	fontWeight: "bold",
	backgroundColor: "#CCC",
	zIndex: 1001,
	color: "black",
};

interface ToggleablePortalProps {
	node?: ReactNode;
	text?: string;
	styling?: React.CSSProperties;
	default_open?: boolean;
}

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
			style={modalBackdropStyle}
			onClick={handleBackdropClick}
			className="no-aos"
		>
			{/* NEW WRAPPER HERE */}
			<div style={modalWrapperStyle}>
				{/* BUTTON IS NOW CHILD OF THE WRAPPER */}
				<button
					onClick={closeModal}
					style={closeButtonStyle}
				>
					&times;
				</button>

				{/* CONTENT IS ALSO CHILD OF THE WRAPPER */}
				<div style={modalContentStyle}>{node}</div>
			</div>
		</div>,
		elRef.current
	);
};

const ToggleablePortal: React.FC<ToggleablePortalProps> = ({
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

export { PortalContext, ToggleablePortal };
