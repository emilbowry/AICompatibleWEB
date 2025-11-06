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
const useAccessRoutes = (role: string[]) =>
	role.includes("ADMIN")
		? AdminRoutes
		: role.includes("USER")
		? TestSideBar
		: AllRoutes["DEFAULT"];
const DRouter: React.FC = () => {
	const role = useRoles();
	const _routes = useAccessRoutes(role);
	const routes = _routes.flat(2); //[..._routes[0]];
	// const flatRoutes: IRoutes[] = _routes.flat(2);
	// const a = [[1, 2, 3, ],[4, 5]];
	// console.log(([] as any).concat(a));
	// if (_routes[1].length > 0) routes.push(_routes[1]);
	return (
		<Routes>
			{routes.map((link, i) => {
				const item = link;
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
