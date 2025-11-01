// client/src/services/api/auth/auth.ts

import { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { AppDispatch } from "../../../store";
import { fetchCurrentUser, logoutUser, selectUser } from "./auth.slice";

// const useAuthInit = () => {
// 	const dispatch = useDispatch<AppDispatch>();

// 	useEffect(() => {
// 		dispatch(fetchCurrentUser());
// 	}, [dispatch]);
// };

// const useAuthInit = () => {
// 	const dispatch = useDispatch<AppDispatch>();
// 	const location = useLocation();
// 	const navigate = useNavigate();

// 	useEffect(() => {
// 		const searchParams = new URLSearchParams(location.search);
// 		if (searchParams.has("login_success")) {
// 			dispatch(fetchCurrentUser());

// 			navigate(location.pathname, { replace: true });
// 		}
// 	}, [dispatch, location, navigate]);

// 	useEffect(() => {
// 		dispatch(fetchCurrentUser());
// 	}, [dispatch]);
// };
const useAuthInit = () => {
	const dispatch = useDispatch<AppDispatch>();
	const location = useLocation();
	const navigate = useNavigate();
	const hasRunInitialFetch = useRef(false);

	useEffect(() => {
		const searchParams = new URLSearchParams(location.search);
		const isLoginRedirect = searchParams.has("login_success");

		// Case 1: This is a redirect after a successful login.
		if (isLoginRedirect) {
			// Fetch the new user session.
			dispatch(fetchCurrentUser());
			// Clean the '?login_success=true' from the URL. This will cause one re-render.
			// On the next run of this effect, 'isLoginRedirect' will be false, breaking the loop.
			navigate(location.pathname, { replace: true });
		}
		// Case 2: This is the first-ever load of the app (not a login redirect).
		else if (!hasRunInitialFetch.current) {
			// Fetch to check for a persistent session from a cookie.
			dispatch(fetchCurrentUser());
			// Mark that the initial fetch has been done so this block doesn't run again.
			hasRunInitialFetch.current = true;
		}
	}, [dispatch, location.pathname, location.search, navigate]); // Dependencies are now precise
};
const useLogout = () => {
	const dispatch = useDispatch<AppDispatch>();
	return () => {
		dispatch(logoutUser());
	};
};

const useAccountId = (): string | null => {
	const user = useSelector(selectUser);
	return user?.id ?? null; // Use optional chaining and nullish coalescing for safety
};
export { useAccountId, useAuthInit, useLogout };
