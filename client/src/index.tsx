// src/index.tsx

import React, { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import "../public/apple-touch-icon.png";
import "../public/favicon-16x16.png";
import "../public/favicon-32x32.png";
import "../public/favicon.ico";
import "../public/site.webmanifest";
import App from "./App";
import { store } from "./store";
const root = createRoot(document.getElementById("root")!);

class ErrorBoundary extends React.Component {
	constructor(props: any) {
		super(props);
		this.state = { error: null };
	}
	static getDerivedStateFromError(error: any) {
		return { error };
	}
	override componentDidCatch(error: any, info: any) {
		console.error("Error caught by boundary:", error, info);
	}
	override render() {
		if ((this.state as any).error) {
			return (
				<pre style={{ whiteSpace: "pre-wrap" }}>
					{(this.state as any).error.toString()}
				</pre>
			);
		}
		return (this.props as any).children;
	}
}

// Then wrap your root:
//   <App />
// </ErrorBoundary>

root.render(
	<ErrorBoundary>
		<StrictMode>
			<Provider store={store}>
				<BrowserRouter>
					<App />
				</BrowserRouter>
			</Provider>
		</StrictMode>
	</ErrorBoundary>
);
