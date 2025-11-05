// client/src/features/access-managment/router.tsx

import { Route, Routes } from "react-router-dom";
import { useRoles } from "../../services/api/auth/auth";
import { IRoutes } from "./accessmanagent.types";
import { AdminRoutes, default_routes, TestSideBar } from "./default_routes";

const AllRoutes: Record<string, [IRoutes[][], IRoutes[]]> = {
	DEFAULT: default_routes,
	USER: TestSideBar,
	ADMIN: AdminRoutes,
};
const useAccessRoutes = (roles: string[]) =>
	roles.includes("ADMIN")
		? AdminRoutes
		: roles.includes("USER")
		? TestSideBar
		: AllRoutes["DEFAULT"];
const DRouter: React.FC = () => {
	const role = useRoles();
	console.log(role);
	const _routes = useAccessRoutes(role);
	const routes = [..._routes[0]];
	if (_routes[1].length > 0) routes.push(_routes[1]);
	return (
		<Routes>
			{routes.map((link, i) => {
				const item = link[0];
				const Comp = item.component;
				return (
					<Route
						path={item.path}
						element={<Comp />}
						key={i}
					/>
				);
			})}
		</Routes>
	);
};
export { DRouter, useAccessRoutes, useRoles };
