// client/src/services/api/auth/auth.slice.ts

import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { RootState } from "../../../store";
import { IAuthState, IUserProfile } from "./auth.types";

const initialState: IAuthState = {
	user: null,
	status: "idle",
	error: null,
};

const fetchCurrentUser = createAsyncThunk<
	IUserProfile,
	void,
	{ rejectValue: string }
>("auth/fetchCurrentUser", async (_, { rejectWithValue }) => {
	try {
		// ADD credentials: 'include' to the fetch options
		const response = await fetch("/api/auth/me", {
			credentials: "include",
		});
		if (!response.ok) {
			throw new Error("No active session found.");
		}
		const user: IUserProfile = await response.json();
		return user;
	} catch (error: any) {
		return rejectWithValue(error.message);
	}
});

const logoutUser = createAsyncThunk(
	"auth/logoutUser",
	async (_, { rejectWithValue }) => {
		try {
			// ADD credentials: 'include' here as well
			const response = await fetch("/api/auth/logout", {
				method: "POST",
				credentials: "include",
			});
			if (!response.ok) {
				throw new Error("Logout failed on the server.");
			}
			return await response.json();
		} catch (error: any) {
			return rejectWithValue(error.message);
		}
	}
);
const authSlice = createSlice({
	name: "auth",
	initialState,
	reducers: {},

	extraReducers: (builder) => {
		builder
			.addCase(fetchCurrentUser.pending, (state) => {
				state.status = "loading";
				state.user = null;
			})
			.addCase(fetchCurrentUser.fulfilled, (state, action) => {
				state.status = "authenticated";
				state.user = action.payload;
			})
			.addCase(fetchCurrentUser.rejected, (state) => {
				state.status = "unauthenticated";
				state.user = null;
			})
			.addCase(logoutUser.fulfilled, (state) => {
				state.status = "unauthenticated";
				state.user = null;
			});
	},
});

export const selectUser = (state: RootState) => state.auth.user;
export const selectAuthStatus = (state: RootState) => state.auth.status;
export { authSlice, fetchCurrentUser, logoutUser };
export default authSlice.reducer;
