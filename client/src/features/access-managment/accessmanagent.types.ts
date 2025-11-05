// client/src/features/access-managment/accessmanagent.types.ts

import { ITitleBarLink } from "../titlebar/TitleBar.types";

interface IRoutes extends ITitleBarLink {
	component: React.FunctionComponent;
}
export { IRoutes };
