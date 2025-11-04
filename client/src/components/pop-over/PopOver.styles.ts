const ModalBackdropStyle: React.CSSProperties = {
	position: "fixed",
	top: 0,
	left: 0,
	right: 0,
	bottom: 0,
	maxHeight: "100vh",
	display: "flex",
	justifyContent: "center",
	alignItems: "center",
	flexGrow: 1,
	zIndex: 1000,
};

const ModalWrapperStyle: React.CSSProperties = {
	position: "relative",
};

const ModalContentStyle: React.CSSProperties = {
	display: "flex",

	backgroundColor: "rgb(255 255 255 / 40%)",
	background: `linear-gradient(to bottom, rgb(255 222 89 / 10%), rgb(12 192 223 / 10%)),
		rgb(255 255 255 / 50%)`,
	backdropFilter: "blur(8px)",
	borderRadius: "2%",
	boxShadow: "0 4px 12px rgba(2, 1, 1, 0.2)",
};

const CloseButtonStyle: React.CSSProperties = {
	position: "absolute",
	top: "0",
	right: "0",
	marginTop: "-24px",
	marginRight: "-24px",
	fontWeight: "bold",

	color: "black",
};
export {
	CloseButtonStyle,
	ModalBackdropStyle,
	ModalContentStyle,
	ModalWrapperStyle,
};
