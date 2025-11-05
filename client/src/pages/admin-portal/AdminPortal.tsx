import { Page } from "../../features/page/Page";

const AdminPortal: React.FC = () => (
	<div style={{ height: "500px", width: "500px", background: "red" }}>
		<h1 style={{ color: "black" }}>Hello Testing</h1>
	</div>
);

const AdminPage = () => <Page page={AdminPortal} />;
export default AdminPage;
