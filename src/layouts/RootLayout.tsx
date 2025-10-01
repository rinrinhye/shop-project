import {Outlet} from "react-router";
import Header from "../components/Common/Header";

const RootLayout = () => {
	return (
		<>
			<Header />
			<Outlet />
		</>
	);
};

export default RootLayout;
