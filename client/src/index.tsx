// src/index.tsx

// import React from "react";
import { StrictMode } from "react";
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
root.render(
	<StrictMode>
		<Provider store={store}>
			<BrowserRouter>
				<App />
			</BrowserRouter>
		</Provider>
	</StrictMode>
);
