const ModalBackdropStyle: React.CSSProperties = {
	position: "fixed",
	top: 0,
	left: 0,
	right: 0,
	bottom: 0,
	background: "transparent",
	maxHeight: "100vh",

	display: "flex",
	justifyContent: "center",
	alignItems: "center",
	zIndex: 1000,
};

const ModalWrapperStyle: React.CSSProperties = {
	position: "relative",
	display: "inline-block",
};

const ModalContentStyle: React.CSSProperties = {
	background: "transparent",
	backdropFilter: "blur(16px)",

	boxShadow: "0 4px 12px rgba(0, 0, 0, 0.2)",
	overflowY: "scroll",
};

const CloseButtonStyle: React.CSSProperties = {
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
export {
	CloseButtonStyle,
	ModalBackdropStyle,
	ModalContentStyle,
	ModalWrapperStyle,
};
