// src/store.ts
import { configureStore } from "@reduxjs/toolkit";

import outreachFormReducer from "./features/outreach-form/OutReachForm.slice";
import authReducer from "./services/api/auth/auth.slice";
const store = configureStore({
	reducer: {
		outreachForm: outreachFormReducer,
		auth: authReducer,
	},
});

export { store };

type RootState = ReturnType<typeof store.getState>;
type AppDispatch = typeof store.dispatch;
export type { AppDispatch, RootState };
