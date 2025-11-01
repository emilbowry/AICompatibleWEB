// client/src/services/api/auth/auth.ts

import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { AppDispatch } from "../../../store";
import { fetchCurrentUser } from "./auth.slice";

// const useAuthInit = () => {
// 	const dispatch = useDispatch<AppDispatch>();

// 	useEffect(() => {
// 		dispatch(fetchCurrentUser());
// 	}, [dispatch]);
// };

const useAuthInit = () => {
	const dispatch = useDispatch<AppDispatch>();
	const location = useLocation();
	const navigate = useNavigate();

	useEffect(() => {
		const searchParams = new URLSearchParams(location.search);
		if (searchParams.has("login_success")) {
			dispatch(fetchCurrentUser());

			navigate(location.pathname, { replace: true });
		}
	}, [dispatch, location, navigate]);

	useEffect(() => {
		dispatch(fetchCurrentUser());
	}, [dispatch]);
};
export { useAuthInit };
