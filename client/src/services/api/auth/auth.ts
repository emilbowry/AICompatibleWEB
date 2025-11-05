// client/src/services/api/auth/auth.ts

import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { AppDispatch } from "../../../store";
import { fetchCurrentUser, logoutUser, selectUser } from "./auth.slice";

const useAuthInit = () => {
	const dispatch = useDispatch<AppDispatch>();
	const location = useLocation();
	const navigate = useNavigate();
	const hasRunInitialFetch = useRef(false);

	useEffect(() => {
		const searchParams = new URLSearchParams(location.search);
		const isLoginRedirect = searchParams.has("login_success");

		if (isLoginRedirect) {
			dispatch(fetchCurrentUser());
			navigate(location.pathname, { replace: true });
		} else if (!hasRunInitialFetch.current) {
			dispatch(fetchCurrentUser());
			hasRunInitialFetch.current = true;
		}
	}, [dispatch, location.pathname, location.search, navigate]);
};
const useLogout = () => {
	const dispatch = useDispatch<AppDispatch>();
	return () => {
		dispatch(logoutUser());
	};
};

const useAccountId = (): string | null => {
	const user = useSelector(selectUser);
	return user?.id ?? null;
};

const useRoles = () => {
	const [role, setRole] = useState<string[]>(["default"]);

	useEffect(() => {
		const fetchRole = async () => {
			try {
				const response = await fetch("/api/auth/role");
				if (response.ok) {
					const data = await response.json();
					setRole(data.roles);
				}
			} catch (error) {
				console.error("Failed to fetch role:", error);
			}
		};

		fetchRole();
	}, []);
	return role;
};

export { useAccountId, useAuthInit, useLogout, useRoles };
